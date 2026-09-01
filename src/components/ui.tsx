import Link from "next/link";
import type { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
      {children}
    </p>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
}) {
  return (
    <Link
      href={href}
      className={
        variant === "primary"
          ? "inline-flex min-h-11 items-center justify-center bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[var(--background)] transition hover:opacity-85"
          : "inline-flex min-h-11 items-center justify-center border border-[var(--line)] px-5 py-3 text-sm font-semibold transition hover:border-[var(--foreground)]"
      }
    >
      {children}
    </Link>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  dek,
}: {
  eyebrow?: string;
  title: string;
  dek?: string;
}) {
  return (
    <div className="mb-6 flex flex-col gap-2 border-t border-[var(--line)] pt-5 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2 className="mt-2 max-w-3xl font-serif text-3xl leading-tight md:text-4xl">
          {title}
        </h2>
      </div>
      {dek ? (
        <p className="max-w-md text-sm leading-6 text-[var(--ink-muted)]">{dek}</p>
      ) : null}
    </div>
  );
}
