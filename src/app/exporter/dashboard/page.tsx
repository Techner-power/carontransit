import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/serverClient";
import { getMyExporterProfile, exporterSignOut } from "@/lib/exporterActions";

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

  return (
    <div className="max-w-[720px] mx-auto px-6 py-12">
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
        <div className="bg-white border border-black/[0.12] rounded-xl p-6 mb-6">
          <h2 className="text-sm font-bold mb-2">Your Listing Quota</h2>
          <p className="text-3xl font-extrabold text-customs-amber-dark mb-1">
            {exporter.listing_quota}
          </p>
          <p className="text-[13px] text-port-steel">
            You can list up to {exporter.listing_quota} vehicles. Every new account starts with 2
            free listings — contact us on WhatsApp to unlock up to 20.
          </p>
        </div>
      )}

      {exporter.is_approved && (
        <div className="bg-manifest-cream-2 border border-black/[0.12] rounded-xl p-6">
          <h2 className="text-sm font-bold mb-2">Listing management coming soon</h2>
          <p className="text-[13px] text-port-steel leading-relaxed">
            The ability to upload your vehicles directly is being finalized. In the meantime, send
            your unit details to our team on WhatsApp and we&apos;ll get them listed for you.
          </p>
        </div>
      )}
    </div>
  );
}
