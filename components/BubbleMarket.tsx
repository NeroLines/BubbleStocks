"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { forceSimulation, forceCollide, forceManyBody, forceX, forceY } from "d3-force";
import { compact } from "@/lib/format";
import { CoinImage } from "@/components/CoinImage";
import { FloatingBubbles } from "@/components/FloatingBubbles";
import type { StockPool } from "@/lib/data";

// Bubble Market: d3-force computes a clean, non-overlapping packed layout (no
// hand-placed positions), rendered as CSS soap bubbles (crisp at any size) over
// a sky gradient. BubbleStocks orbit and feed their own destination pool.
// Deterministic sim (fixed init) → no hydration drift, no WebGL.
const W = 1000, H = 640;
const r2 = (n: number) => Math.round(n * 100) / 100;

type Node = { p: StockPool; r: number; x: number; y: number; hero: boolean };

function layout(pools: StockPool[]): Node[] {
  const max = Math.max(...pools.map((p) => p.tvlUsd));
  const hero = pools.reduce((a, b) => (b.tvlUsd > a.tvlUsd ? b : a));
  const nodes: Node[] = pools.map((p, i) => ({
    p, r: 44 + 76 * Math.sqrt(p.tvlUsd / max), hero: p === hero,
    x: W / 2 + Math.cos((i / pools.length) * Math.PI * 2) * 150,
    y: H / 2 + Math.sin((i / pools.length) * Math.PI * 2) * 110,
  }));
  const sim = forceSimulation(nodes as never)
    .force("collide", forceCollide<Node>((d) => d.r + 30).strength(1).iterations(4))
    .force("charge", forceManyBody().strength(-38))
    .force("x", forceX(W / 2).strength(0.055))
    .force("y", forceY(H / 2).strength(0.08))
    .stop();
  for (let i = 0; i < 320; i++) sim.tick();
  // keep every bubble fully inside the panel (incl. room for orbiting coins)
  nodes.forEach((n) => {
    const m = n.r + n.r * 0.28 + 6;
    n.x = Math.max(m, Math.min(W - m, n.x));
    n.y = Math.max(m, Math.min(H - m, n.y));
  });
  return nodes;
}

export function BubbleMarket({ pools }: { pools: StockPool[] }) {
  const [hover, setHover] = useState<StockPool | null>(null);
  const nodes = useMemo(() => layout(pools), [pools]);
  return (
    <div className="market-stage relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
      {/* drifting brand bubbles as the map's own background (no solid panel) */}
      <FloatingBubbles className="opacity-40" />
      <div className="pointer-events-none absolute left-5 top-4 z-20 flex items-center gap-2.5">
        <span className="relative flex h-2 w-2">
          <span className="market-live-pulse absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-2 opacity-40" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-2" />
        </span>
        <span className="market-kicker text-[11px] font-bold uppercase tracking-[0.16em]">Live liquidity map</span>
      </div>

      {nodes.map((n, i) => {
        const d = (n.r * 2 / W) * 100;      // diameter, % of width
        const dim = hover && hover !== n.p;
        const coins = n.p.contributors.slice(0, 3);
        const orbitDur = 20 + (i % 4) * 5;
        return (
          <Link
            key={n.p.poolAddress}
            href={`/pools/${n.p.stock}`}
            onMouseEnter={() => setHover(n.p)}
            onMouseLeave={() => setHover(null)}
            className="market-bubble-node absolute -translate-x-1/2 -translate-y-1/2 outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
            style={{
              left: `${r2((n.x / W) * 100)}%`, top: `${r2((n.y / H) * 100)}%`,
              width: `${r2(d)}%`, aspectRatio: "1",
              opacity: dim ? 0.5 : 1, zIndex: n.hero ? 10 : 5,
            }}
          >
            <span className="bubble-float absolute inset-0" style={{ animationDuration: `${5 + (i % 3)}s`, animationDelay: `${-i * 0.6}s` }}>
            <span className="css-bubble absolute inset-0" />
            {n.hero && <span className="pool-split-ring" aria-hidden />}

            {/* orbiting meme coins */}
            <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: "148%", height: "148%" }}>
            <span className="orbit-ring absolute inset-0" style={{ animationDuration: `${orbitDur}s` }}>
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
                {coins.map((m, j) => {
                  const a = (j / coins.length) * Math.PI * 2 - Math.PI / 2;
                  return <line key={m.id} x1={50 + Math.cos(a) * 50} y1={50 + Math.sin(a) * 50} x2="50" y2="50" className="flow-line market-flow" strokeWidth="0.75" strokeLinecap="round" />;
                })}
              </svg>
              {coins.map((m, j) => {
                const a = (j / coins.length) * Math.PI * 2 - Math.PI / 2;
                return (
                  <span key={m.id} className="absolute" style={{ left: `${50 + Math.cos(a) * 50}%`, top: `${50 + Math.sin(a) * 50}%`, transform: "translate(-50%,-50%)" }}>
                    <span className="orbit-coin block" style={{ animationDuration: `${orbitDur}s` }}>
                      <CoinImage m={m} size={n.hero ? 30 : 24} />
                    </span>
                  </span>
                );
              })}
            </span>
            </span>

            {/* label */}
            <span className="market-label pointer-events-none absolute inset-0 z-10 grid place-items-center text-center leading-tight">
              <span>
                <span className="block font-display font-bold" style={{ fontSize: n.hero ? "0.92rem" : "0.72rem" }}>
                  {n.p.stock}<span className="opacity-70">/USDC</span>
                </span>
                <span className="tnum block font-display font-extrabold" style={{ fontSize: n.hero ? "1.55rem" : "1.05rem" }}>
                  {compact(n.p.tvlUsd)}
                </span>
                <span className="market-kicker block text-[10px] font-bold uppercase tracking-wider">{n.p.apy}% APY</span>
              </span>
            </span>
            </span>
          </Link>
        );
      })}

      {/* detail card */}
      <div className={`pointer-events-none absolute right-3 top-3 z-20 w-60 transition-opacity duration-150 ${hover ? "opacity-100" : "opacity-0"}`}>
        {hover && (
          <div className="market-detail card rounded-2xl p-4 shadow-[var(--shadow-lg)]">
            <div className="flex items-baseline justify-between">
              <span className="font-display text-base font-bold text-ink">{hover.stock}<span className="text-ink-soft">/USDC</span></span>
              <span className="tnum rounded-full bg-up/10 px-2 py-0.5 text-sm font-bold text-up">{hover.apy}% APY</span>
            </div>
            <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
              {[["TVL", compact(hover.tvlUsd)], ["24h vol", compact(hover.vol24hUsd)], ["24h fees", compact(hover.fees24hUsd)]].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-panel-2 py-2">
                  <div className="tnum text-sm font-bold text-ink">{v}</div>
                  <div className="text-[10px] uppercase tracking-wide text-ink-soft">{k}</div>
                </div>
              ))}
            </dl>
            <ul className="mt-3 grid gap-1.5">
              {hover.contributors.slice(0, 3).map((m) => (
                <li key={m.id} className="flex items-center gap-2">
                  <CoinImage m={m} size={22} />
                  <span className="font-mono text-xs font-bold text-ink">${m.ticker}</span>
                  <span className="tnum ml-auto text-xs font-semibold text-ink-soft">
                    {compact(m.pairings.find((pairing) => pairing.poolAddress === hover.poolAddress)?.lpUsd ?? 0)} LP
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className={`market-hint market-kicker pointer-events-none absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full border px-3 py-1 text-[11px] font-semibold shadow-sm backdrop-blur-md transition-opacity ${hover ? "opacity-0" : "opacity-100"}`}>
        Hover to inspect a pool
      </div>
    </div>
  );
}
