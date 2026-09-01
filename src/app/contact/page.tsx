import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui";
import { contactConfig } from "../../../config/contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Working Woman Report for editorial, booking, partnership, and production inquiries.",
};

export default function ContactPage() {
  const channels = [contactConfig.editorial, contactConfig.booking, contactConfig.corrections];

  return (
    <div className="container-shell py-10">
      <SectionHeader
        eyebrow="Contact"
        title="Contact Working Woman Report"
        dek="Editorial, production, booking, partnership, and correction requests."
      />
      <div className="grid gap-6 md:grid-cols-3">
        {channels.map((channel) => (
          <section key={channel.label} className="border-t border-[var(--line)] pt-4">
            <h2 className="font-serif text-2xl">{channel.label}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--ink-muted)]">{channel.note}</p>
            <p className="mt-3 text-sm font-semibold">{channel.email}</p>
          </section>
        ))}
      </div>
      <p className="mt-10 max-w-2xl text-xs leading-6 text-[var(--ink-muted)]">
        Working Woman Report does not publish a personal street address or personal phone
        number for its reporters. Only business contact information approved by Allison is
        listed here.
      </p>
    </div>
  );
}
