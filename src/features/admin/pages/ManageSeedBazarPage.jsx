import "../styles/adminScoped.css";
import BazarListManager from "@/features/admin/components/BazarListManager";

const RAW_SEED_BAZAR = [
  {
    id: 11,
    userId: 102,
    bazarName: "Krishok Seed Market, Khulna",
    imageUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=80",
    recordedAt: "2025-10-13T21:05:00+06:00",
    note: "High yielding rice seed price updated.",
  },
  {
    id: 10,
    userId: 102,
    bazarName: "Krishok Seed Market, Khulna",
    imageUrl: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80",
    recordedAt: "2025-10-13T21:02:00+06:00",
    note: "New season vegetable seeds now available.",
  },
  {
    id: 8,
    userId: 102,
    bazarName: "Pabna Seed Exchange",
    imageUrl: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80",
    recordedAt: "2025-10-13T20:11:00+06:00",
    note: "Special discount on chili seeds.",
  },
  {
    id: 1,
    userId: 99,
    bazarName: "Barishal Seed Hub",
    imageUrl: "https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=900&q=80",
    recordedAt: "2025-01-05T17:57:00+06:00",
    note: "Improved wheat seed available now.",
  },
];

const INITIAL_ENTRIES = RAW_SEED_BAZAR.map((entry) => ({
  id: entry.id,
  userId: entry.userId,
  title: "Seed Bazar",
  description: entry.note,
  imageUrl: entry.imageUrl,
  recordedAt: entry.recordedAt,
  metadata: [{ label: "Location", value: entry.bazarName }],
}));

export default function ManageSeedBazarPage() {
  return (
    <BazarListManager
      title="Manage All Seed Bazar"
      description="Review recent seed bazar submissions and keep listings tidy."
      breadcrumb={[
        { to: "/admin/dashboard", label: "Admin Dashboard" },
        { label: "Manage All Seed Bazar" },
      ]}
      totalLabel="Total Seed Bazar"
      entries={INITIAL_ENTRIES}
      searchPlaceholder="Search by market name, description, or user ID"
      emptyMessage="No seed bazar entries matched your search."
      confirmTitle="Delete seed bazar entry?"
      confirmBody={(entry) => `Are you sure you want to delete seed bazar entry #${entry.id}?`}
      deleteToastMessage={(entry) => `Seed bazar entry #${entry.id} deleted.`}
    />
  );
}
