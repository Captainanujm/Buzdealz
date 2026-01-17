import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { products } from "../data/products";
import { Link } from "wouter";

const removeFromWishlist = async (dealId: string) => {
  await fetch(`/api/wishlist/${dealId}`, { method: "DELETE" });
};

export default function Wishlist() {
  const queryClient = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const res = await fetch("/api/wishlist");
      return res.json();
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeFromWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  /* =========================
     Loading state
  ========================= */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">
            Loading your wishlist...
          </p>
        </div>
      </div>
    );
  }

  /* =========================
     Map wishlist + expired logic
     (ONLY FUNCTIONAL CHANGE)
  ========================= */
  const wishlistWithDetails = data.map((item: any) => {
    const product = products.find((p) => p.id === item.dealId);
    const isExpired = item.status === "expired";

    return {
      ...item,
      name: product?.name ?? "Unknown Product",
      isExpired,
      // ❌ expired → no price
      price: !isExpired
        ? product?.price ?? item.bestPrice
        : null,
      status: item.status || "active",
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-1">
              My Wishlist
            </h1>
            <p className="text-slate-600">
              {wishlistWithDetails.length} item
              {wishlistWithDetails.length !== 1 ? "s" : ""} saved
            </p>
          </div>

          <Link
            href="/"
            className="bg-white px-5 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all font-medium text-slate-700 border border-slate-200"
          >
            ← Back to Deals
          </Link>
        </div>

        {/* Empty state */}
        {wishlistWithDetails.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-slate-600 mb-6">
              Start adding deals to keep track of your favorite products
            </p>
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-medium hover:scale-105 transition-transform"
            >
              Browse Deals
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {wishlistWithDetails.map((item: any) => (
              <div
                key={item.dealId}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-lg font-semibold text-slate-800">
                        {item.name}
                      </h2>

                      {item.isExpired ? (
                        <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full">
                          Expired
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-1 rounded-full">
                          Active
                        </span>
                      )}
                    </div>

                    {/* PRICE OR EXPIRED MESSAGE */}
                    {!item.isExpired ? (
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-3xl font-bold text-emerald-600">
                          ₹{item.price}
                        </span>
                        {item.price && (
                          <span className="text-sm text-slate-500">
                            Best price
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-red-500 font-medium">
                        Deal expired or unavailable
                      </p>
                    )}
                  </div>
                </div>

                {/* Remove button (always allowed) */}
                <button
                  onClick={() => removeMutation.mutate(item.dealId)}
                  disabled={removeMutation.isPending}
                  className="w-full bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {removeMutation.isPending
                    ? "Removing..."
                    : "Remove from Wishlist"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
