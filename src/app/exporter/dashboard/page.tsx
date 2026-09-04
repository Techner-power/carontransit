import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/serverClient";
import { getMyExporterProfile, getMyForeignListings, exporterSignOut } from "@/lib/exporterActions";
import ExporterVehicleForm from "@/components/ExporterVehicleForm";

const statusColor: Record<string, string> = {
  Pending: "bg-customs-amber/[0.15] text-customs-amber-dark",
  Approved: "bg-verified-teal/[0.15] text-verified-teal",
  Rejected: "bg-red-100 text-red-600",
};

export default async function ExporterDashboardPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/exporter/login");
  }

  const exporter = await getMyExporterProfile();

  if (!exporter) {
    return (
      <div className="max-w-[600px] mx-auto px-6 py-16">
        <p className="text-port-steel">
          No exporter profile is linked to this account. Contact support.
        </p>
      </div>
    );
  }

  const listings = exporter.is_approved ? await getMyForeignListings() : [];

  return (
    <div className="max-w-[860px] mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold">{exporter.company_name}</h1>
          <p className="text-sm text-port-steel">{exporter.country}</p>
        </div>
        <form action={exporterSignOut}>
          <button type="submit" className="text-sm text-port-steel underline">
            Log out
          </button>
        </form>
      </div>

      {!exporter.is_approved ? (
        <div className="bg-customs-amber/[0.1] border border-customs-amber/[0.4] rounded-xl p-6">
          <h2 className="text-sm font-bold mb-2">Your account is awaiting approval</h2>
          <p className="text-[13px] text-port-steel leading-relaxed">
            We manually review every exporter account before it becomes active. This is usually
            quick — reach out to us directly if it's been a while.
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white border border-black/[0.12] rounded-xl p-6 mb-8">
            <h2 className="text-sm font-bold mb-2">Your Listing Quota</h2>
            <p className="text-3xl font-extrabold text-customs-amber-dark mb-1">
              {listings.length} / {exporter.listing_quota}
            </p>
            <p className="text-[13px] text-port-steel">
              Listings used out of your quota. Contact us on WhatsApp to unlock more.
            </p>
          </div>

          <section className="bg-white border border-black/[0.12] rounded-xl p-6 mb-8">
            <h2 className="text-lg font-bold mb-4">Add a Vehicle</h2>
            <p className="text-[13px] text-port-steel mb-4">
              New listings are reviewed before appearing publicly — usually within 24 hours.
            </p>
            <ExporterVehicleForm />
          </section>

          <section>
            <h2 className="text-lg font-bold mb-4">Your Listings ({listings.length})</h2>
            {listings.length === 0 ? (
              <p className="text-sm text-port-steel">
                You haven&apos;t added any vehicles yet — use the form above.
              </p>
            ) : (
              <div className="space-y-3">
                {listings.map((l) => (
                  <div
                    key={l.id}
                    className="bg-white border border-black/[0.12] rounded-xl p-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-sm">{l.vehicle_title}</p>
                      <p className="text-[12px] text-port-steel font-mono">
                        FOB KES {Number(l.fob_price_kes).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                        statusColor[l.review_status] ?? ""
                      }`}
                    >
                      {l.review_status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
