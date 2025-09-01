import z from "zod";

export const registrationDetailsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
  ticketId: z.uuid("Invalid ticket ID"),
  countryCode: z
    .string()
    .min(1, "Country code is required")
    .max(5, "Country code must be at most 5 characters"),
  phoneNumber: z
    .string()
    .min(4, "Phone number must be at least 4 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
});

export type RegistrationDetails = z.infer<typeof registrationDetailsSchema>;
