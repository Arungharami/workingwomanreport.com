export type NewsletterSignupResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

export async function subscribeToNewsletter(
  email: string,
): Promise<NewsletterSignupResult> {
  if (!process.env.NEWSLETTER_PROVIDER) {
    return {
      ok: false,
      message:
        "Newsletter provider is not configured yet. Set NEWSLETTER_PROVIDER and provider credentials before enabling live signups.",
    };
  }

  void email;
  return {
    ok: false,
    message:
      "Newsletter adapter is ready, but no provider implementation has been selected.",
  };
}
