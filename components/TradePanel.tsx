"use client";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { swap, type Memestock } from "@/lib/data";
import { CircleNotch, CheckCircle, ArrowsDownUp } from "@phosphor-icons/react";

// Buy/sell a memestock directly in the FE. Estimates the fill from the current
// price; the real Meteora DBC / DAMM v2 swap tx swaps in through the seam (swap).
const QUOTE = "USDC";
const SLIPPAGES = [0.5, 1, 2];

export function TradePanel({ m }: { m: Memestock }) {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [slip, setSlip] = useState(1);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ out: number; sig: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const num = parseFloat(amount) || 0;
  const estOut = side === "buy" ? num / m.priceUsd : num * m.priceUsd;
  const minOut = estOut * (1 - slip / 100);
  const payLabel = side === "buy" ? QUOTE : `$${m.ticker}`;
  const getLabel = side === "buy" ? `$${m.ticker}` : QUOTE;
  const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: n < 1 ? 6 : 2 });

  const onSwap = async () => {
    if (num <= 0 || busy) return;
    setBusy(true); setError(null);
    try {
      const res = await swap({ id: m.id, side, amountIn: num, quoteToken: QUOTE, slippageBps: Math.round(slip * 100) });
      setDone({ out: res.amountOut, sig: res.signature });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Swap failed. Try again.");
    } finally { setBusy(false); }
  };

  if (done) {
    return (
      <div className="card rounded-2xl p-6 text-center">
        <CheckCircle size={40} weight="fill" className="mx-auto text-up" />
        <div className="mt-3 font-display text-lg font-bold text-ink">
          {side === "buy" ? "Bought" : "Sold"} ${m.ticker}
        </div>
        <p className="mt-1 text-sm text-ink-soft">You received ~{fmt(done.out)} {getLabel}.</p>
        <p className="mt-3 break-all rounded-lg bg-panel-2 px-3 py-2 font-mono text-xs text-ink-soft">tx {done.sig}</p>
        <button onClick={() => { setDone(null); setAmount(""); }}
          className="mt-4 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white active:scale-[0.99]">
          Trade again
        </button>
      </div>
    );
  }

  return (
    <div className="card rounded-2xl p-5">
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-panel-2 p-1">
        {(["buy", "sell"] as const).map((s) => (
          <button key={s} onClick={() => setSide(s)}
            className={`rounded-lg py-2 text-sm font-bold capitalize transition ${side === s ? (s === "buy" ? "bg-up text-white" : "bg-down text-white") : "text-ink-soft"}`}>
            {s}
          </button>
        ))}
      </div>

      {/* pay */}
      <div className="mt-4 rounded-xl border border-border bg-panel-2 p-3">
        <div className="flex items-center justify-between text-xs text-ink-soft">
          <span>You pay</span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <input value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
            inputMode="decimal" placeholder="0.00"
            className="w-full bg-transparent font-mono text-xl font-bold text-ink outline-none" />
          <span className="shrink-0 rounded-lg bg-panel px-2.5 py-1 font-mono text-sm font-bold text-ink ring-1 ring-border">{payLabel}</span>
        </div>
      </div>

      <div className="my-1 flex justify-center"><ArrowsDownUp size={16} className="text-ink-faint" /></div>

      {/* receive */}
      <div className="rounded-xl border border-border bg-panel-2 p-3">
        <div className="text-xs text-ink-soft">You receive (estimated)</div>
        <div className="mt-1 flex items-center gap-2">
          <span className="w-full font-mono text-xl font-bold text-ink">{num > 0 ? fmt(estOut) : "0.00"}</span>
          <span className="shrink-0 rounded-lg bg-panel px-2.5 py-1 font-mono text-sm font-bold text-ink ring-1 ring-border">{getLabel}</span>
        </div>
      </div>

      {/* slippage */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-ink-soft">Max slippage</span>
        <div className="flex gap-1">
          {SLIPPAGES.map((s) => (
            <button key={s} onClick={() => setSlip(s)}
              className={`tnum rounded-md px-2 py-1 text-xs font-semibold transition ${slip === s ? "bg-brand text-white" : "border border-border text-ink-soft hover:text-ink"}`}>
              {s}%
            </button>
          ))}
        </div>
      </div>

      {num > 0 && (
        <div className="mt-3 space-y-1 border-t border-border pt-3 text-xs text-ink-soft">
          <div className="flex justify-between"><span>Min. received</span><span className="tnum font-semibold text-ink">{fmt(minOut)} {getLabel}</span></div>
          <div className="flex justify-between"><span>Pool fee</span><span className="tnum">2%</span></div>
        </div>
      )}

      {error && <p className="mt-3 rounded-lg bg-down/10 px-3 py-2 text-sm font-medium text-down">{error}</p>}

      {connected ? (
        <button onClick={onSwap} disabled={num <= 0 || busy}
          className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-base font-bold text-white transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 ${side === "buy" ? "bg-up" : "bg-down"}`}>
          {busy ? <><CircleNotch size={18} weight="bold" className="animate-spin" /> Swapping…</> : `${side === "buy" ? "Buy" : "Sell"} $${m.ticker}`}
        </button>
      ) : (
        <button onClick={() => setVisible(true)}
          className="mt-4 w-full rounded-xl bg-brand py-3.5 text-base font-bold text-white transition hover:bg-[color:var(--accent-strong)] active:scale-[0.99]">
          Connect wallet to trade
        </button>
      )}

      <p className="mt-3 text-center text-xs text-ink-soft">Non-custodial. You sign every trade.</p>
    </div>
  );
}
