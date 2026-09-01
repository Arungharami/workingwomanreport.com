import Link from "next/link";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { navItems, secondaryNavItems, siteConfig } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  const socials = Object.values(siteConfig.social).filter(
    (item) => item.configured && item.url.startsWith("http"),
  );

  return (
    <footer className="mt-20 border-t border-[var(--line)] bg-[var(--paper)]">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-[1.2fr_0.85fr_0.85fr_1fr]">
        <div>
          <h2 className="font-serif text-3xl">{siteConfig.name}</h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-[var(--ink-muted)]">
            A women-focused television and editorial newsroom built around one authoritative
            weekly reporting package.
          </p>
          <div className="mt-5 flex gap-2">
            {socials.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.url}
                  aria-label={item.label}
                  className="inline-flex size-10 items-center justify-center border border-[var(--line)]"
                >
                  <Icon size={18} />
                </Link>
              );
            })}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em]">Navigate</h3>
          <div className="mt-4 grid gap-2 text-sm">
            {navItems.slice(0, 12).map((item) => (
              <Link key={item.href + item.label} href={item.href} className="hover:underline">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em]">Explore</h3>
          <div className="mt-4 grid gap-2 text-sm">
            {secondaryNavItems.map((item) => (
              <Link key={item.href} href={item.href} className="hover:underline">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <NewsletterSignup compact />
      </div>
      <div className="container-shell flex flex-col gap-3 border-t border-[var(--line)] py-5 text-xs text-[var(--ink-muted)] md:flex-row md:items-center md:justify-between">
        <p>
          Copyright {year} {siteConfig.name}. All rights reserved.
        </p>
        <div className="flex gap-4">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
