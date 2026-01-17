import express from "express";
import { db } from "../utils/db";
import { wishlist } from "../db/schema/wishlist";
import { deals } from "../db/schema/deal";
import { prices } from "../db/schema/price";
import { eq, and, asc } from "drizzle-orm";
import { addWishlistSchema } from "../validators/wishlist.validators";
import { trackEvent } from "../utils/analytics";

const router = express.Router();

/* GET wishlist */
router.get("/", async (req: any, res:any) => {
  const userId = req.user.id;

  const items = await db
    .select()
    .from(wishlist)
    .where(eq(wishlist.userId, userId));

  const response = [];

  for (const item of items) {
    const deal = await db
      .select()
      .from(deals)
      .where(eq(deals.id, item.dealId))
      .then((d) => d[0]);

    if (!deal || !deal.isActive || (deal.expiresAt && deal.expiresAt < new Date())) {
      response.push({ ...item, status: "expired", bestPrice: null });
      continue;
    }

    const bestPrice = await db
      .select()
      .from(prices)
      .where(eq(prices.dealId, deal.id))
      .orderBy(asc(prices.amount))
      .limit(1)
      .then((p) => p[0]?.amount ?? null);

    response.push({ ...item, status: "active", bestPrice });
  }

  res.json(response);
});

/* POST wishlist */
router.post("/", async (req: any, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  const body = addWishlistSchema.parse(req.body);

  if (body.alertEnabled && role !== "subscriber") {
    return res.status(403).json({ message: "Upgrade required for alerts" });
  }

  try {
    await db.insert(wishlist).values({
      userId,
      dealId: body.dealId,
      alertEnabled: body.alertEnabled ?? false,
    });

    trackEvent("wishlist_add", { userId, dealId: body.dealId });
    res.json({ success: true });
  } catch {
    res.json({ success: true });
  }
});

/* DELETE wishlist */
router.delete("/:dealId", async (req: any, res) => {
  await db
    .delete(wishlist)
    .where(
      and(
        eq(wishlist.userId, req.user.id),
        eq(wishlist.dealId, req.params.dealId)
      )
    );

  trackEvent("wishlist_remove", {
    userId: req.user.id,
    dealId: req.params.dealId,
  });

  res.json({ success: true });
});

export default router;
