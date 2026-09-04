import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ForeignListingCard from "@/components/ForeignListingCard";
import { getForeignListings } from "@/lib/foreignQueries";
import { getVesselsDockingThisWeek, getVerifiedDealerCount } from "@/lib/queries";

export default async function ForeignBrowsePage() {
  const [listings, vesselsDockingCount, dealerCount] = await Promise.all([
    getForeignListings(),
    getVesselsDockingThisWeek(),
    getVerifiedDealerCount(),
  ]);

  return (
    <>
      <Header vesselsDockingCount={vesselsDockingCount} dealerCount={dealerCount} />

      <div className="max-w-[1180px] mx-auto px-6 py-12">
        <div className="mb-6">
          <div className="font-mono text-[11px] font-semibold text-customs-amber-dark uppercase tracking-widest mb-3">
            Foreign Listings
          </div>
          <h1 className="text-[30px] font-extrabold tracking-tight mb-2">
            {listings.length} vehicles from verified exporters
          </h1>
          <p className="text-sm text-port-steel max-w-[600px]">
            These cars haven&apos;t shipped yet and have not been physically inspected by anyone
            local. You&apos;ll work with a verified import agent to handle shipping, clearing, and
            inspection.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-10">
          {[
            { n: "01", t: "Browse" },
            { n: "02", t: "Request the car" },
            { n: "03", t: "We assign an agent" },
            { n: "04", t: "Agent handles the rest" },
          ].map((s) => (
            <div key={s.n} className="bg-white border border-black/[0.12] rounded-lg p-3 text-center">
              <div className="font-mono text-[11px] text-customs-amber-dark font-bold">{s.n}</div>
              <div className="text-[13px] font-semibold mt-0.5">{s.t}</div>
            </div>
          ))}
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-black/[0.15] rounded-xl">
            <p className="text-port-steel text-sm">
              No foreign listings yet — check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map((l) => (
              <ForeignListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
