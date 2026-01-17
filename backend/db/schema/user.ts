import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  email: text("email").notNull().unique(),

  role: text("role").notNull().default("free"),
  // free | subscriber

  createdAt: timestamp("created_at").defaultNow(),
});
