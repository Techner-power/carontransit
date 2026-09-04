import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getForeignListingById } from "@/lib/foreignQueries";
import { getVesselsDockingThisWeek, getVerifiedDealerCount } from "@/lib/queries";

export default async function ForeignListingDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [listing, vesselsDockingCount, dealerCount] = await Promise.all([
    getForeignListingById(id),
    getVesselsDockingThisWeek(),
    getVerifiedDealerCount(),
  ]);

  if (!listing) notFound();

  const exporter = listing.exporter;
  const whatsappMessage = `Hi ${exporter?.company_name}, I'm interested in the ${listing.vehicle_title} listed on CarOnTransit.co.ke (FOB KES ${Number(listing.fob_price_kes).toLocaleString()}). Can you tell me more, and which local agent in Kenya can help me import it?`;
  const whatsappLink = exporter
    ? `https://wa.me/${exporter.contact_whatsapp}?text=${encodeURIComponent(whatsappMessage)}`
    : "#";

  return (
    <>
      <Header vesselsDockingCount={vesselsDockingCount} dealerCount={dealerCount} />

      <div className="max-w-[1180px] mx-auto px-6 py-10">
        <Link href="/foreign" className="text-sm text-port-steel">
          ← Back to Foreign Listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 mt-6">
          <div>
            <div className="h-[340px] rounded-2xl overflow-hidden mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={listing.vehicle_hero_image}
                alt={listing.vehicle_title}
                className="w-full h-full object-cover"
              />
            </div>

            <h1 className="text-[28px] font-extrabold tracking-tight mb-2">
              {listing.vehicle_title}
            </h1>
            <p className="text-sm text-port-steel mb-8">
              Listed by {exporter?.company_name} · {exporter?.country} ·{" "}
              {listing.year_of_manufacture}
            </p>

            <div className="bg-customs-amber/[0.08] border border-customs-amber/[0.4] rounded-xl p-5">
              <h3 className="text-sm font-bold text-ink-navy mb-2">
                This car is not yet inspected by a Kenyan agent
              </h3>
              <p className="text-[13px] text-port-steel leading-relaxed">
                Unlike our local transit listings, this vehicle hasn&apos;t shipped yet and no one
                local has physically checked it. Once you select an import agent, they will verify
                the vehicle&apos;s condition and handle shipping and customs clearance on your
                behalf — never send full payment before that verification happens.
              </p>
            </div>
          </div>

          <div>
            <div className="bg-white border border-black/[0.12] rounded-xl p-6 mb-5">
              <h2 className="text-sm font-bold mb-4">FOB Price</h2>
              <p className="text-2xl font-mono font-extrabold text-verified-teal mb-2">
                KES {Number(listing.fob_price_kes).toLocaleString()}
              </p>
              <p className="text-[11px] text-port-steel">
                Free On Board price — excludes shipping, KRA duty, and clearing costs, which your
                import agent will quote separately. See our{" "}
                <Link href="/duty-guide" className="underline">
                  duty guide
                </Link>
                .
              </p>
            </div>

            <div className="bg-white border border-black/[0.12] rounded-xl p-6 mb-5">
              <h2 className="text-sm font-bold mb-4">Exporter</h2>
              <p className="font-bold text-sm mb-1">{exporter?.company_name}</p>
              <p className="text-[13px] text-port-steel">{exporter?.country}</p>
            </div>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#1ebd55] text-white font-bold text-sm py-4 rounded-xl shadow flex items-center justify-center gap-2"
            >
              Express Interest on WhatsApp
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
