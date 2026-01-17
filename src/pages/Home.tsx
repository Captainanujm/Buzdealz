import { products } from "../data/products";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";

const fetchWishlist = async () => {
  const res = await fetch("/api/wishlist");
  return res.json();
};

export default function Home() {
  const queryClient = useQueryClient();

  const { data: wishlist = [] } = useQuery({
    queryKey: ["wishlist"],
    queryFn: fetchWishlist,
  });

  const wishlistIds = wishlist.map((item: any) => item.dealId);

  const addToWishlist = useMutation({
    mutationFn: async (dealId: string) => {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealId }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-1">
              Hot Deals
            </h1>
            <p className="text-slate-600">
              Grab the best prices before they're gone
            </p>
          </div>
          <Link
            href="/wishlist"
            className="bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all font-medium text-white"
          >
            My Wishlist
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const isAdded = wishlistIds.includes(product.id);

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
              >
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-slate-800 mb-2">
                    {product.name}
                  </h2>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-emerald-600">
                      ₹{product.price}
                    </span>
                    <span className="text-sm text-slate-500 line-through">
                      ₹{Math.floor(product.price * 1.3)}
                    </span>
                  </div>
                  <div className="mt-2 inline-block bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                    Save {Math.floor(((product.price * 1.3 - product.price) / (product.price * 1.3)) * 100)}%
                  </div>
                </div>

                <button
                  disabled={isAdded || addToWishlist.isPending}
                  onClick={() => addToWishlist.mutate(product.id)}
                  className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
                    isAdded
                      ? "bg-emerald-500 text-white cursor-default"
                      : "bg-slate-800 text-white hover:bg-slate-900 active:scale-95"
                  }`}
                >
                  {isAdded ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      In Wishlist
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                      </svg>
                      Add to Wishlist
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}