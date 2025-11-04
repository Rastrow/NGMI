import type { IncomingMessage, ServerResponse } from "http";
import { loadQuotes } from "./_utils";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    const quotes = await loadQuotes();
    const today = new Date().toISOString().slice(0, 10);
    const idx = Math.abs([...today].reduce((a, c) => (a * 33 + c.charCodeAt(0)) | 0, 5381)) % quotes.length;
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(quotes[idx]));
  } catch (e) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "server" }));
  }
}
