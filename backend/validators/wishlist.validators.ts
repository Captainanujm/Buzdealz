import { z } from "zod";

export const addWishlistSchema = z.object({
  dealId: z.string().uuid(),
  alertEnabled: z.boolean().optional(),
});
