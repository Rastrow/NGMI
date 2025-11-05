export function generateQuoteImage(quote: string, author: string): string {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
	const width = 800;
	const height = 450;
	canvas.width = width;
	canvas.height = height;
	if (!ctx) return "";

	// seed based on quote+author+date
	const seedStr = `${quote}|${author}|${new Date().toISOString().slice(0, 10)}`;
	let seed = 0;
	for (let i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
	const hue1 = seed % 360;
	const hue2 = (seed * 7) % 360;

	const gradient = ctx.createLinearGradient(0, 0, width, height);
	gradient.addColorStop(0, `hsl(${hue1}, 70%, 45%)`);
	gradient.addColorStop(1, `hsl(${hue2}, 70%, 35%)`);
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, width, height);

	// card
	const cardPad = 36;
	roundedRect(ctx, cardPad, cardPad, width - cardPad * 2, height - cardPad * 2, 18);
	ctx.fillStyle = "rgba(0,0,0,0.35)";
	ctx.fill();

	ctx.fillStyle = "#fff";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	// quote text
	ctx.font = "bold 32px Georgia, serif";
	wrapText(ctx, `“${quote}”`, width / 2, height / 2 - 20, width - 140, 40);
	ctx.font = "italic 24px Georgia, serif";
	ctx.fillText(`- ${author}`, width / 2, height / 2 + 90);

	// subtle watermark
	ctx.font = "600 16px system-ui, sans-serif";
	ctx.globalAlpha = 0.8;
	ctx.fillText("QuoteNFT", width - 90, height - 24);
	ctx.globalAlpha = 1;

	return canvas.toDataURL("image/png");
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, cx: number, y: number, maxWidth: number, lineHeight: number) {
	const words = text.split(" ");
	let line = "";
	let py = y;
	for (let n = 0; n < words.length; n++) {
		const testLine = line + words[n] + " ";
		const metrics = ctx.measureText(testLine);
		if (metrics.width > maxWidth && n > 0) {
			ctx.fillText(line, cx, py);
			line = words[n] + " ";
			py += lineHeight;
		} else {
			line = testLine;
		}
	}
	ctx.fillText(line, cx, py);
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.arcTo(x + w, y, x + w, y + h, r);
	ctx.arcTo(x + w, y + h, x, y + h, r);
	ctx.arcTo(x, y + h, x, y, r);
	ctx.arcTo(x, y, x + w, y, r);
	ctx.closePath();
}

export function dataURLtoFile(dataurl: string, filename: string): File | null {
	try {
		const [meta, base64] = dataurl.split(",");
		const mime = /data:(.*?);base64/.exec(meta)?.[1] || "image/png";
		const bin = atob(base64);
		const arr = new Uint8Array(bin.length);
		for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
		return new File([arr], filename, { type: mime });
	} catch {
		return null;
	}
}
