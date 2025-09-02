"use server";
import { z } from "zod";
import { getTickets as dalGetTickets, createRegistration } from "@/core/dal/registrations";
import { db } from "@/core/db/setup";
import { ticketsTable } from "@/core/db/schemas";
import { getCurrentUser } from "@/core/dal/session";

export async function getTickets() {
  return await dalGetTickets();
}

const registrationSchema = z.object({
  firstname: z.string().min(2),
  lastname: z.string().min(2),
  email: z.string().email(),
  phone_number: z.string().min(6),
  ticket_id: z.string().uuid(),
});

export async function registerForEvent(form: FormData) {
  const parsed = registrationSchema.safeParse({
    firstname: form.get("firstname"),
    lastname: form.get("lastname"),
    email: form.get("email"),
    phone_number: form.get("phone_number"),
    ticket_id: form.get("ticket_id"),
  });
  if (!parsed.success) {
    return { validationErrors: parsed.error.flatten().fieldErrors };
  }
  try {
    const r = await createRegistration(parsed.data);
    return { id: r.id };
  } catch (_e: unknown) {
    return { error: "Unable to complete registration." };
  }
}

const ticketSchema = z.object({
  type: z.string().min(1),
  name: z.string().min(2),
  description: z.string().min(4),
  perks: z.string().min(2),
  fGradient: z.string().optional().nullable(),
  sGradient: z.string().optional().nullable(),
  price: z.coerce.number().int().nonnegative(),
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
      createdBy: user.id,
    })
    .returning();
  return { id: row.id } as const;
}
