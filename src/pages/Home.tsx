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
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Deals</h1>
        <Link href="/wishlist" className="text-blue-600">
          Wishlist →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((product) => {
          const isAdded = wishlistIds.includes(product.id);

          return (
            <div
              key={product.id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{product.name}</h2>
                <p className="text-green-600 font-medium">
                  ₹{product.price}
                </p>
              </div>

              <button
                disabled={isAdded || addToWishlist.isLoading}
                onClick={() => addToWishlist.mutate(product.id)}
                className={`px-3 py-1 rounded text-white transition
                  ${
                    isAdded
                      ? "bg-green-600 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                {isAdded ? "Added ✓" : "Add to Wishlist"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
