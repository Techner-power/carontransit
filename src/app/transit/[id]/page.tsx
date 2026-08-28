import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getTransitVehicleById, calculateOnTheRoadPrice, buildDealerWhatsAppLink } from "@/lib/queries";
import { ShipmentStage } from "@/lib/types";

const STAGES: ShipmentStage[] = ["On Water", "Docked", "Clearing", "Available at Yard"];

export default async function ListingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicle = await getTransitVehicleById(id);
  if (!vehicle) notFound();

  const otrPrice = calculateOnTheRoadPrice(vehicle);
  const whatsappLink = buildDealerWhatsAppLink(vehicle);
  const currentStageIndex = STAGES.indexOf(vehicle.current_transit_status);

  return (
    <>
      <Header />

      <div className="max-w-[1180px] mx-auto px-6 py-10">
        <Link href="/transit" className="text-sm text-port-steel">
          ← Back to Browse
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 mt-6">
          <div>
            <div className="h-[340px] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 mb-6">
              {vehicle.vehicle_hero_image?.startsWith("http") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={vehicle.vehicle_hero_image}
                  alt={vehicle.vehicle_title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-port-steel">
                  Vehicle photo
                </div>
              )}
            </div>

            <h1 className="text-[28px] font-extrabold tracking-tight mb-2">{vehicle.vehicle_title}</h1>
            <div className="flex gap-4 text-sm text-port-steel font-mono mb-8">
              <span>Chassis ****{vehicle.chassis_masked_identifier}</span>
              <span>·</span>
              <span>{vehicle.vessel_identifier}</span>
              <span>·</span>
              <span>{vehicle.year_of_manufacture}</span>
            </div>

            {/* Vessel timeline */}
            <div className="bg-white border border-black/[0.12] rounded-xl p-6 mb-8">
              <h2 className="text-sm font-bold mb-5">Shipment Progress</h2>
              <div className="flex justify-between relative">
                <div className="absolute top-3 left-0 right-0 h-0.5 bg-black/[0.1]" />
                {STAGES.map((stage, i) => (
                  <div key={stage} className="flex flex-col items-center gap-2 relative z-10 flex-1">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        i <= currentStageIndex
                          ? "bg-customs-amber text-ink-navy"
                          : "bg-white border border-black/[0.2] text-port-steel"
                      }`}
                    >
                      {i <= currentStageIndex ? "✓" : i + 1}
                    </div>
                    <span className="text-[11px] text-center text-port-steel max-w-[80px]">{stage}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verify this chassis */}
            <div className="bg-verified-teal/[0.06] border border-verified-teal/[0.3] rounded-xl p-5">
              <h3 className="text-sm font-bold text-verified-teal mb-2">Verify this chassis</h3>
              <p className="text-[13px] text-port-steel leading-relaxed">
                We show only the last 4 digits of the chassis number publicly. When you message the
                dealer, ask them to confirm the full chassis matches the shipping manifest before you
                send any deposit.{" "}
                <Link href="/verify" className="text-verified-teal font-semibold">
                  Learn how to verify a listing →
                </Link>
              </p>
            </div>
          </div>

          {/* Sidebar: price + dealer */}
          <div>
            <div className="bg-white border border-black/[0.12] rounded-xl p-6 mb-5">
              <h2 className="text-sm font-bold mb-4">Price Breakdown</h2>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-port-steel">CIF Mombasa Price</span>
                  <span className="font-mono font-semibold">
                    KES {Number(vehicle.cif_cost_kes).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-port-steel">Est. KRA Customs Duty</span>
                  <span className="font-mono font-semibold">
                    KES {Number(vehicle.kra_duty_estimated).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-port-steel">Est. Clearing Buffer</span>
                  <span className="font-mono font-semibold">KES 65,000</span>
                </div>
                <div className="flex justify-between pt-3 mt-1 border-t border-dashed border-black/[0.15] text-base">
                  <span className="font-bold">On-The-Road Est.</span>
                  <span className="font-mono font-extrabold text-verified-teal">
                    KES {otrPrice.toLocaleString()}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-port-steel mt-3">
                All figures are estimates. Confirm final duty with your dealer or a licensed clearing
                agent. See our{" "}
                <Link href="/duty-guide" className="underline">
                  duty guide
                </Link>
                .
              </p>
            </div>

            <div className="bg-white border border-black/[0.12] rounded-xl p-6 mb-5">
              <h2 className="text-sm font-bold mb-4">Dealer</h2>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm">{vehicle.dealer?.business_name}</span>
                <span className="text-verified-teal text-xs"> KRA Verified</span>
              </div>
              <p className="text-[13px] text-port-steel">{vehicle.dealer?.physical_location}</p>
              <p className="text-[13px] text-port-steel mt-1">
                Rating: {vehicle.dealer?.rating_score} / 5
              </p>
            </div>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#1ebd55] text-white font-bold text-sm py-4 rounded-xl shadow flex items-center justify-center gap-2"
            >
              Text Dealer to Lock This Unit
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}