export const fc = {
  ready() {
    // No-op placeholder to mirror sdk.actions.ready()
  },
  composeCast({ text, embeds = [] as string[] }: { text: string; embeds?: string[] }) {
    const base = "https://warpcast.com/~/compose";
    const params = new URLSearchParams();
    if (text) params.set("text", text);
    for (const e of embeds) params.append("embeds[]", e);
    const url = `${base}?${params.toString()}`;
    if (typeof window !== "undefined") window.open(url, "_blank");
  },
  openUrl(url: string) {
    if (typeof window !== "undefined") window.open(url, "_blank");
  },
};
