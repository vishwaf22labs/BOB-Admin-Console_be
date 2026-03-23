import {
  pgTable,
  integer,
  uuid,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

export const customers = pgTable("customers", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  uuid: uuid("uuid").notNull().unique().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }),
  phone: varchar("phone", { length: 20 }).notNull(),
  channelMode: varchar("channel_mode", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
export type CustomerWithoutId = Omit<Customer, "id">;