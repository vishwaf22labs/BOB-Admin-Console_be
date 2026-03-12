import { Resend } from "resend";

import { env } from "../config/env";

const resend = new Resend(env.resendApiKey);

export async function sendResolutionEmail(
  to: string,
  userName: string,
  ticketId: string,
): Promise<void> {
  const name = userName?.trim() || "Customer";
  const text = [
    `Hi ${name},`,
    "",
    `Your complaint (Ticket ID: ${ticketId}) has been resolved.`,
    "",
    "It's completed. Have a nice day!",
    "",
    "Thank you,",
    "Bank Support Team",
  ].join("\n");

  await resend.emails.send({
    from: env.emailFrom,
    to,
    subject: `Your complaint ${ticketId} has been resolved`,
    text,
  });
}