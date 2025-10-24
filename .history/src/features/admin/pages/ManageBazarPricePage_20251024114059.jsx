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
  }
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
