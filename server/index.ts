import express from "express";
import cors from "cors";
import multer from "multer";
import pinataSDK from "@pinata/sdk";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const app = express();
const upload = multer();
app.use(cors());

// Lazily initialize Pinata to avoid startup failures when PINATA_JWT is missing in dev
const getPinata = () => new pinataSDK({ pinataJwt: process.env.PINATA_JWT || "" });

// Health check (parity with CJS server)
app.get("/api/health", (_req, res) => res.json({ ok: true }));

async function loadQuotes(): Promise<Array<{ quote: string; author: string }>> {
	try {
		const __filename = fileURLToPath(import.meta.url);
		const __dirname = dirname(__filename);
		const p = resolve(__dirname, "../quotes.json");
		const raw = await readFile(p, "utf-8");
		const parsed = JSON.parse(raw);
		if (Array.isArray(parsed)) return parsed as Array<{ quote: string; author: string }>;
	} catch {}
	// Fallback minimal set
	return [
		{ quote: "Stay hungry, stay foolish.", author: "Steve Jobs" },
		{ quote: "The only limit is you.", author: "Unknown" },
	];
}

app.get("/api/quote", async (_req, res) => {
	try {
		const quotes = await loadQuotes();
		const today = new Date().toISOString().slice(0, 10);
		const idx = Math.abs([...today].reduce((a, c) => (a * 33 + c.charCodeAt(0)) | 0, 5381)) % quotes.length;
		res.json(quotes[idx]);
	} catch (e) {
		res.status(500).json({ error: "server" });
	}
});

// Always-random endpoint with cache-busting headers
app.get("/api/quote/random", async (_req, res) => {
  try {
    const quotes = await loadQuotes();
    const idx = Math.floor(Math.random() * quotes.length);
    res.set("Cache-Control", "no-store");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    res.json(quotes[idx]);
  } catch (e) {
    res.status(500).json({ error: "server" });
  }
});

app.post("/api/upload", upload.single("file"), async (req, res) => {
	try {
		const file = req.file;
		const { quote, author } = req.body as { quote: string; author: string };
		if (!file || !quote || !author) return res.status(400).json({ error: "missing" });

    const pinata = getPinata();
    // Upload raw Buffer directly (supported by pinata/sdk in Node)
    const image = await pinata.upload.file(file.buffer as unknown as Buffer, { name: `quote-${Date.now()}.png` });
		const metadata = {
			name: `Quote by ${author}`,
			description: quote,
			image: `ipfs://${image.cid}`,
			attributes: [
				{ trait_type: "Author", value: author },
				{ trait_type: "Length", value: quote.length },
				{ trait_type: "Date", value: new Date().toISOString().slice(0, 10) },
			],
		};
		const meta = await pinata.upload.json(metadata, { name: `quote-${Date.now()}.json` });
		res.json({ cid: meta.cid });
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: "server" });
	}
});

const port = process.env.PORT || 8787;
app.listen(port, () => {
	console.log(`API server running on http://localhost:${port}`);
});
