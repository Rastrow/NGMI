const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pinataSDK = require("@pinata/sdk");
const { readFile } = require("fs/promises");
const path = require("path");
const { randomInt } = require("crypto");

const app = express();
const upload = multer();
app.use(cors());
// Simple request logger for debugging
app.use((req, _res, next) => {
    console.log(`[api] ${req.method} ${req.url}`);
    next();
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

const getPinata = () => new pinataSDK({ pinataJwt: process.env.PINATA_JWT || "" });

async function loadQuotes() {
	try {
		const p = path.resolve(__dirname, "../quotes.json");
		const raw = await readFile(p, "utf-8");
		const parsed = JSON.parse(raw);
		if (Array.isArray(parsed)) return parsed;
	} catch {}
	return [
		{ quote: "Stay hungry, stay foolish.", author: "Steve Jobs" },
		{ quote: "The only limit is you.", author: "Unknown" },
	];
}

app.get("/api/quote", async (req, res) => {
	try {
		const quotes = await loadQuotes();
		const rand = (req.query && (req.query.rand === "1" || req.query.rand === 1)) ? true : false;
    let idx;
    if (rand) {
        idx = randomInt(quotes.length);
    } else {
			const today = new Date().toISOString().slice(0, 10);
			idx = Math.abs([...today].reduce((a, c) => (a * 33 + c.charCodeAt(0)) | 0, 5381)) % quotes.length;
		}
    res.set("Cache-Control", "no-store");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
		res.json(quotes[idx]);
	} catch (e) {
		res.status(500).json({ error: "server" });
	}
});

// Always-random endpoint (simple and cache-proof)
app.get("/api/quote/random", async (_req, res) => {
    try {
        const quotes = await loadQuotes();
        const idx = randomInt(quotes.length);
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
		const { quote, author } = req.body || {};
		if (!file || !quote || !author) return res.status(400).json({ error: "missing" });

		const pinata = getPinata();
		const image = await pinata.upload.file(file.buffer, { name: `quote-${Date.now()}.png` });
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
