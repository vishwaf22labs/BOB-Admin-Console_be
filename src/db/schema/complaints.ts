import {
  pgTable,
  integer,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const complaints = pgTable("complaints", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  uuid: uuid("uuid").notNull().unique().defaultRandom(),
  ticketId: varchar("ticket_id", { length: 30 }).notNull().unique(),
  userName: varchar("user_name", { length: 100 }),
  userEmail: varchar("user_email", { length: 100 }),
  userPhone: varchar("user_phone", { length: 20 }),
  userBankId: varchar("user_bank_id", { length: 50 }).notNull(),
  complaintText: text("complaint_text"),
  complaintSummary: text("complaint_summary"),
  complaintCategory: varchar("complaint_category", { length: 50 }),
  sourceChannel: varchar("source_channel", { length: 20 }),
  audioUrl: varchar("audio_url", { length: 500 }),
  videoUrl: varchar("video_url", { length: 500 }),
  rawChatText: text("raw_chat_text"),
  transcript: jsonb("transcript"),
  languageDetected: varchar("language_detected", { length: 50 }),
  status: varchar("status", { length: 20 }).default("open"),
  assignedTo: varchar("assigned_to", { length: 10 }).default("m1"),
  resolutionNote: text("resolution_note"),
  resolvedBy: varchar("resolved_by", { length: 10 }),
  resolvedAt: timestamp("resolved_at"),
  escalatedToM2At: timestamp("escalated_to_m2_at"),
  escalatedToM3At: timestamp("escalated_to_m3_at"),
  emailSent: boolean("email_sent").default(false),
  emailSentAt: timestamp("email_sent_at"),
  callSent: boolean("call_sent").default(false),
  callSentAt: timestamp("call_sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Complaint = typeof complaints.$inferSelect;
export type NewComplaint = typeof complaints.$inferInsert;
export type ComplaintWithoutId = Omit<Complaint, "id">;