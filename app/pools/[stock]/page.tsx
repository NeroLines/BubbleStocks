import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Donut } from "@/components/Donut";
import { CoinImage } from "@/components/CoinImage";
import { CopyButton } from "@/components/CopyButton";
import { ProviderBadge } from "@/components/ProviderBadge";
import { getPool, getPools, SPLIT } from "@/lib/data";
import { compact, pct } from "@/lib/format";
import { ArrowLeft, CaretUp, CaretDown } from "@phosphor-icons/react/dist/ssr";

export default async function PoolPage({ params }: { params: Promise<{ stock: string }> }) {
  const { stock } = await params;
  const pool = await getPool(stock);
  if (!pool) notFound();
  const allPools = await getPools();
  const rows = pool.contributors.map((m) => ({
    meme: m,
    pairing: m.pairings.find((pairing) => pairing.poolAddress === pool.poolAddress),
  }));
  const rewards24h = pool.contributors.reduce((sum, m) => sum + m.rewardPayout24hUsd, 0);
  const memeStockUsd = Math.round(pool.tvlUsd * (SPLIT.meme / 100));
  const stockUsdcUsd = Math.round(pool.tvlUsd * (SPLIT.stock / 100));

  return (
    <main className="min-h-[100dvh] bg-bg">
      <Nav />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Link href="/#pools" className="inline-flex items-center gap-1 text-sm font-semibold text-ink-soft transition hover:text-ink">
          <ArrowLeft size={15} weight="bold" /> Pools
        </Link>

        <div className="liquidity-hero-card card mt-4 overflow-hidden rounded-3xl p-5 sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <Donut size={104} thickness={15} segments={[
                { pct: SPLIT.meme, color: "var(--accent-2)" },
                { pct: SPLIT.stock, color: "var(--accent)" },
              ]}>
                <div className="tnum font-display text-sm font-bold text-ink">{compact(pool.tvlUsd)}</div>
              </Donut>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-2xl font-bold text-ink">{pool.stock}<span className="text-ink-soft">/USDC</span></h1>
                  <ProviderBadge provider={pool.provider} />
                  <CopyButton address={pool.poolAddress} label="Copy example pool address" />
                </div>
                <div className="mt-2 grid gap-1.5 text-sm">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-accent-2" />
                    <span className="text-ink-soft">Meme/Stock pool</span>
                    <span className="tnum ml-auto font-semibold text-ink">{compact(memeStockUsd)}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-brand" />
                    <span className="text-ink-soft">Stock/USDC pool</span>
                    <span className="tnum ml-auto font-semibold text-ink">{compact(stockUsdcUsd)}</span>
                  </span>
                </div>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
              {[
                ["TVL", compact(pool.tvlUsd), false],
                ["Est. APY", `${pool.apy}%`, true],
                ["24h volume", compact(pool.vol24hUsd), false],
                ["24h rewards", compact(rewards24h), false],
              ].map(([label, value, accent]) => (
                <div key={label as string}>
                  <dt className="text-xs text-ink-soft">{label}</dt>
                  <dd className={`tnum mt-1 font-display text-xl font-bold ${accent ? "text-up" : "text-ink"}`}>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <p className="mt-4 border-t border-border pt-3 text-[11px] text-ink-faint">Example on-chain addresses for the StockLana demo.</p>
        </div>

        <div className="mt-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-ink">BubbleStocks in {pool.stock}</h2>
            <p className="mt-1 text-sm text-ink-soft">Meme liquidity and compounded Stock/USDC liquidity shown separately.</p>
          </div>
          <span className="rounded-lg bg-brand/10 px-2.5 py-1 text-sm font-bold text-brand">{rows.length} LPing</span>
        </div>

        <div className="card mt-4 overflow-hidden rounded-2xl">
          <table className="hidden w-full lg:table">
            <thead>
              <tr className="border-b border-border text-left text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
                <th className="px-4 py-3">BubbleStock</th>
                <th className="px-4 py-3 text-right">24h</th>
                <th className="px-4 py-3 text-right">Meme liquidity</th>
                <th className="px-4 py-3 text-right">Compounding</th>
                <th className="px-4 py-3 text-right">This pool</th>
                <th className="px-4 py-3 text-right">LP share</th>
                <th className="px-4 py-3">Pairings</th>
                <th className="px-4 py-3 text-right">APY</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ meme: m, pairing }, i) => (
                <tr key={m.id} className="border-b border-border/70 transition last:border-0 hover:bg-panel-2">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="tnum w-4 text-xs font-bold text-ink-faint">{i + 1}</span>
                      <CoinImage m={m} size={30} />
                      <span>
                        <Link href={`/token/${m.id}`} className="block font-mono text-sm font-bold text-ink hover:text-brand">${m.ticker}</Link>
                        <CopyButton address={m.address} compact label="Copy example BubbleStock mint" />
                      </span>
                    </div>
                  </td>
                  <td className={`tnum px-4 py-3.5 text-right font-semibold ${m.change24h >= 0 ? "text-up" : "text-down"}`}>
                    <span className="inline-flex items-center gap-0.5">{m.change24h >= 0 ? <CaretUp size={11} weight="bold" /> : <CaretDown size={11} weight="bold" />}{pct(m.change24h)}</span>
                  </td>
                  <td className="tnum px-4 py-3.5 text-right font-semibold text-ink">{compact(m.memeLiquidityUsd)}</td>
                  <td className="tnum px-4 py-3.5 text-right text-ink-soft">{compact(m.compoundingLiquidityUsd)}</td>
                  <td className="tnum px-4 py-3.5 text-right text-ink-soft">{compact(pairing?.lpUsd ?? 0)}</td>
                  <td className="tnum px-4 py-3.5 text-right font-bold text-brand">{pairing?.lpSharePct.toFixed(2) ?? "0.00"}%</td>
                  <td className="px-4 py-3.5">
                    <div className="flex max-w-52 flex-wrap gap-1">
                      {m.pairings.map((item) => (
                        <span key={item.poolAddress} className="rounded-md border border-border bg-panel px-1.5 py-1 text-[10px] font-semibold text-ink-soft">{item.stock} · {item.provider}</span>
                      ))}
                    </div>
                  </td>
                  <td className="tnum px-4 py-3.5 text-right font-semibold text-up">{m.apy}%</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="divide-y divide-border lg:hidden">
            {rows.map(({ meme: m, pairing }, i) => (
              <article key={m.id} className="p-4">
                <div className="flex items-center gap-3">
                  <span className="tnum text-xs font-bold text-ink-faint">{i + 1}</span>
                  <CoinImage m={m} size={36} />
                  <Link href={`/token/${m.id}`} className="min-w-0 flex-1">
                    <span className="block truncate font-mono text-sm font-bold text-ink">${m.ticker}</span>
                    <span className="text-xs text-ink-soft">{pairing?.lpSharePct.toFixed(2)}% of this pool</span>
                  </Link>
                  <CopyButton address={m.address} compact label="Copy example BubbleStock mint" />
                </div>
                <dl className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-panel-2 p-3 text-xs">
                  <div><dt className="text-ink-soft">Meme</dt><dd className="tnum mt-1 font-bold text-ink">{compact(m.memeLiquidityUsd)}</dd></div>
                  <div><dt className="text-ink-soft">Compounding</dt><dd className="tnum mt-1 font-bold text-ink">{compact(m.compoundingLiquidityUsd)}</dd></div>
                  <div><dt className="text-ink-soft">This pool</dt><dd className="tnum mt-1 font-bold text-brand">{compact(pairing?.lpUsd ?? 0)}</dd></div>
                </dl>
                <div className="mt-2 flex flex-wrap gap-1">
                  {m.pairings.map((item) => <span key={item.poolAddress} className="rounded-md border border-border px-1.5 py-1 text-[10px] font-semibold text-ink-soft">{item.stock} · {item.provider}</span>)}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-ink-soft">Other pools</h2>
          <div className="flex flex-wrap gap-2">
            {allPools.filter((p) => p.poolAddress !== pool.poolAddress).map((p) => (
              <Link key={p.poolAddress} href={`/pools/${p.stock}`} className="inline-flex items-center gap-2 rounded-lg border border-border bg-panel px-3 py-2 text-sm font-semibold text-ink transition hover:border-[color:var(--border-strong)]">
                <ProviderBadge provider={p.provider} compact />
                <span className="tnum">{p.stock} <span className="text-ink-soft">{compact(p.tvlUsd)}</span></span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
