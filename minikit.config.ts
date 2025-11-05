const ROOT_URL = "https://ngmi-9yvvor0of-digitalthinker.vercel.app";

export const minikitConfig = {
  accountAssociation: {
    header: "eyJmaWQiOjEwMjUyMTAsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHhBOTdlMzBiRjQyNGY5RDIyQTg3Mjc3ZjhmMEE0NDIwZTJiMDM0ODc0In0",
    payload: "eyJkb21haW4iOiJuZ21pLXR3by52ZXJjZWwuYXBwIn0",
    signature: "MHg4ZjliNTBjMTM5M2QzNWMxZDQxZjA4YjNlNzVjZmJjYWU2MThlMDMzNmQ2MDliYTEyNTUwYzdiYjM3NGFiMDRkMjk2MjdmYjdmMmUwNGYzOGZhZjg2YzJhYzdkMDEwNTRmNzI1Mjk2Y2JjM2VlYmM1ODQ1Yzc0ZWI2YTk3YmIxYjFi",
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
