import type { IncomingMessage, ServerResponse } from "http";
import { loadQuotes } from "../_utils";

export default async function handler(_req: IncomingMessage, res: ServerResponse) {
  try {
    const quotes = await loadQuotes();
    const idx = Math.floor(Math.random() * quotes.length);
    res.statusCode = 200;
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(quotes[idx]));
  } catch (e) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "server" }));
  }
}
