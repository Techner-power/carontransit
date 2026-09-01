import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/serverClient";
import { getPendingVehicles, adminSignOut } from "@/lib/adminActions";
import PendingVehicleRow from "@/components/PendingVehicleRow";
import AdminManualEntryForms from "@/components/AdminManualEntryForms";

function isAdminEmail(email: string | undefined): boolean {
  if (!email) return false;
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return adminEmails.includes(email.toLowerCase());
}

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    redirect("/admin/login");
  }

  const pendingVehicles = await getPendingVehicles();

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-2xl font-extrabold">Admin Dashboard</h1>
        <form action={adminSignOut}>
          <button type="submit" className="text-sm text-port-steel underline">
            Log out
          </button>
        </form>
      </div>

      <section className="mb-12">
        <h2 className="text-lg font-bold mb-4">
          Pending Review ({pendingVehicles.length})
        </h2>
        {pendingVehicles.length === 0 ? (
          <p className="text-sm text-port-steel">No vehicles waiting for review right now.</p>
        ) : (
          <div className="space-y-3">
            {pendingVehicles.map((v) => (
              <PendingVehicleRow key={v.id} vehicle={v} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-bold mb-4">Manual Entry</h2>
        <p className="text-sm text-port-steel mb-4">
          Cars added here go live immediately — no review step, since you&apos;re adding them
          yourself.
        </p>
        <AdminManualEntryForms />
      </section>
    </div>
  );
}
