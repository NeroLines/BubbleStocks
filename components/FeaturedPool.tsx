"use client";
import { useState } from "react";
import Link from "next/link";
import { Donut } from "./Donut";
import { CoinImage } from "./CoinImage";
import { compact } from "@/lib/format";
import { type StockPool } from "@/lib/data";
import { poolLiquidityBreakdown } from "@/lib/liquidity";
import { CaretLeft, CaretRight, ArrowRight } from "@phosphor-icons/react";

// The partner's hero element, done professionally: one featured STOCK/USDC pool
// with its routed liquidity and top memes, swipeable across pools. Tapping opens the
// full pool page — so it doubles as an obvious entry point into the market.
export function FeaturedPool({ pools }: { pools: StockPool[] }) {
  const [i, setI] = useState(0);
  const p = pools[i];
  const go = (d: number) => setI((v) => (v + d + pools.length) % pools.length);
  const liquidity = poolLiquidityBreakdown(p);

  return (
    <div className="card rounded-2xl p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Featured pool</span>
        <span className="flex items-center gap-1">
          <button onClick={() => go(-1)} aria-label="Previous pool" className="grid h-7 w-7 place-items-center rounded-full border border-border text-ink-soft transition hover:text-ink"><CaretLeft size={14} weight="bold" /></button>
          <button onClick={() => go(1)} aria-label="Next pool" className="grid h-7 w-7 place-items-center rounded-full border border-border text-ink-soft transition hover:text-ink"><CaretRight size={14} weight="bold" /></button>
        </span>
      </div>

      <Link href={`/pools/${p.stock}`} className="block">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display text-xl font-bold text-ink">{p.stock}<span className="text-ink-soft">/USDC</span></span>
            <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand">Featured</span>
          </div>
          <span className="flex -space-x-2.5">
            {p.contributors.slice(0, 3).map((m) => <CoinImage key={m.id} m={m} size={30} />)}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <Donut size={92} thickness={13}
            segments={[{ pct: liquidity.memePct, color: "var(--accent-2)" }, { pct: liquidity.compoundingPct, color: "var(--accent)" }]}>
            <div className="tnum font-display text-sm font-bold text-ink">{compact(liquidity.routedLiquidityUsd)}</div>
          </Donut>
          <div className="grid flex-1 gap-1.5 text-sm">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: "var(--accent-2)" }} />
              <span className="text-ink-soft">Meme/Stock</span>
              <span className="tnum ml-auto font-semibold text-ink">{compact(liquidity.memeLiquidityUsd)}</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: "var(--accent)" }} />
              <span className="text-ink-soft">Stock/USDC</span>
              <span className="tnum ml-auto font-semibold text-ink">{compact(liquidity.compoundingLiquidityUsd)}</span>
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-border pt-3">
          <div>
            <div className="text-xs text-ink-soft">TVL</div>
            <div className="tnum font-display text-lg font-bold text-ink">{compact(p.tvlUsd)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-ink-soft">Est. APY</div>
            <div className="tnum font-display text-lg font-bold text-up">{p.apy}%</div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white">
            View pool <ArrowRight size={14} weight="bold" />
          </span>
        </div>
      </Link>

      {/* pool dots */}
      <div className="mt-4 flex justify-center gap-1.5">
        {pools.map((pp, idx) => (
          <button key={pp.stock} onClick={() => setI(idx)} aria-label={`Show ${pp.stock}`}
            className={`h-1.5 rounded-full transition-all ${idx === i ? "w-4 bg-brand" : "w-1.5 bg-border"}`} />
        ))}
      </div>
    </div>
  );
}
