const ROOT_URL = "https://ngmi-hi8n8cin4-rafael-puvas-projects.vercel.app";

export const minikitConfig = {
  accountAssociation: {
    header: "",
    payload: "",
    signature: "",
  },
  miniapp: {
    version: "1",
    name: "Daily Rekt Quote",
    subtitle: "Mintable rekt quotes, refreshed daily on Base.",
    description:
      "Daily Rekt Quote lets you mint and share a fresh rekt quote on Base each day. Collect your streak, post to Farcaster, and keep the rekt vibes onchain.",
    screenshotUrls: [
      `${ROOT_URL}/splash.svg`
    ],
    iconUrl: `${ROOT_URL}/splash.svg`,
    splashImageUrl: `${ROOT_URL}/splash.svg`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    primaryCategory: "social",
    tags: ["social", "quotes", "base"],
    heroImageUrl: `${ROOT_URL}/splash.svg`,
    tagline: "",
    ogTitle: "Daily Rekt Quote",
    ogDescription: "Mint and share a daily rekt quote on Base.",
    ogImageUrl: `${ROOT_URL}/splash.svg`,
  },
} as const;
