export const fetchWishlist = async () => {
  const res = await fetch("/api/wishlist");
  return res.json();
};

export const removeFromWishlist = async (dealId: string) => {
  await fetch(`/api/wishlist/${dealId}`, { method: "DELETE" });
};
