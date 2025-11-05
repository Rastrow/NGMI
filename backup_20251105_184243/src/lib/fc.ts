import { sdk } from "@farcaster/miniapp-sdk";

export const fc = {
  ready() {
    try {
      // Signal to the Farcaster client that the app is ready to display
      sdk?.actions?.ready?.();
    } catch {}
  },
  composeCast({ text, embeds = [] as string[] }: { text: string; embeds?: string[] }) {
    const base = "https://warpcast.com/~/compose";
    const params = new URLSearchParams();
    if (text) params.set("text", text);
    for (const e of embeds) params.append("embeds[]", e);
    const url = `${base}?${params.toString()}`;
    try {
      // Prefer opening via SDK when running inside the Mini app
      if (sdk?.actions?.openUrl) return sdk.actions.openUrl(url);
    } catch {}
    if (typeof window !== "undefined") window.open(url, "_blank");
  },
  openUrl(url: string) {
    try {
      if (sdk?.actions?.openUrl) return sdk.actions.openUrl(url);
    } catch {}
    if (typeof window !== "undefined") window.open(url, "_blank");
  },
};
