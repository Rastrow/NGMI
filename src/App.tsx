import { fc } from "./lib/fc";
import { useEffect, useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, parseEventLogs } from "viem";
import { generateQuoteImage, dataURLtoFile } from "./lib/utils";
import { quoteNftAbi } from "./lib/abi";

function App() {
  useEffect(() => {
    fc.ready();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        padding: 16,
        backgroundImage: "linear-gradient(rgba(95,158,160,0.92), rgba(95,158,160,0.92)), url(/logo-2.png)",
        backgroundColor: "#5F9EA0",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        backgroundPosition: "right 5% center",
      }}
    >
      <div style={{ width: 420, background: "#1f1f1f", borderRadius: 16, padding: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
        <h1 style={{ textAlign: "center", marginBottom: 12 }}>Daily Rekt Quote</h1>
        <MintContainer />
      </div>
    </main>
  );
}

function MintContainer() {
  const { address } = useAccount();
  const [quote, setQuote] = useState<{ quote: string; author: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [tokenId, setTokenId] = useState<string | null>(null);

  const fetchQuote = async (random = false) => {
    setLoading(true);
    try {
      const path = random ? "/api/quote/random" : "/api/quote";
      const res = await fetch(`${path}?t=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`status ${res.status}`);
      let data = await res.json();
      // If random returns same as current, retry up to 4 times
      if (random && quote && data && data.quote === quote.quote && data.author === quote.author) {
        for (let i = 0; i < 4; i++) {
          const r = await fetch(`/api/quote/random?t=${Date.now()}`, { cache: "no-store" });
          const d = await r.json();
          if (!quote || d.quote !== quote.quote || d.author !== quote.author) { data = d; break; }
        }
      }
      setQuote(data);
    } catch (e) {
      // Fallback to deterministic endpoint if random fails
      try {
        const res2 = await fetch(`/api/quote?t=${Date.now()}`, { cache: "no-store" });
        const data2 = await res2.json();
        setQuote(data2);
      } catch {
        setQuote({ quote: 'Failed to load quote', author: 'System' });
      }
    } finally {
      setTokenId(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote(false);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <QuoteDisplay quote={quote} loading={loading} />
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => fetchQuote(true)} disabled={loading} style={{ flex: 1, padding: 10, borderRadius: 10, background: "#f59e0b", color: "#111", fontWeight: 700 }}>New Quote</button>
        <MintButton quote={quote} to={address} onMinted={(id) => setTokenId(id)} />
      </div>
      <ShareButton tokenId={tokenId} />
      <FollowButton />
    </div>
  );
}

function QuoteDisplay({ quote, loading }: { quote: { quote: string; author: string } | null; loading: boolean }) {
  if (loading) return <div style={{ minHeight: 120, display: "flex", alignItems: "center", justifyContent: "center", background: "#262626", borderRadius: 12 }}>Loading...</div>;
  if (!quote) return null;
  return (
    <div style={{ background: "#262626", borderRadius: 12, padding: 16 }}>
      <blockquote style={{ fontStyle: "italic", fontSize: 18, fontWeight: 700, textAlign: "center" }}>“{quote.quote}”</blockquote>
      <div style={{ textAlign: "right", marginTop: 8, color: "#a78bfa" }}>by - {quote.author}</div>
    </div>
  );
}

function MintButton({ quote, to, onMinted }: { quote: { quote: string; author: string } | null; to?: `0x${string}`; onMinted: (id: string) => void }) {
  const { data: hash, writeContract, isPending } = useWriteContract();
  const { data: receipt, isLoading: confirming } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (!receipt) return;
    try {
      const logs = parseEventLogs({ abi: quoteNftAbi, logs: receipt.logs, eventName: "Transfer" });
      const zero = "0x0000000000000000000000000000000000000000";
      const mintLog = logs.find((l) => (l as any).args.from === zero);
      const id = mintLog ? String((mintLog as any).args.tokenId) : undefined;
      if (id) onMinted(id);
    } catch {}
  }, [receipt, onMinted]);

  const handleMint = async () => {
    if (!quote || !to) return;
    const dataUrl = generateQuoteImage(quote.quote, quote.author);
    const file = dataURLtoFile(dataUrl, "quote.png");
    if (!file) return alert("Failed to prepare image");

    const form = new FormData();
    form.append("file", file);
    form.append("quote", quote.quote);
    form.append("author", quote.author);
    const res = await fetch("/api/upload", { method: "POST", body: form, cache: "no-store" });
    const json = await res.json();
    const tokenUriCid = json?.cid;
    if (!tokenUriCid) return alert("Upload failed");

    writeContract({
      address: (import.meta as any).env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
      abi: quoteNftAbi,
      functionName: "safeMint",
      args: [to, tokenUriCid],
      value: parseEther("0.0001"),
    });
  };

  const text = hash ? (confirming ? "Confirming..." : "Minted!") : isPending ? "Sending..." : "Mint (0.0001 ETH)";

  return (
    <button onClick={handleMint} disabled={!quote || !!hash || isPending || confirming} style={{ flex: 1, padding: 10, borderRadius: 10, background: "#10b981", color: "#111", fontWeight: 700 }}>
      {text}
    </button>
  );
}

function ShareButton({ tokenId }: { tokenId: string | null }) {
  const appUrl = (import.meta as any).env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '');
  const share = () => {
    const text = tokenId ? `Minted a Daily Rekt Quote! #${tokenId}` : "Rekt Quote of the day — mint yours";
    fc.composeCast({ text, embeds: [appUrl] });
  };
  return (
    <button onClick={share} style={{ width: "100%", padding: 10, borderRadius: 10, background: "#22c55e", color: "#111", fontWeight: 700 }}>
      📣 Share on Farcaster
    </button>
  );
}

function FollowButton() {
  const follow = () => {
    fc.openUrl("https://farcaster.xyz/marcow");
  };
  return (
    <button onClick={follow} style={{ width: "100%", padding: 10, borderRadius: 10, background: "#7c3aed", color: "#fff", fontWeight: 700 }}>
      ⭐ Follow - Marcow
    </button>
  );
}

export default App;
