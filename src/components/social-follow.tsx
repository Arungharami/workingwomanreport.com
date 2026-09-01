import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function SocialFollow() {
  return (
    <section className="border-y border-[var(--line)] py-6">
      <h2 className="font-serif text-2xl">Follow Working Woman Report</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {Object.values(siteConfig.social)
          .filter((item) => item.configured && item.url.startsWith("http"))
          .map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.url}
                className="inline-flex min-h-10 items-center gap-2 border border-[var(--line)] px-3 text-sm font-semibold"
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
      </div>
    </section>
  );
}
