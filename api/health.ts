export default async function handler(req: any, res: any) {
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ ok: true });
}
