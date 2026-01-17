import {
  pgTable,
  uuid,
  boolean,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { users } from "./user";
import { deals } from "./deal";

export const wishlist = pgTable(
  "wishlist",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),

    dealId: uuid("deal_id")
      .notNull()
      .references(() => deals.id),

    alertEnabled: boolean("alert_enabled").default(false),

    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    uniqueUserDeal: uniqueIndex("wishlist_user_deal_idx")
      .on(table.userId, table.dealId),
  })
);
