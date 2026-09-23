import Link from "next/link";
import { compact } from "@/lib/format";
import { CoinImage } from "./CoinImage";
import { Sparkline } from "./Sparkline";
import { CaretUp } from "@phosphor-icons/react/dist/ssr";
import type { StockPool } from "@/lib/data";

// The core launchpad surface: a precise, scannable table of STOCK/USDC pools.
// Desktop = real table; mobile = stacked cards (same data, no horizontal scroll).
export function PoolsTable({ pools }: { pools: StockPool[] }) {
  const sorted = [...pools].sort((a, b) => b.tvlUsd - a.tvlUsd);
  return (
    <div className="card overflow-hidden rounded-2xl">
      {/* desktop table */}
      <table className="hidden w-full md:table">
        <thead>
          <tr className="border-b border-border text-left text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
            <th className="px-5 py-3 font-semibold">Pool</th>
            <th className="px-5 py-3 text-right font-semibold">TVL</th>
            <th className="px-5 py-3 text-right font-semibold">24h volume</th>
            <th className="px-5 py-3 text-right font-semibold">24h fees</th>
            <th className="px-5 py-3 text-right font-semibold">APY</th>
            <th className="px-5 py-3 text-right font-semibold">Trend</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((p) => (
            <tr key={p.stock} className="group border-b border-border/70 transition last:border-0 hover:bg-panel-2">
              <td className="px-5 py-3.5">
                <Link href={`/pools/${p.stock}`} className="flex items-center gap-3">
                  <span className="flex -space-x-2.5">
                    {p.contributors.slice(0, 3).map((m) => <CoinImage key={m.id} m={m} size={28} />)}
                  </span>
                  <span>
                    <span className="block font-display font-bold text-ink">{p.stock}<span className="text-ink-soft">/USDC</span></span>
                    <span className="block text-xs text-ink-soft">{p.contributors.length} memes LPing</span>
                  </span>
                </Link>
              </td>
              <td className="tnum px-5 py-3.5 text-right font-semibold text-ink">{compact(p.tvlUsd)}</td>
              <td className="tnum px-5 py-3.5 text-right text-ink-soft">{compact(p.vol24hUsd)}</td>
              <td className="tnum px-5 py-3.5 text-right text-ink-soft">{compact(p.fees24hUsd)}</td>
              <td className="tnum px-5 py-3.5 text-right font-semibold text-up">
                <span className="inline-flex items-center gap-0.5"><CaretUp size={11} weight="bold" />{p.apy}%</span>
              </td>
              <td className="px-5 py-3.5">
                <div className="ml-auto w-24"><Sparkline points={p.contributors[0].spark} up w={96} h={28} /></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* mobile cards */}
      <div className="divide-y divide-border md:hidden">
        {sorted.map((p) => (
          <Link key={p.stock} href={`/pools/${p.stock}`} className="flex items-center gap-3 px-4 py-3.5">
            <span className="flex -space-x-2.5">
              {p.contributors.slice(0, 3).map((m) => <CoinImage key={m.id} m={m} size={30} />)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display font-bold text-ink">{p.stock}<span className="text-ink-soft">/USDC</span></span>
              <span className="tnum block text-xs text-ink-soft">{compact(p.vol24hUsd)} vol · {p.contributors.length} memes</span>
            </span>
            <span className="text-right">
              <span className="tnum block font-semibold text-ink">{compact(p.tvlUsd)}</span>
              <span className="tnum block text-xs font-semibold text-up">{p.apy}% APY</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
