import { readFile } from "fs/promises";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

export type Quote = { quote: string; author: string };

export async function loadQuotes(): Promise<Quote[]> {
  // 1) Try dynamic import so bundlers (Vercel/SWC) include the JSON if supported
  try {
    const mod: any = await import("../quotes.json", { assert: { type: "json" } } as any);
    const data = mod?.default ?? mod;
    if (Array.isArray(data)) return data as Quote[];
  } catch {}

  // 2) Fallback to fs read using path relative to this file
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const p = resolve(__dirname, "../quotes.json");
    const raw = await readFile(p, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as Quote[];
  } catch {}

  // 3) Minimal hardcoded fallback
  return [
    { quote: "Stay hungry, stay foolish.", author: "Steve Jobs" },
    { quote: "The only limit is you.", author: "Unknown" },
  ];
}
