import Link from "next/link";
import { CoinImage } from "./CoinImage";
import { compact } from "@/lib/format";
import type { Memestock } from "@/lib/data";

const RANK_STYLE = [
  "bg-[#e8ae45] text-white",
  "bg-[#9aa9bc] text-white",
  "bg-[#bd8062] text-white",
] as const;

export function MobileLiquidityBoard({ memes }: { memes: Memestock[] }) {
  return (
    <section className="mt-4 md:hidden" aria-labelledby="mobile-liquidity-title">
      <div className="mb-2 flex items-end justify-between px-1">
        <div>
          <h2 id="mobile-liquidity-title" className="font-display text-lg font-bold tracking-tight text-ink">
            Top BubbleStock liquidity
          </h2>
          <p className="text-xs text-ink-soft">Leading contributors across all pools</p>
        </div>
        <Link href="/explore" className="text-xs font-semibold text-brand">View all</Link>
      </div>
      <div className="card overflow-hidden rounded-2xl bg-panel/80 backdrop-blur-xl">
        {memes.map((m, i) => (
          <Link key={m.id} href={`/token/${m.id}`} className="flex items-center gap-3 border-b border-border/75 px-3 py-3 last:border-0 active:bg-panel-2">
            <span className={`tnum grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold shadow-sm ${RANK_STYLE[i]}`}>
              {i + 1}
            </span>
            <CoinImage m={m} size={36} />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-mono text-sm font-bold text-ink">${m.ticker}</span>
              <span className="block text-xs text-ink-soft">{m.stock} · {m.holders.toLocaleString()} holders</span>
            </span>
            <span className="shrink-0 text-right">
              <span className="tnum block text-sm font-semibold text-ink">{compact(m.liquidityUsd)}</span>
              <span className="tnum block text-xs font-semibold text-up">{m.apy}% APY</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
