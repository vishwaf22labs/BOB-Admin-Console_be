import { Request, Response } from "express";
import { count, like } from "drizzle-orm";

import { db } from "../db/client";
import { complaints, NewComplaint } from "../db/schema";
import { COMPLAINT_STATUSES, ESCALATION_LEVELS } from "../config/constants";
import { IntakeComplaintBody } from "../types/complaints.types";
import { generateTicketId } from "../utils/ticket";

async function getNextTicketId(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `BOB-${year}-`;

  const [{ value: existingCount }] = await db
    .select({ value: count() })
    .from(complaints)
    .where(like(complaints.ticketId, `${prefix}%`));

  const nextNumber = Number(existingCount ?? 0) + 1;
  return generateTicketId(year, nextNumber);
}

export async function intakeComplaint(req: Request, res: Response) {
  const body = req.body as IntakeComplaintBody;

  const requiredFields: (keyof IntakeComplaintBody)[] = [
    "userName",
    "userEmail",
    "userPhone",
    "userBankId",
    "complaintText",
    "complaintSummary",
    "complaintCategory",
    "sourceChannel",
    "languageDetected",
  ];

  for (const field of requiredFields) {
    if (!body[field]) {
      return res.status(400).json({ message: `Missing field: ${field}` });
    }
  }

  const ticketId = await getNextTicketId();

  const newComplaint: NewComplaint = {
    ticketId,
    userName: body.userName,
    userEmail: body.userEmail,
    userPhone: body.userPhone,
    userBankId: body.userBankId,
    complaintText: body.complaintText,
    complaintSummary: body.complaintSummary,
    complaintCategory: body.complaintCategory,
    sourceChannel: body.sourceChannel,
    languageDetected: body.languageDetected,
    signConfidencePct:
      body.signConfidencePct != null ? String(body.signConfidencePct) : null,
    status: COMPLAINT_STATUSES[0],
    assignedTo: ESCALATION_LEVELS[0],
  };

  const [inserted] = await db
    .insert(complaints)
    .values(newComplaint)
    .returning({ id: complaints.id, ticketId: complaints.ticketId });

  return res.status(201).json({
    ticketId: inserted.ticketId,
    complaintId: inserted.id,
  });
}