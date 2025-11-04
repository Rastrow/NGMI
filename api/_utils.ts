import { readFile } from "fs/promises";
import path from "path";

export type Quote = { quote: string; author: string };

export async function loadQuotes(): Promise<Quote[]> {
  try {
    const p = path.resolve(process.cwd(), "quotes.json");
    const raw = await readFile(p, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as Quote[];
  } catch {}
  return [
    { quote: "Stay hungry, stay foolish.", author: "Steve Jobs" },
    { quote: "The only limit is you.", author: "Unknown" },
  ];
}
