import "../styles/adminScoped.css";
import BazarListManager from "@/features/admin/components/BazarListManager";

const RAW_BAZAR_PRICES = [
  {
    id: 31,
    userId: 102,
    bazarName: "Nowhata Market, Rajshahi",
    imageUrl: "https://images.unsplash.com/photo-1518089099975-6ca5cb67f42f?auto=format&fit=crop&w=900&q=80",
    recordedAt: "2025-10-13T17:35:00+06:00",
    note: "Daily price snapshot",
  },
  {
    id: 30,
    userId: 102,
    bazarName: "Nowhata Market, Rajshahi",
    imageUrl: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=900&q=80",
    recordedAt: "2025-10-13T14:06:00+06:00",
    note: "Fresh produce arrival",
  },
  {
    id: 29,
    userId: 102,
    bazarName: "Nowhata Market, Rajshahi",
    imageUrl: "https://images.unsplash.com/photo-1441123285228-1448e608f3d5?auto=format&fit=crop&w=900&q=80",
    recordedAt: "2025-10-12T13:36:00+06:00",
    note: "Vegetable price summary",
  },
  {
    id: 28,
    userId: 99,
    bazarName: "Chapainawabganj Central Bazaar",
    imageUrl: "https://images.unsplash.com/photo-1598514982843-5d5db1bcae44?auto=format&fit=crop&w=900&q=80",
    recordedAt: "2024-12-24T06:54:00+06:00",
    note: "Winter vegetable supply update",
  },
  {
    id: 27,
    userId: 73,
    bazarName: "Shariatpur Sadar Bazaar",
    imageUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=80",
    recordedAt: "2024-11-22T13:59:00+06:00",
    note: "Paddy harvest season rates",
  },
];

const INITIAL_ENTRIES = RAW_BAZAR_PRICES.map((entry) => ({
  id: entry.id,
  userId: entry.userId,
  title: "Bazar Price",
  description: entry.note,
  imageUrl: entry.imageUrl,
  recordedAt: entry.recordedAt,
  metadata: [{ label: "Location", value: entry.bazarName }],
}));

export default function ManageBazarPricePage() {
  return (
    <BazarListManager
      title="Manage All Bazar Price"
      description="Review recent market price submissions and remove outdated entries."
      breadcrumb={[
        { to: "/admin/dashboard", label: "Admin Dashboard" },
        { label: "Manage All Bazar Price" },
      ]}
      totalLabel="Total Bazar Price"
      entries={INITIAL_ENTRIES}
      searchPlaceholder="Search by market name, description, or user ID"
      emptyMessage="No bazar price entries matched your search."
      confirmTitle="Delete bazar entry?"
      confirmBody={(entry) => `Are you sure you want to delete bazar price entry #${entry.id}?`}
      deleteToastMessage={(entry) => `Bazar price entry #${entry.id} deleted.`}
    />
  );
}
