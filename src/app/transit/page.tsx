import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TransitCard from "@/components/TransitCard";
import {
  getTransitVehicles,
  getVesselsDockingThisWeek,
  getVerifiedDealerCount,
  getAvailableMakes,
} from "@/lib/queries";

const STATUSES = ["On Water", "Docked", "Clearing", "Available at Yard"];

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ make?: string; status?: string; maxBudget?: string }>;
}) {
  const params = await searchParams;
  const vehicles = await getTransitVehicles({
    make: params.make,
    status: params.status,
    maxBudget: params.maxBudget ? Number(params.maxBudget) : undefined,
  });
  const [vesselsDockingCount, dealerCount, makes] = await Promise.all([
    getVesselsDockingThisWeek(),
    getVerifiedDealerCount(),
    getAvailableMakes(),
  ]);

  return (
    <>
      <Header vesselsDockingCount={vesselsDockingCount} dealerCount={dealerCount} />

      <div className="max-w-[1180px] mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="font-mono text-[11px] font-semibold text-customs-amber-dark uppercase tracking-widest mb-3">
            Browse Transit
          </div>
          <h1 className="text-[30px] font-extrabold tracking-tight">
            {vehicles.length} units currently on the manifest
          </h1>
        </div>

        <form className="flex flex-wrap gap-3 mb-10 bg-white border border-black/[0.12] rounded-xl p-4">
          <select
            name="make"
            defaultValue={params.make ?? ""}
            className="border border-black/[0.12] rounded-lg px-3 py-2 text-sm bg-manifest-cream"
          >
            <option value="">All Makes</option>
            {makes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <select
            name="status"
            defaultValue={params.status ?? ""}
            className="border border-black/[0.12] rounded-lg px-3 py-2 text-sm bg-manifest-cream"
          >
            <option value="">Any Status</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="maxBudget"
            placeholder="Max CIF budget (KES)"
            defaultValue={params.maxBudget ?? ""}
            className="border border-black/[0.12] rounded-lg px-3 py-2 text-sm bg-manifest-cream w-56"
          />

          <button
            type="submit"
            className="bg-ink-navy text-manifest-cream px-5 py-2 rounded-lg text-sm font-bold ml-auto"
          >
            Apply Filters
          </button>
        </form>

        {vehicles.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-black/[0.15] rounded-xl">
            <p className="text-port-steel text-sm">
              No units match yet — widen your filters or check back soon, new manifests land weekly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {vehicles.map((v) => (
              <TransitCard key={v.id} vehicle={v} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}