import Link from "next/link";
import { compact } from "@/lib/format";
import { CoinImage } from "./CoinImage";
import { Sparkline } from "./Sparkline";
import { CaretUp } from "@phosphor-icons/react/dist/ssr";
import type { StockPool } from "@/lib/data";
import { CopyButton } from "./CopyButton";
import { ProviderBadge } from "./ProviderBadge";

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
            <tr key={p.poolAddress} className="group border-b border-border/70 transition last:border-0 hover:bg-panel-2">
              <td className="px-5 py-3.5">
                <div className="flex items-center justify-between gap-4">
                  <Link href={`/pools/${p.stock}`} className="flex min-w-0 items-center gap-3">
                    <span className="flex -space-x-2.5">
                      {p.contributors.slice(0, 3).map((m) => <CoinImage key={m.id} m={m} size={28} />)}
                    </span>
                    <span>
                      <span className="block font-display font-bold text-ink">{p.stock}<span className="text-ink-soft">/USDC</span></span>
                      <span className="mt-0.5 inline-flex rounded-md bg-brand/10 px-1.5 py-0.5 text-[11px] font-bold text-brand">{p.contributors.length} BubbleStocks LPing</span>
                    </span>
                  </Link>
                  <span className="flex shrink-0 items-center gap-1.5">
                    <ProviderBadge provider={p.provider} />
                    <CopyButton address={p.poolAddress} compact label="Copy example pool address" />
                  </span>
                </div>
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
          <div key={p.poolAddress} className="flex items-center gap-2 px-4 py-3.5">
            <Link href={`/pools/${p.stock}`} className="flex min-w-0 flex-1 items-center gap-3">
              <span className="flex -space-x-2.5">
                {p.contributors.slice(0, 3).map((m) => <CoinImage key={m.id} m={m} size={30} />)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5 font-display font-bold text-ink">{p.stock}<span className="text-ink-soft">/USDC</span><ProviderBadge provider={p.provider} compact /></span>
                <span className="mt-0.5 inline-flex rounded-md bg-brand/10 px-1.5 py-0.5 text-[10px] font-bold text-brand">{p.contributors.length} BubbleStocks LPing</span>
              </span>
              <span className="text-right">
                <span className="tnum block font-semibold text-ink">{compact(p.tvlUsd)}</span>
                <span className="tnum block text-xs font-semibold text-up">{p.apy}% APY</span>
              </span>
            </Link>
            <CopyButton address={p.poolAddress} compact label="Copy example pool address" />
          </div>
        ))}
      </div>
    </div>
  );
}
