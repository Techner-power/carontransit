import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/serverClient";
import { getMyDealerProfile, getMyVehicles, dealerSignOut } from "@/lib/dealerActions";
import DealerVehicleForm from "@/components/DealerVehicleForm";

const statusColor: Record<string, string> = {
  Pending: "bg-customs-amber/[0.15] text-customs-amber-dark",
  Approved: "bg-verified-teal/[0.15] text-verified-teal",
  Rejected: "bg-red-100 text-red-600",
};

export default async function DealerDashboardPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/dealer/login");
  }

  const [dealer, vehicles] = await Promise.all([getMyDealerProfile(), getMyVehicles()]);

  if (!dealer) {
    return (
      <div className="max-w-[600px] mx-auto px-6 py-16">
        <p className="text-port-steel">
          No dealer profile is linked to this account. Contact support.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[860px] mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold">{dealer.business_name}</h1>
          <p className="text-sm text-port-steel">{dealer.physical_location}</p>
        </div>
        <form action={dealerSignOut}>
          <button type="submit" className="text-sm text-port-steel underline">
            Log out
          </button>
        </form>
      </div>

      <section className="bg-white border border-black/[0.12] rounded-xl p-6 mb-8">
        <h2 className="text-lg font-bold mb-4">Add a Vehicle</h2>
        <p className="text-[13px] text-port-steel mb-4">
          New listings are reviewed before they appear publicly on CarOnTransit — usually within 24
          hours.
        </p>
        <DealerVehicleForm />
      </section>

      <section>
        <h2 className="text-lg font-bold mb-4">Your Listings ({vehicles.length})</h2>
        {vehicles.length === 0 ? (
          <p className="text-sm text-port-steel">
            You haven&apos;t added any vehicles yet — use the form above.
          </p>
        ) : (
          <div className="space-y-3">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="bg-white border border-black/[0.12] rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-sm">{v.vehicle_title}</p>
                  <p className="text-[12px] text-port-steel font-mono">
                    Chassis ****{v.chassis_masked_identifier} · {v.vessel_identifier}
                  </p>
                </div>
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    statusColor[v.review_status] ?? ""
                  }`}
                >
                  {v.review_status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
