"use client";
import { useState } from "react";
import { SUPPORTED_STOCKS, launchMemestock } from "@/lib/data";
import { Logo } from "./Logo";
import { RocketLaunch, ImageSquare, CheckCircle, CircleNotch, GlobeSimple, XLogo, TelegramLogo } from "@phosphor-icons/react";

// Launch configuration form. Fields follow the partner spec: name, ticker,
// picture, quote token, dev buy, socials + the underlying stock. Submit runs
// through the connector seam (launchMemestock); the on-chain DBC create-pool tx
// swaps in there without touching this form.
const QUOTE_TOKENS = ["USDC", "SOL"];

export function LaunchForm() {
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [stock, setStock] = useState(SUPPORTED_STOCKS[0]);
  const [quoteToken, setQuoteToken] = useState(QUOTE_TOKENS[0]);
  const [devBuy, setDevBuy] = useState("");
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [telegram, setTelegram] = useState("");
  const [desc, setDesc] = useState("");
  // Migration allocation: extra STOCK/USDC pools (up to 3); meme/stock keeps the rest (>=50%).
  const [extraPools, setExtraPools] = useState<{ stock: string; pct: number }[]>([]);
  const [img, setImg] = useState<string | null>(null);
  const [launched, setLaunched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sig, setSig] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setImg(URL.createObjectURL(f));
  };

  const extraTotal = extraPools.reduce((s, p) => s + p.pct, 0);
  const memeStockPct = 100 - extraTotal;
  const allocValid = memeStockPct >= 50 && extraPools.every((p) => p.pct >= 10 && p.pct <= 50 && p.stock);
  const valid = name.trim() && ticker.trim().length >= 2 && allocValid;

  const addPool = () => {
    if (extraPools.length >= 3 || memeStockPct <= 50) return;
    const used = new Set([stock, ...extraPools.map((p) => p.stock)]);
    const next = SUPPORTED_STOCKS.find((s) => !used.has(s)) ?? SUPPORTED_STOCKS[0];
    setExtraPools([...extraPools, { stock: next, pct: Math.min(25, memeStockPct - 50 || 10) }]);
  };
  const setPool = (i: number, patch: Partial<{ stock: string; pct: number }>) =>
    setExtraPools(extraPools.map((p, j) => (j === i ? { ...p, ...patch } : p)));
  const removePool = (i: number) => setExtraPools(extraPools.filter((_, j) => j !== i));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await launchMemestock({
        name: name.trim(), ticker, stock, quoteToken,
        imageUrl: img ?? undefined,
        description: desc.trim() || undefined,
        devBuySol: parseFloat(devBuy) || undefined,
        website: website.trim() || undefined,
        twitter: twitter.trim() || undefined,
        telegram: telegram.trim() || undefined,
        allocation: { memeStockPct, pools: extraPools },
      });
      setSig(res.signature);
      setLaunched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Launch failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (launched) {
    return (
      <div className="glass mx-auto max-w-lg rounded-3xl p-10 text-center">
        <CheckCircle size={48} weight="fill" className="mx-auto text-up" />
        <h2 className="mt-4 font-display text-2xl font-extrabold text-ink">
          ${ticker.toUpperCase()} is live
        </h2>
        <p className="mt-2 text-ink-soft">
          Your memestock is on the bonding curve.
        </p>
        {sig && (
          <p className="mt-3 break-all rounded-xl bg-surface-2 px-3 py-2 font-mono text-xs text-ink-soft">
            tx {sig}
          </p>
        )}
        <button
          onClick={() => { setLaunched(false); setSig(null); setName(""); setTicker(""); setImg(null); setDesc(""); setDevBuy(""); setWebsite(""); setTwitter(""); setTelegram(""); setExtraPools([]); }}
          className="mt-6 rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white active:scale-[0.98]"
        >
          Launch another
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      {/* Form */}
      <form onSubmit={onSubmit} className="glass rounded-3xl p-6 sm:p-8">
        <div className="grid gap-5">
          <Field label="Name" hint="The display name of your memestock">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tesla Cat"
              className="bs-input"
            />
          </Field>

          <Field label="Ticker" hint="2–10 letters, shown as $TICKER">
            <input
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 10))}
              placeholder="TSCATLA"
              className="bs-input font-mono"
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Underlying stock" hint="The real ticker it's paired with">
              <select value={stock} onChange={(e) => setStock(e.target.value)} className="bs-input">
                {SUPPORTED_STOCKS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Quote token" hint="The pool's quote currency">
              <select value={quoteToken} onChange={(e) => setQuoteToken(e.target.value)} className="bs-input">
                {QUOTE_TOKENS.map((q) => <option key={q} value={q}>{q}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Image" hint="PNG or JPG, square works best">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[color:var(--border-strong)] bg-panel-2 px-4 py-3 text-sm text-ink-soft hover:border-brand">
              <ImageSquare size={20} className="text-brand" />
              {img ? "Change image" : "Upload image"}
              <input type="file" accept="image/*" onChange={onImg} className="hidden" />
            </label>
          </Field>

          <Field label="Dev buy" hint="Optional. Your first buy at launch, in SOL.">
            <div className="relative">
              <input
                value={devBuy}
                onChange={(e) => setDevBuy(e.target.value.replace(/[^0-9.]/g, ""))}
                inputMode="decimal" placeholder="0.00"
                className="bs-input pr-14 font-mono"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-ink-soft">SOL</span>
            </div>
          </Field>

          <div className="grid gap-3">
            <span className="text-sm font-semibold text-ink">Socials <span className="font-normal text-ink-soft">· optional</span></span>
            <div className="relative">
              <GlobeSimple size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
              <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Website" className="bs-input !pl-9" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="relative">
                <XLogo size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
                <input value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="X / Twitter" className="bs-input !pl-9" />
              </div>
              <div className="relative">
                <TelegramLogo size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
                <input value={telegram} onChange={(e) => setTelegram(e.target.value)} placeholder="Telegram" className="bs-input !pl-9" />
              </div>
            </div>
          </div>

          <Field label="Description" hint="Optional. What's the story?">
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              placeholder="The fastest cat on the curve."
              className="bs-input resize-none"
            />
          </Field>

          {/* ── Migration allocation (partner spec) ─────────────────────── */}
          <div className="rounded-xl border border-border bg-panel-2 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-ink">Liquidity allocation</span>
              <button type="button" onClick={addPool} disabled={extraPools.length >= 3 || memeStockPct <= 50}
                className="rounded-md border border-border bg-panel px-2.5 py-1 text-xs font-semibold text-ink transition hover:border-[color:var(--border-strong)] disabled:opacity-40">
                + Add stock pool
              </button>
            </div>
            <p className="mt-1 text-xs text-ink-soft">On migration, meme/stock keeps at least 50%. Route the rest to up to 3 STOCK/USDC pools.</p>

            {/* stacked bar */}
            <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-panel">
              <div className="h-full" style={{ width: `${memeStockPct}%`, background: "var(--accent-2)" }} />
              {extraPools.map((p, i) => (
                <div key={i} className="h-full border-l border-[color:var(--bg)]" style={{ width: `${p.pct}%`, background: "var(--accent)" }} />
              ))}
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--accent-2)" }} />
                <span className="text-ink">Meme/Stock pool</span>
                <span className="tnum ml-auto font-semibold text-ink">{memeStockPct}%</span>
              </div>
              {extraPools.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: "var(--accent)" }} />
                  <select value={p.stock} onChange={(e) => setPool(i, { stock: e.target.value })}
                    className="rounded-md border border-border bg-panel px-2 py-1 text-sm font-semibold text-ink">
                    {SUPPORTED_STOCKS.map((s) => <option key={s} value={s}>{s}/USDC</option>)}
                  </select>
                  <input type="range" min={10} max={50} value={p.pct} onChange={(e) => setPool(i, { pct: +e.target.value })}
                    className="flex-1 accent-[color:var(--accent)]" />
                  <span className="tnum w-9 text-right text-sm font-semibold text-ink">{p.pct}%</span>
                  <button type="button" onClick={() => removePool(i)} aria-label="Remove pool" className="text-ink-faint hover:text-down">✕</button>
                </div>
              ))}
            </div>
          </div>

          <p className="rounded-lg bg-panel-2 px-3 py-2.5 text-xs text-ink-soft">
            Fair launch on a single-segment curve · 1B supply · migrates at $138K market cap ·
            2.16% trade fee (1% protocol, 0.8% creator, 0.36% Meteora).
          </p>

          {error && (
            <p className="rounded-xl bg-down/10 px-4 py-2.5 text-sm font-medium text-down">{error}</p>
          )}
          <button
            type="submit"
            disabled={!valid || submitting}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-base font-bold text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? (
              <><CircleNotch size={20} weight="bold" className="animate-spin" /> Launching…</>
            ) : (
              <><RocketLaunch size={20} weight="fill" /> Launch on the curve</>
            )}
          </button>
        </div>
      </form>

      {/* Live preview */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="mb-3 text-sm font-semibold text-ink-soft">Preview</div>
        <div className="glass rounded-3xl p-5">
          <div className="flex items-center gap-3">
            {img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img} alt="" className="h-12 w-12 rounded-full object-cover" />
            ) : (
              <Logo size={48} withWord={false} />
            )}
            <div className="min-w-0">
              <div className="font-mono font-bold text-ink">${ticker || "TICKER"}</div>
              <div className="truncate text-xs text-ink-soft">
                {name || "Your memestock"} · tracks {stock}
              </div>
            </div>
          </div>
          <div className="mt-4 rounded-2xl bg-surface-2 p-4">
            <div className="flex justify-between text-xs text-ink-soft">
              <span>Bonding progress</span><span>0%</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-line">
              <div className="h-full w-0 rounded-full bg-brand" />
            </div>
          </div>
          {desc && <p className="mt-4 text-sm text-ink-soft">{desc}</p>}
        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-ink">{label}</span>
      {children}
      {hint && <span className="text-xs text-ink-soft">{hint}</span>}
    </label>
  );
}
