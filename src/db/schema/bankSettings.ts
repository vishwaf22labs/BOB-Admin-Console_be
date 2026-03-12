import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

export const bankSettings = pgTable("bank_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  bankId: varchar("bank_id", { length: 50 }).notNull().unique(),
  voiceCallLanguage: varchar("voice_call_language", { length: 50 })
    .notNull()
    .default("english"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type BankSettings = typeof bankSettings.$inferSelect;
export type NewBankSettings = typeof bankSettings.$inferInsert;