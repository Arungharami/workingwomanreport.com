export function formatDate(input: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(input));
}

export function absoluteUrl(pathOrUrl: string, siteUrl: string) {
  if (pathOrUrl.startsWith("http")) {
    return pathOrUrl;
  }

  return new URL(pathOrUrl, siteUrl).toString();
}
