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
// a sky gradient. Meme coins orbit each pool; fee-flow lines stream to the
// deepest pool. Deterministic sim (fixed init) → no hydration drift, no WebGL.
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
  const hero = nodes.find((n) => n.hero)!;

  return (
    <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
      {/* drifting brand bubbles as the map's own background (no solid panel) */}
      <FloatingBubbles className="opacity-90" />
      <div className="pointer-events-none absolute left-4 top-3 z-20 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#1a56c4" }} />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#1a4a9e" }}>Liquidity map</span>
      </div>

      {/* fee-flow lines toward the deepest pool */}
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {nodes.filter((n) => !n.hero).map((n) => (
          <line key={n.p.stock} x1={r2(n.x)} y1={r2(n.y)} x2={r2(hero.x)} y2={r2(hero.y)}
            className="flow-line" stroke="rgba(255,255,255,0.7)" strokeWidth={2} strokeLinecap="round" />
        ))}
      </svg>

      {nodes.map((n, i) => {
        const d = (n.r * 2 / W) * 100;      // diameter, % of width
        const dim = hover && hover !== n.p;
        const coins = n.p.contributors.slice(0, 3);
        const orbitDur = 20 + (i % 4) * 5;
        return (
          <Link
            key={n.p.stock}
            href={`/pools/${n.p.stock}`}
            onMouseEnter={() => setHover(n.p)}
            onMouseLeave={() => setHover(null)}
            className="bubble-float absolute -translate-x-1/2 -translate-y-1/2 transition-opacity"
            style={{
              left: `${r2((n.x / W) * 100)}%`, top: `${r2((n.y / H) * 100)}%`,
              width: `${r2(d)}%`, aspectRatio: "1",
              animationDuration: `${5 + (i % 3)}s`, animationDelay: `${-i * 0.6}s`,
              opacity: dim ? 0.5 : 1, zIndex: n.hero ? 10 : 5,
            }}
          >
            <span className="css-bubble absolute inset-0" />

            {/* orbiting meme coins */}
            <span className="orbit-ring pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ width: "148%", height: "148%", animationDuration: `${orbitDur}s` }}>
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

            {/* label */}
            <span className="pointer-events-none absolute inset-0 z-10 grid place-items-center text-center leading-tight"
              style={{ color: "#0a2a5e", textShadow: "0 1px 2px rgba(255,255,255,0.9), 0 0 10px rgba(255,255,255,0.85)" }}>
              <span>
                <span className="block font-display font-bold" style={{ fontSize: n.hero ? "0.92rem" : "0.72rem" }}>
                  {n.p.stock}<span className="opacity-70">/USDC</span>
                </span>
                <span className="tnum block font-display font-extrabold" style={{ fontSize: n.hero ? "1.55rem" : "1.05rem" }}>
                  {compact(n.p.tvlUsd)}
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-wider" style={{ color: "#1a56c4" }}>{n.p.apy}% APY</span>
              </span>
            </span>
          </Link>
        );
      })}

      {/* detail card */}
      <div className={`pointer-events-none absolute right-3 top-3 z-20 w-60 transition-opacity duration-150 ${hover ? "opacity-100" : "opacity-0"}`}>
        {hover && (
          <div className="card rounded-2xl p-4">
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
                  <span className="tnum ml-auto text-xs font-semibold text-ink-soft">{compact(m.liquidityUsd)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className={`pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-medium transition-opacity ${hover ? "opacity-0" : "opacity-100"}`}
        style={{ color: "#2a5aa8" }}>
        Hover a bubble to see its memes
      </div>
    </div>
  );
}
