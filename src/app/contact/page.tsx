import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Working Woman Report for editorial, booking, partnership, and production inquiries.",
};

export default function ContactPage() {
  return (
    <div className="container-shell py-10">
      <SectionHeader
        eyebrow="Contact"
        title="Contact Working Woman Report"
        dek="Editorial, production, booking, partnership, and correction requests."
      />
      <div className="grid gap-6 md:grid-cols-3">
        {["Editorial", "Booking", "Corrections"].map((label) => (
          <section key={label} className="border-t border-[var(--line)] pt-4">
            <h2 className="font-serif text-2xl">{label}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--ink-muted)]">
              Use the shared newsroom inbox until dedicated routing is confirmed.
            </p>
            <p className="mt-3 text-sm font-semibold">{siteConfig.contactEmail}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
