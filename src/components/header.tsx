"use client";

import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { navItems, siteConfig } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--background)_92%,transparent)] backdrop-blur">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-[var(--paper)] focus:p-3"
      >
        Skip to content
      </a>
      <div className="container-shell flex min-h-20 items-center gap-4">
        <Link href="/" className="mr-auto flex flex-col leading-none">
          <span className="font-serif text-2xl font-semibold tracking-normal">
            Working Woman Report
          </span>
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">
            {siteConfig.tagline}
          </span>
        </Link>
        <nav className="hidden items-center gap-4 text-sm font-medium lg:flex">
          {navItems.slice(0, 8).map((item) => (
            <Link key={item.href + item.label} href={item.href} className="hover:underline">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/search"
          aria-label="Search"
          className="inline-flex size-10 items-center justify-center border border-[var(--line)]"
        >
          <Search size={18} />
        </Link>
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center border border-[var(--line)] lg:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>
      </div>
      {open ? (
        <div className="fixed inset-0 z-50 bg-[var(--background)] p-5 lg:hidden">
          <div className="mb-8 flex items-center justify-between">
            <span className="font-serif text-2xl">{siteConfig.shortName}</span>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center border border-[var(--line)]"
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
            >
              <X size={20} />
            </button>
          </div>
          <nav className="grid gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-[var(--line)] py-3 text-lg"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
