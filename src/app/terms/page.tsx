import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <div className="container-shell max-w-3xl py-10">
      <h1 className="font-serif text-5xl">Terms</h1>
      <p className="mt-6 text-sm leading-7 text-[var(--ink-muted)]">
        Placeholder terms documentation. Replace with counsel-approved terms,
        licensing, copyright, syndication, correction, and reuse policies before
        public launch.
      </p>
    </div>
  );
}
