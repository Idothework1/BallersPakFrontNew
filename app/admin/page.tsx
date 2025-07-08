import nextDynamic from "next/dynamic";

const AdminTable = nextDynamic(() => import("@/components/admin/AdminTable"), { ssr: false });

// We always want fresh data from the backend
export const dynamic = "force-dynamic";

async function getSignups() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE ?? "";
  try {
    const res = await fetch(`${apiBase}/api/signups`, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) as Record<string, string>[];
  } catch {
    return [];
  }
}

export default async function AdminPage() {
  const signups = await getSignups();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-white">Sign-ups</h1>
      {signups.length === 0 ? (
        <p className="text-gray-400">No sign-ups yet.</p>
      ) : (
        <AdminTable data={signups} />
      )}
    </div>
  );
} 