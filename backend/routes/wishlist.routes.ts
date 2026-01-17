import express from "express";
import { db } from "../utils/db";
import { wishlist } from "../db/schema/wishlist";
import { deals } from "../db/schema/deal";
import { prices } from "../db/schema/price";
import { eq, and, asc } from "drizzle-orm";
import { addWishlistSchema } from "../validators/wishlist.validators";
import { trackEvent } from "../utils/analytics";

const router = express.Router();

router.get("/", async (req: any, res: any) => {
  const userId = req.user.id;

  const items = await db
    .select()
    .from(wishlist)
    .where(eq(wishlist.userId, userId));

  const response: any[] = [];

  for (const item of items) {
    const deal = await db
      .select()
      .from(deals)
      .where(eq(deals.id, item.dealId))
      .then((d) => d[0]);

    const isExpired =
      !deal ||
      deal.isActive === false ||
      (deal.expiresAt && deal.expiresAt < new Date());

    if (isExpired) {
      response.push({
        dealId: item.dealId,
        alertEnabled: item.alertEnabled,
        createdAt: item.createdAt,
        status: "expired",
        bestPrice: null,
      });
      continue;
    }

    const bestPrice = await db
      .select()
      .from(prices)
      .where(eq(prices.dealId, deal.id))
      .orderBy(asc(prices.amount))
      .limit(1)
      .then((p) => p[0]?.amount ?? null);

    response.push({
      dealId: item.dealId,
      alertEnabled: item.alertEnabled,
      createdAt: item.createdAt,
      status: "active",
      bestPrice,
    });
  }

  res.json(response);
});


router.post("/", async (req: any, res: any) => {
  const { id: userId, role } = req.user;
  const body = addWishlistSchema.parse(req.body);

  if (body.alertEnabled && role !== "subscriber") {
    return res
      .status(403)
      .json({ message: "Upgrade required to enable alerts" });
  }

  try {
    await db.insert(wishlist).values({
      userId,
      dealId: body.dealId,
      alertEnabled: body.alertEnabled ?? false,
    });

    trackEvent("wishlist_add", { userId, dealId: body.dealId });
  } catch {
    
  }

  res.json({ success: true });
});


router.delete("/:dealId", async (req: any, res: any) => {
  const { id: userId } = req.user;
  const { dealId } = req.params;

  await db
    .delete(wishlist)
    .where(and(eq(wishlist.userId, userId), eq(wishlist.dealId, dealId)));

  trackEvent("wishlist_remove", { userId, dealId });

  res.json({ success: true });
});

export default router;
