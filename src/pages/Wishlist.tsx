import { useQuery } from "@tanstack/react-query";
import { products } from "../data/products";

export default function Wishlist() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const res = await fetch("/api/wishlist");
      return res.json();
    },
  });

  if (isLoading) return <div className="p-6">Loading...</div>;

  const wishlistWithDetails = data.map((item: any) => {
    const product = products.find((p) => p.id === item.dealId);
    return {
      ...item,
      name: product?.name ?? "Unknown Product",
      price: product?.price ?? item.bestPrice,
    };
  });

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Wishlist ❤️</h1>

      {wishlistWithDetails.length === 0 ? (
        <p>No items in wishlist</p>
      ) : (
        <div className="space-y-4">
          {wishlistWithDetails.map((item: any) => (
            <div
              key={item.dealId}
              className="border rounded p-4 flex justify-between"
            >
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-green-600">₹{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
