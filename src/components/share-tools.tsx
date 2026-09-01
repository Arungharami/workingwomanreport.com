import { CopyButton } from "@/components/copy-button";
import { siteConfig } from "@/lib/site";

export function ShareTools({ path, title }: { path: string; title: string }) {
  const url = new URL(path, siteConfig.url).toString();

  return (
    <div className="flex flex-wrap gap-2" aria-label="Share tools">
      <CopyButton value={url} label="Copy link" />
      <a
        className="inline-flex min-h-10 items-center border border-[var(--line)] px-3 text-sm font-semibold"
        href={`https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noreferrer"
      >
        Share on X
      </a>
    </div>
  );
}
