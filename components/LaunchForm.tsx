"use client";
import { useState } from "react";
import { SUPPORTED_STOCKS, launchMemestock } from "@/lib/data";
import { Logo } from "./Logo";
import { RocketLaunch, ImageSquare, CheckCircle, CircleNotch, GlobeSimple, XLogo, TelegramLogo, Plus, LockSimple, Gift, UserCircle } from "@phosphor-icons/react";

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
  const [imageError, setImageError] = useState<string | null>(null);
  const [launched, setLaunched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sig, setSig] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageError(null);
    if (!["image/png", "image/jpeg", "image/webp"].includes(f.type)) {
      setImageError("Use a PNG, JPG or WebP image.");
      e.target.value = "";
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setImageError("The image must be 5 MB or smaller.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setImg(reader.result);
      else setImageError("We could not read this image.");
    };
    reader.onerror = () => setImageError("We could not read this image.");
    reader.readAsDataURL(f);
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
  const setMainAllocation = (nextMainPct: number) => {
    const targetExtra = 100 - nextMainPct;
    if (targetExtra === 0) { setExtraPools([]); return; }
    let count = Math.max(1, extraPools.length);
    while (count > 1 && targetExtra < count * 10) count--;
    count = Math.min(3, count);
    const used = new Set([stock]);
    const nextPools = Array.from({ length: count }, (_, i) => {
      const current = extraPools[i];
      const nextStock = current?.stock ?? SUPPORTED_STOCKS.find((candidate) => !used.has(candidate)) ?? SUPPORTED_STOCKS[0];
      used.add(nextStock);
      const pct = i === count - 1 ? targetExtra - Math.floor(targetExtra / count) * i : Math.floor(targetExtra / count);
      return { stock: nextStock, pct };
    });
    setExtraPools(nextPools);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await launchMemestock({
        name: name.trim(), ticker, stock, quoteToken,
        imageDataUrl: img ?? undefined,
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
        <div className="creator-success-bubble mx-auto" aria-hidden>
          <span className="css-bubble absolute inset-0" />
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img} alt="" className="absolute inset-[7px] rounded-full object-cover" />
          ) : <span className="absolute inset-0 grid place-items-center"><Logo size={54} withWord={false} /></span>}
        </div>
        <CheckCircle size={48} weight="fill" className="mx-auto text-up" />
        <h2 className="mt-4 font-display text-2xl font-extrabold text-ink">
          ${ticker.toUpperCase()} is live
        </h2>
        <p className="mt-2 text-ink-soft">
          Your BubbleStock is on the bonding curve.
        </p>
        {sig && (
          <p className="mt-3 break-all rounded-xl bg-surface-2 px-3 py-2 font-mono text-xs text-ink-soft">
            tx {sig}
          </p>
        )}
        <button
          onClick={() => { setLaunched(false); setSig(null); setName(""); setTicker(""); setImg(null); setImageError(null); setDesc(""); setDevBuy(""); setWebsite(""); setTwitter(""); setTelegram(""); setExtraPools([]); }}
          className="mt-6 rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white active:scale-[0.98]"
        >
          Launch another BubbleStock
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <section className="glass rounded-3xl p-6 sm:p-8">
          <div className="grid gap-5">
          <Field label="Name" hint="The display name of your BubbleStock">
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
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={onImg} className="hidden" />
            </label>
            {imageError && <p className="mt-2 text-xs font-medium text-down">{imageError}</p>}
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

          </div>
        </section>

        {/* Live preview */}
        <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="mb-3 text-sm font-semibold text-ink-soft">Preview</div>
        <div className="glass rounded-3xl p-5">
          <div className="flex items-center gap-3">
            {img ? (
              <span className="creator-preview-bubble" aria-hidden>
                <span className="css-bubble absolute inset-0" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="absolute inset-[4px] rounded-full object-cover" />
              </span>
            ) : (
              <Logo size={48} withWord={false} />
            )}
            <div className="min-w-0">
              <div className="font-mono font-bold text-ink">${ticker || "TICKER"}</div>
              <div className="truncate text-xs text-ink-soft">
                {name || "Your BubbleStock"} · tracks {stock}
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

      <section className="allocation-flow overflow-hidden rounded-[2rem] border border-white/70 p-4 shadow-[0_24px_70px_rgba(38,111,174,0.16)] sm:p-7" aria-labelledby="allocation-title">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Migration allocation</p>
          <h2 id="allocation-title" className="mt-2 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">Route fees into holder value</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">Choose the main trading pair, then send up to 50% into as many as three Stock/USDC compounding destinations.</p>
        </div>

        <div className="allocation-main-node mx-auto mt-7 max-w-xl rounded-3xl border border-white/80 bg-panel/82 p-5 shadow-[0_18px_45px_rgba(41,104,165,0.15)] backdrop-blur-xl sm:p-6">
          <div className="mx-auto -mt-10 grid h-11 w-11 place-items-center rounded-full border border-white bg-panel text-brand shadow-lg"><Plus size={23} weight="bold" /></div>
          <h3 className="mt-3 text-center font-display text-xl font-bold text-ink">Add Meme / Stock pool</h3>
          <p className="mt-1 text-center text-sm text-ink-soft">Main trading pair · min 50% liquidity</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <select value={stock} onChange={(e) => setStock(e.target.value)} className="bs-input bg-white/65">
              {SUPPORTED_STOCKS.map((s) => <option key={s} value={s}>{s} as stock quote</option>)}
            </select>
            <span className="tnum rounded-xl bg-brand/10 px-3 py-2 text-center text-sm font-bold text-brand">{memeStockPct}%</span>
          </div>
          <input type="range" min={50} max={100} step={5} value={memeStockPct} onChange={(e) => setMainAllocation(+e.target.value)} className="mt-4 w-full accent-[color:var(--accent)]" aria-label="Meme Stock allocation" />
          <div className="mt-2 flex items-center justify-between text-xs text-ink-soft"><span className="inline-flex items-center gap-1"><LockSimple size={13} weight="bold" /> Min 50%</span><span>100% total allocation</span></div>
        </div>

        <div className="flow-stem" aria-hidden />
        <div className="flow-pill mx-auto">MEME / STOCK FEES</div>
        <div className="allocation-branch" aria-hidden />

        <div className="relative z-10 grid gap-3 md:grid-cols-3">
          {[0, 1, 2].map((i) => {
            const pool = extraPools[i];
            if (!pool) return (
              <button key={i} type="button" onClick={addPool} disabled={extraPools.length >= 3 || memeStockPct <= 50}
                className="allocation-pool-node group min-h-40 rounded-2xl border border-dashed border-brand/35 bg-white/55 p-4 text-center backdrop-blur-lg transition hover:-translate-y-1 hover:border-brand disabled:cursor-not-allowed disabled:opacity-45">
                <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-panel text-brand shadow-md"><Plus size={21} weight="bold" /></span>
                <span className="mt-3 block font-display text-lg font-bold text-ink">Add Stock / USDC pool</span>
                <span className="mt-1 block text-xs text-ink-soft">Compounding destination</span>
              </button>
            );
            return (
              <article key={i} className="allocation-pool-node min-h-40 rounded-2xl border border-white/80 bg-panel/82 p-4 shadow-[0_14px_35px_rgba(41,104,165,0.12)] backdrop-blur-xl">
                <div className="flex items-start justify-between gap-2">
                  <div><p className="font-display font-bold text-ink">Stock / USDC pool</p><p className="text-xs text-ink-soft">Compounding destination</p></div>
                  <button type="button" onClick={() => removePool(i)} aria-label="Remove pool" className="rounded-md px-2 py-1 text-xs text-ink-faint hover:bg-down/10 hover:text-down">✕</button>
                </div>
                <select value={pool.stock} onChange={(e) => setPool(i, { stock: e.target.value })} className="bs-input mt-3 bg-white/65 !py-2 text-sm">
                  {SUPPORTED_STOCKS.map((s) => <option key={s} value={s}>{s}/USDC</option>)}
                </select>
                <div className="mt-3 flex items-center gap-2">
                  <input type="range" min={10} max={50} value={pool.pct} onChange={(e) => setPool(i, { pct: +e.target.value })} className="min-w-0 flex-1 accent-[color:var(--accent)]" />
                  <span className="tnum w-11 text-right text-sm font-bold text-brand">{pool.pct}%</span>
                </div>
              </article>
            );
          })}
        </div>

        <div className="flow-stem flow-stem-gold" aria-hidden />
        <div className="flow-pill flow-pill-gold mx-auto">FEE FLOW</div>
        <div className="flow-stem flow-stem-gold" aria-hidden />

        <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-3xl border border-white/80 bg-panel/86 p-5 shadow-[0_18px_45px_rgba(35,98,156,0.16)] backdrop-blur-xl sm:flex-row sm:items-center">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-brand/10 text-brand"><Gift size={29} weight="fill" /></span>
          <div className="min-w-0 flex-1"><h3 className="font-display text-xl font-bold text-ink">Holder rewards</h3><p className="mt-1 text-sm text-ink-soft">Compounded STOCK/USDC fees flow to holders as reflections.</p></div>
          <span className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-2 text-sm font-semibold text-brand"><UserCircle size={18} weight="bold" /> Creator share</span>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-3xl gap-4">
        <p className="rounded-xl bg-panel-2 px-4 py-3 text-center text-xs leading-relaxed text-ink-soft">Fair launch on a single-segment curve · 1B supply · migrates at $138K market cap · 2.16% trade fee (1% protocol, 0.8% creator, 0.36% Meteora).</p>
        {error && <p className="rounded-xl bg-down/10 px-4 py-2.5 text-sm font-medium text-down">{error}</p>}
        <button type="submit" disabled={!valid || submitting} className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-4 text-base font-bold text-white shadow-[0_14px_34px_rgba(47,107,246,0.25)] transition hover:-translate-y-0.5 hover:bg-[color:var(--accent-strong)] active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40">
          {submitting ? <><CircleNotch size={20} weight="bold" className="animate-spin" /> Launching…</> : <><RocketLaunch size={20} weight="fill" /> Launch a BubbleStock</>}
        </button>
      </div>
    </form>
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
