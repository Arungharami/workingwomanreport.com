import type { WeeklyAnalyticsReport } from "@/lib/analytics-report";

const fields: Array<[keyof WeeklyAnalyticsReport, string]> = [
  ["websiteViews", "Website views"],
  ["videoViews", "Video views"],
  ["averageWatchTime", "Average watch time"],
  ["youtubeViews", "YouTube views"],
  ["instagramReach", "Instagram reach"],
  ["facebookReach", "Facebook reach"],
  ["tiktokViews", "TikTok views"],
  ["xImpressions", "X impressions"],
  ["engagement", "Engagement"],
  ["clicks", "Clicks"],
  ["followersAdded", "Followers added"],
  ["bestPlatform", "Best platform"],
  ["bestContent", "Best content"],
];

export function AnalyticsReport({ report }: { report: WeeklyAnalyticsReport }) {
  return (
    <section className="border border-[var(--line)] bg-[var(--paper)] p-5">
      <h2 className="font-serif text-3xl">Weekly Analytics Report</h2>
      <p className="mt-2 text-sm text-[var(--ink-muted)]">
        Enter real post-publication results only. Blank fields are preferable to invented data.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map(([key, label]) => (
          <div key={key} className="border-t border-[var(--line)] pt-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em]">{label}</p>
            <p className="mt-1 text-sm text-[var(--ink-muted)]">
              {report[key] ?? "Not recorded"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
