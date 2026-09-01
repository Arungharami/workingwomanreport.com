"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main style={{ padding: 32, fontFamily: "system-ui, sans-serif" }}>
          <p style={{ textTransform: "uppercase", fontSize: 12 }}>Working Woman Report</p>
          <h1>Something went wrong.</h1>
          <p>The site could not load. Please try again.</p>
          <button type="button" onClick={reset}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
