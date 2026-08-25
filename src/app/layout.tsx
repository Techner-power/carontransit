import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CarOnTransit.co.ke — Lock Your Ngeta Before It Docks",
  description:
    "Kenya's live vehicle transit marketplace. Browse cars still on the water to Mombasa, verified by chassis and vessel, connect directly with dealers on WhatsApp.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
