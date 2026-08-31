"use client";

import { useState } from "react";

// Replace with your own WhatsApp number in 254XXXXXXXXX format —
// this is where dealer signup requests get sent.
const ADMIN_WHATSAPP_NUMBER = "254795490196";

export default function DealerForm() {
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
        placeholder="WhatsApp number (2547...)"
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
  );
}
