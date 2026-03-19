import { and, desc, eq, ilike, or, count, getTableColumns } from "drizzle-orm";
import { db } from "../db/client";
import { complaints } from "../db/schema";
import {
  COMPLAINT_STATUSES,
  EMAIL_CHANNELS,
  SOURCE_CHANNELS,
} from "../config/constants";
import { AuthUser } from "../types/auth.types";
import {
  ListComplaintsQuery,
  ResolveComplaintBody,
} from "../types/complaints.types";
import { sendResolutionEmail } from "./email.service";
import type { Complaint, ComplaintWithoutId } from "../db/schema";

export async function listComplaintsForUser(
  user: AuthUser,
  query: ListComplaintsQuery,
): Promise<{
  complaints: ComplaintWithoutId[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const conditions = [];

  if (user.role !== "super_admin") {
    conditions.push(eq(complaints.userBankId, user.bankId!));
  }

  if (query.status) {
    conditions.push(eq(complaints.status, query.status));
  }

  if (query.sourceChannel) {
    conditions.push(eq(complaints.sourceChannel, query.sourceChannel));
  }

  if (query.complaintCategory) {
    conditions.push(eq(complaints.complaintCategory, query.complaintCategory));
  }

  if (query.assignedTo) {
    conditions.push(eq(complaints.assignedTo, query.assignedTo));
  }

  const search = query.search?.trim();
  if (search) {
    conditions.push(
      or(
        ilike(complaints.userName, `%${search}%`),
        ilike(complaints.userEmail, `%${search}%`),
        ilike(complaints.userPhone, `%${search}%`),
        ilike(complaints.ticketId, `%${search}%`),

        ilike(complaints.complaintSummary, `%${search}%`),
        ilike(complaints.complaintCategory, `%${search}%`),
        ilike(complaints.userBankId, `%${search}%`),
        ilike(complaints.sourceChannel, `%${search}%`),
        ilike(complaints.assignedTo, `%${search}%`),
        ilike(complaints.language, `%${search}%`),
        ilike(complaints.status, `%${search}%`),
      )!,
    );
  }

  const whereClause = conditions.length === 0 ? undefined : and(...conditions);

  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const offset = (page - 1) * limit;

  const [countResult] = await db
    .select({ count: count(complaints.id) })
    .from(complaints)
    .where(whereClause);

  const total = Number(countResult?.count ?? 0);

  const { id: _id, ...complaintColumns } = getTableColumns(complaints);

  const rows = await db
    .select(complaintColumns)
    .from(complaints)
    .where(whereClause)
    .orderBy(desc(complaints.createdAt))
    .limit(limit)
    .offset(offset);

  return {
    complaints: rows,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export async function findComplaintById(
  uuid: string,
): Promise<ComplaintWithoutId | null> {
  const { id: _id, ...complaintColumns } = getTableColumns(complaints);

  const [complaint] = await db
    .select(complaintColumns)
    .from(complaints)
    .where(eq(complaints.uuid, uuid));

  return complaint ?? null;
}

export async function resolveComplaintForUser(
  user: AuthUser,
  complaint: ComplaintWithoutId,
  body: ResolveComplaintBody,
): Promise<ComplaintWithoutId> {
  const now = new Date();

  const channel = complaint.sourceChannel;

  const updateData: Partial<typeof complaints.$inferInsert> = {
    status: COMPLAINT_STATUSES[1],
    resolutionNote: body.resolutionNote,
    resolvedBy: user.role,
    resolvedAt: now,
    updatedAt: now,
  };

  if (channel === SOURCE_CHANNELS[0]) {
    updateData.callSent = true;
    updateData.callSentAt = now;
  }

  let emailShouldBeMarkedSent = false;

  if (
    (channel === EMAIL_CHANNELS[0] || channel === EMAIL_CHANNELS[1]) &&
    complaint.userEmail
  ) {
    try {
      await sendResolutionEmail(
        complaint.userEmail,
        complaint.userName ?? "Customer",
        complaint.ticketId,
      );
      emailShouldBeMarkedSent = true;
    } catch (err) {
      console.error("[email] Resolution email failed", err);
    }
  }

  if (emailShouldBeMarkedSent) {
    updateData.emailSent = true;
    updateData.emailSentAt = now;
  }

  const { id: _id, ...complaintColumns } = getTableColumns(complaints);

  const [updated] = await db
    .update(complaints)
    .set(updateData)
    .where(eq(complaints.uuid, complaint.uuid))
    .returning(complaintColumns);

  return updated!;
}