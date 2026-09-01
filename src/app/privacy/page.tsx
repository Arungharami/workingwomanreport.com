import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <div className="container-shell max-w-3xl py-10">
      <h1 className="font-serif text-5xl">Privacy</h1>
      <p className="mt-6 text-sm leading-7 text-[var(--ink-muted)]">
        Placeholder privacy documentation. Replace with counsel-approved policy language before
        public launch, especially after analytics, newsletter, advertising, or account features
        are connected.
      </p>
    </div>
  );
}
