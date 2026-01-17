import { pgTable, uuid, integer, timestamp } from "drizzle-orm/pg-core";
import { deals } from "./deal";

export const prices = pgTable("prices", {
  id: uuid("id").defaultRandom().primaryKey(),

  dealId: uuid("deal_id")
    .notNull()
    .references(() => deals.id),

  amount: integer("amount").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});
