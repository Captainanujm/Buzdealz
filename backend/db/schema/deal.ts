import { pgTable, uuid, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const deals = pgTable("deals", {
  id: uuid("id").defaultRandom().primaryKey(),

  title: text("title").notNull(),

  isActive: boolean("is_active").default(true),

  expiresAt: timestamp("expires_at"),

  createdAt: timestamp("created_at").defaultNow(),
});
