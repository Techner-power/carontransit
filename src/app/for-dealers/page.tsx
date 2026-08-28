"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Replace with your own WhatsApp number in 254XXXXXXXXX format —
// this is where dealer signup requests get sent.
const ADMIN_WHATSAPP_NUMBER = "254700000000";

export default function ForDealersPage() {
  const [businessName, setBusinessName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [location, setLocation] = useState("");
  const [kraPin, setKraPin] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Hello, I'd like to list my dealership on CarOnTransit.co.ke.\n\nBusiness name: ${businessName}\nWhatsApp: ${whatsapp}\nYard location: ${location}\nKRA PIN: ${kraPin}`;
    const link = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(link, "_blank");
  };

  return (
    <>
      <Header />

      <div className="bg-ink-navy text-manifest-cream">
        <div className="max-w-[820px] mx-auto px-6 py-16 text-center">
          <div className="font-mono text-[11px] font-semibold text-customs-amber uppercase tracking-widest mb-3">
            For Dealers &amp; Import Yards
          </div>
          <h1 className="text-[36px] font-extrabold tracking-tight mb-4">
            List your cars in transit for free. Get leads while they&apos;re still on the water.
          </h1>
          <p className="text-manifest-cream/75 leading-relaxed max-w-[560px] mx-auto">
            We track your incoming units and send serious buyers straight to your WhatsApp — before
            your car even reaches Mombasa. No listing fee. No commission. No middleman.
          </p>
        </div>
      </div>

      <div className="max-w-[820px] mx-auto px-6 py-14">
        <h2 className="text-xl font-bold mb-6">What we need from you</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
          {[
            { t: "Photos", d: "Clear photos of 3-5 units currently on the water." },
            { t: "Specs", d: "Make, model, year, and your CIF cost per unit." },
            { t: "ETA & Vessel", d: "Vessel name and estimated arrival date at Mombasa." },
          ].map((item) => (
            <div key={item.t} className="bg-white border border-black/[0.12] rounded-xl p-5">
              <h3 className="font-bold text-sm mb-1.5">{item.t}</h3>
              <p className="text-[13px] text-port-steel leading-relaxed">{item.d}</p>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold mb-6">How leads reach you</h2>
        <p className="text-port-steel leading-relaxed mb-14">
          When a buyer sees your car, one tap opens WhatsApp directly to your number, with your
          business name and the unit already filled in. You negotiate and close the deal yourself —
          we never insert ourselves into the transaction or take a cut.
        </p>

        <div className="bg-manifest-cream-2 border border-black/[0.12] rounded-xl p-7">
          <h2 className="text-lg font-bold mb-2">List your first units</h2>
          <p className="text-sm text-port-steel mb-5">
            We onboard dealers manually during launch to keep listings verified. Send us your details
            and we&apos;ll reach out on WhatsApp within 24 hours.
          </p>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Business name"
              className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm bg-white"
            />
            <input
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="WhatsApp number (254795490196)"
              className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm bg-white"
            />
            <input
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Yard location (e.g. Ngong Road)"
              className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm bg-white sm:col-span-2"
            />
            <input
              required
              value={kraPin}
              onChange={(e) => setKraPin(e.target.value)}
              placeholder="KRA PIN"
              className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm bg-white sm:col-span-2"
            />
            <button
              type="submit"
              className="bg-customs-amber text-ink-navy font-bold text-sm py-3 rounded-lg sm:col-span-2"
            >
              Request to List
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}