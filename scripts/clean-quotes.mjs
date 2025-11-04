import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

async function main() {
  const file = resolve(process.cwd(), 'quotes.json');
  const raw = await readFile(file, 'utf-8');
  const arr = JSON.parse(raw);
  if (!Array.isArray(arr)) throw new Error('quotes.json is not an array');

  const cleaned = arr.map((q) => {
    if (!q || typeof q !== 'object') return q;
    const out = { ...q };
    if (typeof out.quote === 'string') {
      // Remove any bracketed references like [8], [21, 22], [23][23]
      let s = out.quote.replace(/\s*\[[^\]]*\]/g, '');
      // Normalize whitespace
      s = s.replace(/\s{2,}/g, ' ').trim();
      // Remove leading/trailing straight or curly quotes repeatedly
      // Characters: straight '"', single '\'', curly left/right “ ” ‘ ’
      const leadTrailQuoteRe = /^[\"'“”‘’\s]+|[\"'“”‘’\s]+$/g;
      s = s.replace(leadTrailQuoteRe, '').trim();
      // If after trimming it still begins/ends with quotes due to mixed punctuation, strip once more
      s = s.replace(/^([\"“”])\s*/, '').replace(/\s*([\"“”])$/, '');
      out.quote = s;
    }
    return out;
  });

  await writeFile(file, JSON.stringify(cleaned, null, 2) + '\n', 'utf-8');
  console.log('quotes.json cleaned:', cleaned.length, 'entries');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
