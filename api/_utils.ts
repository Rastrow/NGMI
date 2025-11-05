import { readFile } from "fs/promises";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

export type Quote = { quote: string; author: string };

export async function loadQuotes(): Promise<Quote[]> {
  // 0) Try bundling the JSON via createRequire so serverless packs it
  try {
    const require = createRequire(import.meta.url);
    const data = require("../quotes.json");
    if (Array.isArray(data)) return data as Quote[];
    if (data?.default && Array.isArray(data.default)) return data.default as Quote[];
  } catch {}

  // 1) Try reading from project root (works well on Vercel when the file is included in the output)
  try {
    const rootPath = resolve(process.cwd(), "quotes.json");
    const rawRoot = await readFile(rootPath, "utf-8");
    const parsedRoot = JSON.parse(rawRoot);
    if (Array.isArray(parsedRoot)) return parsedRoot as Quote[];
  } catch {}

  // 2) Try reading relative to this file (works in local dev and serverless bundles)
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const p = resolve(__dirname, "../quotes.json");
    const raw = await readFile(p, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as Quote[];
  } catch {}

  // 3) Minimal hardcoded fallback (ensure the function never throws)
  return [
    { quote: "Stay hungry, stay foolish.", author: "Steve Jobs" },
    { quote: "The only limit is you.", author: "Unknown" },
  ];
}
