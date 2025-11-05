export default async function handler(_req: any, res: any) {
  try {
    res.setHeader("Cache-Control", "no-store");
    // Minimal OK response for Mini App webhook validation
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(200).json({ ok: true });
  }
}
