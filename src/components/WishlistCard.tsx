type WishlistItem = {
  dealId: string;
  bestPrice: number | null;
};

type Props = {
  item: WishlistItem;
  onRemove: (dealId: string) => void;
};

export default function WishlistCard({ item, onRemove }: Props) {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">Deal ID</p>
        <p className="font-mono text-sm">{item.dealId}</p>

        <p className="mt-2 text-lg font-semibold text-green-600">
          ₹ {item.bestPrice ?? "N/A"}
        </p>
      </div>

      <button
        onClick={() => onRemove(item.dealId)}
        className="text-red-500 hover:text-red-700 text-sm"
      >
        Remove
      </button>
    </div>
  );
}
