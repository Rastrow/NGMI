import type { IncomingMessage, ServerResponse } from "http";
import formidable from "formidable";
import { readFile } from "fs/promises";
import pinataSDK from "@pinata/sdk";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: IncomingMessage & { method?: string }, res: ServerResponse & { status?: (code: number) => any }) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Allow", "POST");
    res.end("Method Not Allowed");
    return;
  }

  try {
    const { fields, files } = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
      const form = formidable({ multiples: false });
      form.parse(req as any, (err: any, fields: any, files: any) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    const quote = (fields["quote"] as string) || "";
    const author = (fields["author"] as string) || "";
    const f = files["file"] as formidable.File | formidable.File[] | undefined;

    const file = Array.isArray(f) ? f[0] : f;
    if (!file || !file.filepath || !quote || !author) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "missing" }));
      return;
    }

    const buffer = await readFile(file.filepath);

    const pinata = new (pinataSDK as any)({ pinataJwt: process.env.PINATA_JWT || "" }) as any;
    const image = await (pinata as any).upload.file(buffer, { name: `quote-${Date.now()}.png` });

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

    const meta = await (pinata as any).upload.json(metadata, { name: `quote-${Date.now()}.json` });

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ cid: meta.cid }));
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "server" }));
  }
}
