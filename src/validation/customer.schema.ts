import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(10, "Enter a valid phone number"),
  channelMode: z
    .union([z.literal("sign"), z.literal("chat"), z.literal("voice")])
    .optional(),
});

export type CustomerInput = z.infer<typeof customerSchema>;