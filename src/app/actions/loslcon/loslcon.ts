"use server";

import { db } from "@/core/db/setup";
import type { RegistrationDetails } from "./dto";
import { registrationDetailsSchema } from "./dto";
import {
  registrationsConfigTable,
  registrationsTable,
  ticketsTable,
} from "@/core/db/schemas";
import { and, eq } from "drizzle-orm";
import { FedaPay, Transaction } from "fedapay";
import { getEnv } from "@/lib/env";
import { appConfig } from "@/core/utils/config";
import { sendEmail } from "@/core/services/mailing/mailer";
import BroadcastMessage from "@/core/services/mailing/templates/broadcast/message";
import TicketRegistrationSuccessful from "@/core/services/mailing/templates/ticket-registration-successful";
import { z } from "zod";
import { getCurrentUser } from "@/core/dal/session";

export async function register(details: RegistrationDetails) {
  const v = registrationDetailsSchema.safeParse(details);
  if (!v.success) {
    return { validationErrors: v.error.flatten().fieldErrors } as const;
  }
  const alreadyRegistered =
    (
      await db
        .select()
        .from(registrationsTable)
        .where(
          and(
            eq(registrationsTable.email, details.email),
            eq(registrationsTable.confirmed, true),
          ),
        )
        .limit(1)
    ).length > 0;

  if (alreadyRegistered) {
    return { error: "You have already registered for the event." };
  }

  await db
    .delete(registrationsTable)
    .where(eq(registrationsTable.email, details.email));

  const [registrationsConfig] = await db
    .select()
    .from(registrationsConfigTable)
    .limit(1);

  if (!registrationsConfig.registrationsOpen) {
    return { error: "Registrations are currently closed." };
  }
  const [ticket] = await db
    .select()
    .from(ticketsTable)
    .where(eq(ticketsTable.id, details.ticketId))
    .limit(1);

  if (!ticket) {
    return { error: "The selected ticket is invalid." };
  }

  // Prevent registrations for sold-out tickets
  if (ticket.soldout) {
    return { error: "The selected ticket is sold out." } as const;
  }

  const [registration] = await db
    .insert(registrationsTable)
    .values({
      email: details.email,
      firstname: details.firstName,
      lastname: details.lastName,
      phone_number: details.phoneNumber,
      ticket_id: details.ticketId,
      confirmed: ticket.price === 0,
    })
    .returning();

  if (ticket.price > 0) {
    try {
      FedaPay.setApiKey(getEnv("FEDAPAY_PRIVATE_KEY"));
      FedaPay.setEnvironment(getEnv("FEDA_PAY_ENVIRONMENT"));
      const transaction = await Transaction.create({
        description: `Registration for LOSL-CON by ${details.firstName} ${details.lastName} - ${ticket.name} | ${ticket.price} XOF`,
        amount: ticket.price,
        callback_url: `${appConfig.appBaseUrl}/registrations/callback`,
        currency: { iso: "XOF" },
        customer: {
          firstname: details.firstName,
          lastname: details.lastName,
          email: details.email,
          phone_number: {
            number: details.phoneNumber,
            country: details.countryCode,
          },
        },
      });
      const txId = transaction?.id ? String(transaction.id) : "";
      if (txId) {
        await db
          .update(registrationsTable)
          .set({ transaction_id: txId })
          .where(eq(registrationsTable.id, registration.id));
      }
      let paymentUrl = "";
      if (
        transaction?.generateToken &&
        typeof transaction.generateToken === "function"
      ) {
        const tokenRes = await transaction.generateToken();
        paymentUrl = tokenRes?.url ?? "";
      }
      if (!paymentUrl) {
        return {
          error: "Unable to initialize payment. Please try again.",
        } as const;
      }
      return { paymentUrl } as const;
    } catch (e) {
      await db
        .delete(registrationsTable)
        .where(eq(registrationsTable.id, registration.id));
      console.error("Payment setup error:", e);
      return {
        error: "Payment setup failed. Please check configuration.",
      } as const;
    }
  }
  const ticketDownloadUrl = `${appConfig.appBaseUrl}/tickets/download/${registration.id}`;
  // Notify attendee for free tickets immediately with template
  await sendEmail({
    from: { email: appConfig.appEmail, name: appConfig.appName },
    to: details.email,
    subject: "Your LOSL-CON ticket",
    component: TicketRegistrationSuccessful,
    props: {
      eventName: "LOSL-CON",
      attendeeName: `${details.firstName} ${details.lastName}`.trim(),
      ticketId: registration.id,
      ticketType: ticket.name,
      eventDate: "22 November 2025",
      eventLocation: "Institut Français du Togo",
      viewTicketUrl: ticketDownloadUrl,
      addToCalendarUrl: undefined,
      supportEmail: appConfig.supportEmail || appConfig.appEmail,
      appName: appConfig.appName,
      bannerUrl: `${appConfig.appBaseUrl}/event-cover.jpg`,
    },
  });
  return {
    message: "Registration successful. See you at the event!",
    ticketDownloadUrl: ticketDownloadUrl,
  };
}

export async function getTicketInfo(registrationId: string) {
  const [r] = await db
    .select()
    .from(registrationsTable)
    .innerJoin(ticketsTable, eq(ticketsTable.id, registrationsTable.ticket_id))
    .where(eq(registrationsTable.id, registrationId))
    .limit(1);

  if (!r.registrations) {
    return { error: "Invalid registration ID" };
  }

  return {
    details: {
      firstName: r.registrations.firstname,
      lastName: r.registrations.lastname,
      email: r.registrations.email,
      phoneNumber: r.registrations.phone_number,
      ticketName: r.tickets.name,
      ticketPrice: r.tickets.price,
      confirmed: r.registrations.confirmed,
      registrationDate: r.registrations.createdAt,
    },
    ticket: {
      id: r.tickets.id,
      name: r.tickets.name,
      description: r.tickets.description,
      price: r.tickets.price,
      fGradient: r.tickets.fGradient,
      sGradient: r.tickets.sGradient,
      soldout: r.tickets.soldout,
    },
  };
}

export async function getTickets() {
  return await db
    .select({
      id: ticketsTable.id,
      type: ticketsTable.type,
      name: ticketsTable.name,
      description: ticketsTable.description,
      perks: ticketsTable.perks,
      fGradient: ticketsTable.fGradient,
      sGradient: ticketsTable.sGradient,
      price: ticketsTable.price,
      soldout: ticketsTable.soldout,
    })
    .from(ticketsTable);
}

export async function getRegistrationsConfig() {
  const [row] = await db.select().from(registrationsConfigTable).limit(1);
  return row;
}

export async function confirmPayment(transactionId: string) {
  try {
    FedaPay.setApiKey(getEnv("FEDAPAY_PRIVATE_KEY"));
    FedaPay.setEnvironment(getEnv("FEDA_PAY_ENVIRONMENT"));
    const tx: unknown = await Transaction.retrieve(transactionId);
    const status = (() => {
      if (!tx || typeof tx !== "object") return null;
      const rec = tx as Record<string, unknown>;
      const s = rec["status"];
      const st = rec["state"];
      if (typeof s === "string") return s;
      if (typeof st === "string") return st;
      return null;
    })();
    if (!status)
      return { error: "Unable to fetch transaction status." } as const;

    if (
      String(status).toLowerCase() === "approved" ||
      String(status).toLowerCase() === "completed"
    ) {
      const [reg] = await db
        .select()
        .from(registrationsTable)
        .where(eq(registrationsTable.transaction_id, String(transactionId)))
        .limit(1);
      if (!reg)
        return { error: "Registration not found for transaction." } as const;

      await db
        .update(registrationsTable)
        .set({ confirmed: true })
        .where(eq(registrationsTable.id, reg.id));

      const ticketDownloadUrl = `${appConfig.appBaseUrl}/tickets/download/${reg.id}`;
      const [tkt] = await db
        .select()
        .from(ticketsTable)
        .where(eq(ticketsTable.id, reg.ticket_id))
        .limit(1);
      // Notify attendee after successful payment with template
      await sendEmail({
        from: { email: appConfig.appEmail, name: appConfig.appName },
        to: reg.email,
        subject: "Your LOSL-CON ticket",
        component: TicketRegistrationSuccessful,
        props: {
          eventName: "LOSL-CON",
          attendeeName: `${reg.firstname} ${reg.lastname}`.trim(),
          ticketId: reg.id,
          ticketType: tkt?.name ?? "Ticket",
          eventDate: "22 November 2025",
          eventLocation: "Institut Français du Togo",
          viewTicketUrl: ticketDownloadUrl,
          addToCalendarUrl: undefined,
          supportEmail: appConfig.supportEmail || appConfig.appEmail,
          appName: appConfig.appName,
          bannerUrl: `${appConfig.appBaseUrl}/event-cover.jpg`,
        },
      });
      return {
        message: "Payment confirmed. Registration completed.",
        ticketDownloadUrl,
      } as const;
    }
    await db
      .delete(registrationsTable)
      .where(eq(registrationsTable.transaction_id, transactionId));
    return { error: `Payment not approved (status: ${status}).` } as const;
  } catch (_e: unknown) {
    return { error: "Payment verification failed." } as const;
  }
}

export async function resendTicketEmail(registrationId: string) {
  const [r] = await db
    .select()
    .from(registrationsTable)
    .where(eq(registrationsTable.id, registrationId))
    .limit(1);
  if (!r) return { error: "Registration not found." } as const;
  if (!r.confirmed)
    return { error: "Registration is not confirmed yet." } as const;

  const ticketDownloadUrl = `${appConfig.appBaseUrl}/tickets/download/${r.id}`;
  const [tkt2] = await db
    .select()
    .from(ticketsTable)
    .where(eq(ticketsTable.id, r.ticket_id))
    .limit(1);
  // Use template for resend as well
  await sendEmail({
    from: { email: appConfig.appEmail, name: appConfig.appName },
    to: r.email,
    subject: "Your LOSL-CON ticket",
    component: TicketRegistrationSuccessful,
    props: {
      eventName: "LOSL-CON",
      attendeeName: `${r.firstname} ${r.lastname}`.trim(),
      ticketId: r.id,
      ticketType: tkt2?.name ?? "Ticket",
      eventDate: "22 November 2025",
      eventLocation: "Institut Français du Togo",
      viewTicketUrl: ticketDownloadUrl,
      addToCalendarUrl: undefined,
      supportEmail: appConfig.supportEmail || appConfig.appEmail,
      appName: appConfig.appName,
      bannerUrl: `${appConfig.appBaseUrl}/event-cover.jpg`,
    },
  });
  return { message: "Ticket email sent." } as const;
}

const broadcastSchema = z.object({
  scope: z.enum(["all", "confirmed", "unconfirmed"]).default("all"),
  subject: z.string().min(3),
  message: z.string().min(1),
});

export async function broadcastMessage(form: FormData) {
  const user = await getCurrentUser();
  if (!user || user.accessLevel > 0) {
    return { error: "Unauthorized" } as const;
  }
  const parsed = broadcastSchema.safeParse({
    scope: String(form.get("scope") || "all"),
    subject: String(form.get("subject") || "").trim(),
    message: String(form.get("message") || "").trim(),
  });
  if (!parsed.success) {
    return { validationErrors: parsed.error.flatten().fieldErrors } as const;
  }
  const scope = parsed.data.scope;

  const regs = await db.select().from(registrationsTable);
  const targets = regs.filter((r) =>
    scope === "all" ? true : scope === "confirmed" ? r.confirmed : !r.confirmed,
  );

  targets.forEach((r, i) => {
    setTimeout(
      () => {
        sendEmail({
          to: r.email,
          subject: parsed.data.subject,
          component: BroadcastMessage,
          props: {
            name: `${r.firstname}`.trim(),
            message: parsed.data.message,
          },
        });
      },
      5000 * (i + 1),
    );
  });
  return {
    message: `Broadcast queued to ${targets.length} recipients.`,
  } as const;
}

// Form-Data facing server actions (migrated from events.ts)
const registrationSchema = z.object({
  firstname: z.string().min(2),
  lastname: z.string().min(2),
  email: z.email(),
  phone_number: z.string().min(4),
  ticket_id: z.uuid(),
  country_code: z.string().min(1),
});

export async function registerForEvent(form: FormData) {
  const parsed = registrationSchema.safeParse({
    firstname: form.get("firstname"),
    lastname: form.get("lastname"),
    email: form.get("email"),
    phone_number: form.get("phone_number"),
    ticket_id: form.get("ticket_id"),
    country_code: form.get("country_code"),
  });
  if (!parsed.success) {
    return { validationErrors: parsed.error.flatten().fieldErrors } as const;
  }
  const out = await register({
    firstName: parsed.data.firstname,
    lastName: parsed.data.lastname,
    email: parsed.data.email,
    phoneNumber: parsed.data.phone_number,
    ticketId: parsed.data.ticket_id,
    countryCode: parsed.data.country_code,
  });
  return out;
}

const ticketSchema = z.object({
  type: z.string().min(1),
  name: z.string().min(2),
  description: z.string().min(4),
  perks: z.string().min(2),
  fGradient: z.string().optional().nullable(),
  sGradient: z.string().optional().nullable(),
  price: z.coerce.number().int().nonnegative(),
  soldout: z.coerce.boolean().optional().default(false),
});

export async function createTicket(form: FormData) {
  const user = await getCurrentUser();
  if (!user || user.accessLevel > 0) {
    return { error: "Unauthorized" } as const;
  }
  const parsed = ticketSchema.safeParse({
    type: form.get("type"),
    name: form.get("name"),
    description: form.get("description"),
    perks: form.get("perks"),
    fGradient: form.get("fGradient") || null,
    sGradient: form.get("sGradient") || null,
    price: form.get("price"),
    soldout: form.get("soldout"),
  });
  if (!parsed.success) {
    return { validationErrors: parsed.error.flatten().fieldErrors } as const;
  }
  const [row] = await db
    .insert(ticketsTable)
    .values({
      type: parsed.data.type,
      name: parsed.data.name,
      description: parsed.data.description,
      perks: parsed.data.perks,
      fGradient: parsed.data.fGradient ?? null,
      sGradient: parsed.data.sGradient ?? null,
      price: parsed.data.price,
      soldout: parsed.data.soldout ?? false,
      createdBy: user.id,
    })
    .returning();
  return { id: row.id } as const;
}

export async function updateRegistrationsConfig(form: FormData) {
  const user = await getCurrentUser();
  if (!user || user.accessLevel > 0) {
    return { error: "Unauthorized" } as const;
  }
  // Checkbox comes as present/absent
  const open = form.get("registrationsOpen") != null;
  const closeRaw = (form.get("registrationsCloseDate") ?? "").toString().trim();
  let closeDate: Date | null = null;
  if (closeRaw) {
    const d = new Date(closeRaw);
    if (Number.isNaN(d.getTime())) {
      return {
        validationErrors: { registrationsCloseDate: ["Invalid date"] },
      } as const;
    }
    closeDate = d;
  }

  const [existing] = await db.select().from(registrationsConfigTable).limit(1);
  if (existing) {
    await db
      .update(registrationsConfigTable)
      .set({
        registrationsOpen: open,
        registrationsCloseDate: closeDate ?? null,
      })
      .where(eq(registrationsConfigTable.id, existing.id));
  } else {
    await db.insert(registrationsConfigTable).values({
      id: 1,
      registrationsOpen: open,
      registrationsCloseDate: closeDate ?? null,
    });
  }
  return { message: "Settings updated." } as const;
}

// Client-safe wrapper for useActionState in client components
export async function saveRegistrationSettings(_prev: unknown, form: FormData) {
  "use server";
  return await updateRegistrationsConfig(form);
}

// Admin: update/delete ticket actions
const ticketUpdateSchema = z.object({
  id: z.uuid(),
  type: z.string().min(1),
  name: z.string().min(2),
  description: z.string().min(4),
  perks: z.string().min(2),
  fGradient: z.string().optional().nullable(),
  sGradient: z.string().optional().nullable(),
  price: z.coerce.number().int().nonnegative(),
  soldout: z.coerce.boolean().optional().default(false),
});

export async function updateTicket(form: FormData) {
  const user = await getCurrentUser();
  if (!user || user.accessLevel > 0) {
    return { error: "Unauthorized" } as const;
  }
  const parsed = ticketUpdateSchema.safeParse({
    id: form.get("id"),
    type: form.get("type"),
    name: form.get("name"),
    description: form.get("description"),
    perks: form.get("perks"),
    fGradient: form.get("fGradient") || null,
    sGradient: form.get("sGradient") || null,
    price: form.get("price"),
    soldout: form.get("soldout"),
  });
  if (!parsed.success) {
    return { validationErrors: parsed.error.flatten().fieldErrors } as const;
  }
  await db
    .update(ticketsTable)
    .set({
      type: parsed.data.type,
      name: parsed.data.name,
      description: parsed.data.description,
      perks: parsed.data.perks,
      fGradient: parsed.data.fGradient ?? null,
      sGradient: parsed.data.sGradient ?? null,
      price: parsed.data.price,
      soldout: parsed.data.soldout ?? false,
    })
    .where(eq(ticketsTable.id, parsed.data.id));
  return { message: "Ticket updated." } as const;
}

export async function deleteTicket(form: FormData) {
  const user = await getCurrentUser();
  if (!user || user.accessLevel > 0) {
    return { error: "Unauthorized" } as const;
  }
  const id = String(form.get("id") || "").trim();
  if (!id) return { error: "Missing ticket id" } as const;
  await db.delete(ticketsTable).where(eq(ticketsTable.id, id));
  return { message: "Ticket deleted." } as const;
}

// Admin: quick toggle for soldout state
const ticketSoldoutSchema = z.object({
  id: z.string().uuid(),
  soldout: z.coerce.boolean().default(false),
});

export async function setTicketSoldout(form: FormData) {
  const user = await getCurrentUser();
  if (!user || user.accessLevel > 0) {
    return { error: "Unauthorized" } as const;
  }
  const parsed = ticketSoldoutSchema.safeParse({
    id: form.get("id"),
    soldout: form.get("soldout"), // checkbox presence
  });
  if (!parsed.success) {
    return { validationErrors: parsed.error.flatten().fieldErrors } as const;
  }
  await db
    .update(ticketsTable)
    .set({ soldout: parsed.data.soldout })
    .where(eq(ticketsTable.id, parsed.data.id));
  return {
    message: parsed.data.soldout ? "Marked sold out." : "Marked available.",
  } as const;
}

// Admin: registration detail and attendance toggle
export async function getRegistrationById(registrationId: string) {
  const user = await getCurrentUser();
  if (!user || user.accessLevel > 0) {
    return { error: "Unauthorized" } as const;
  }
  const [row] = await db
    .select()
    .from(registrationsTable)
    .where(eq(registrationsTable.id, registrationId))
    .limit(1);
  if (!row) return { error: "Not found" } as const;
  return row;
}

export async function markRegistrationAttended(form: FormData) {
  const user = await getCurrentUser();
  if (!user || user.accessLevel > 0) {
    return { error: "Unauthorized" } as const;
  }
  const id = String(form.get("id") || "").trim();
  if (!id) return { error: "Missing registration id" } as const;
  await db
    .update(registrationsTable)
    .set({ attended: true })
    .where(eq(registrationsTable.id, id));
  return { message: "Marked as attended." } as const;
}

// Admin: update and delete registrations
const registrationUpdateSchema = z.object({
  id: z.uuid(),
  ticket_id: z.uuid(),
  confirmed: z.coerce.boolean().optional().default(false),
});

export async function updateRegistration(form: FormData) {
  const user = await getCurrentUser();
  if (!user || user.accessLevel > 0) {
    return { error: "Unauthorized" } as const;
  }
  const parsed = registrationUpdateSchema.safeParse({
    id: form.get("id"),
    ticket_id: form.get("ticket_id"),
    // checkbox is present when checked
    confirmed: form.get("confirmed") != null,
  });
  if (!parsed.success) {
    return { validationErrors: parsed.error.flatten().fieldErrors } as const;
  }
  // Ensure ticket exists
  const [t] = await db
    .select()
    .from(ticketsTable)
    .where(eq(ticketsTable.id, parsed.data.ticket_id))
    .limit(1);
  if (!t) return { error: "Invalid ticket" } as const;

  await db
    .update(registrationsTable)
    .set({ ticket_id: parsed.data.ticket_id, confirmed: parsed.data.confirmed })
    .where(eq(registrationsTable.id, parsed.data.id));
  return { message: "Registration updated." } as const;
}

export async function deleteRegistration(form: FormData) {
  const user = await getCurrentUser();
  if (!user || user.accessLevel > 0) {
    return { error: "Unauthorized" } as const;
  }
  const id = String(form.get("id") || "").trim();
  if (!id) return { error: "Missing registration id" } as const;
  await db.delete(registrationsTable).where(eq(registrationsTable.id, id));
  return { message: "Registration deleted." } as const;
}

// Attendance confirmation
export async function confirmAttendance(registrationId: string) {
  const [reg] = await db
    .select()
    .from(registrationsTable)
    .where(eq(registrationsTable.id, registrationId))
    .limit(1);

  if (!reg) return { error: "Registration not found." } as const;
  if (!reg.confirmed)
    return { error: "Registration not confirmed yet." } as const;
  if (reg.attendanceConfirmed) return { alreadyConfirmed: true } as const;

  await db
    .update(registrationsTable)
    .set({ attendanceConfirmed: true })
    .where(eq(registrationsTable.id, registrationId));

  return { success: true } as const;
}

// Admin: send attendance confirmation emails
export async function broadcastAttendanceConfirmation() {
  const user = await getCurrentUser();
  if (!user || user.accessLevel > 0) {
    return { error: "Unauthorized" } as const;
  }

  const regs = await db
    .select()
    .from(registrationsTable)
    .where(
      and(
        eq(registrationsTable.confirmed, true),
        eq(registrationsTable.attendanceConfirmed, false),
      ),
    );

  const AttendanceConfirmationEmail = (
    await import("@/core/services/mailing/templates/attendance-confirmation")
  ).default;

  // Send emails asynchronously with delays
  const emailPromises = regs.map((r, i) => {
    const confirmUrl = `${appConfig.appBaseUrl}/confirm/${r.id}`;
    return new Promise<void>((resolve) => {
      setTimeout(
        async () => {
          try {
            await sendEmail({
              from: { email: appConfig.appEmail, name: appConfig.appName },
              to: r.email,
              subject: "Confirme ta présence à LOSL-CON 2025",
              component: AttendanceConfirmationEmail,
              props: {
                eventName: "LOSL-CON 2025",
                attendeeName: `${r.firstname.split(" ")[0]}`.trim(),
                eventDate: "22 novembre 2025",
                eventLocation: "Institut Français du Togo, Lomé",
                confirmUrl,
                supportEmail: appConfig.supportEmail || appConfig.appEmail,
                appName: appConfig.appName,
              },
            });
          } catch (error) {
            console.error(
              `Failed to send attendance email to ${r.email}:`,
              error,
            );
          }
          resolve();
        },
        5000 * (i + 1),
      );
    });
  });

  // Wait for all emails to be queued
  await Promise.all(emailPromises);

  return {
    message: `Attendance emails queued to ${regs.length} attendees.`,
    count: regs.length,
  } as const;
}
