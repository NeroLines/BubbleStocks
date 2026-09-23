import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Donut } from "@/components/Donut";
import { CoinImage } from "@/components/CoinImage";
import { Sparkline } from "@/components/Sparkline";
import { getPool, getPools, SPLIT } from "@/lib/data";
import { compact, usd, pct } from "@/lib/format";
import { ArrowLeft, CaretUp, CaretDown } from "@phosphor-icons/react/dist/ssr";

export default async function PoolPage({ params }: { params: Promise<{ stock: string }> }) {
  const { stock } = await params;
  const pool = await getPool(stock);
  if (!pool) notFound();
  const [allPools] = await Promise.all([getPools()]);
  const memes = pool.contributors;
  const rewards24h = memes.reduce((s, m) => s + m.rewardPayout24hUsd, 0);
  const memeStockUsd = Math.round(pool.tvlUsd * (SPLIT.meme / 100));
  const stockUsdcUsd = Math.round(pool.tvlUsd * (SPLIT.stock / 100));

  return (
    <main className="min-h-[100dvh] bg-bg">
      <Nav />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Link href="/#markets" className="inline-flex items-center gap-1 text-sm font-semibold text-ink-soft transition hover:text-ink">
          <ArrowLeft size={15} weight="bold" /> Markets
        </Link>

        {/* ── Pool header ──────────────────────────────────────────────── */}
        <div className="card mt-4 rounded-2xl p-5 sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <Donut
                size={104} thickness={15}
                segments={[
                  { pct: SPLIT.meme, color: "var(--accent-2)" },
                  { pct: SPLIT.stock, color: "var(--accent)" },
                ]}
              >
                <div className="tnum font-display text-sm font-bold text-ink">{compact(pool.tvlUsd)}</div>
              </Donut>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-2xl font-bold text-ink">{pool.stock}<span className="text-ink-soft">/USDC</span></h1>
                  <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-brand">Featured</span>
                </div>
                <div className="mt-2 grid gap-1.5 text-sm">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: "var(--accent-2)" }} />
                    <span className="text-ink-soft">Meme/Stock pool</span>
                    <span className="tnum ml-auto font-semibold text-ink">{compact(memeStockUsd)}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: "var(--accent)" }} />
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
        </div>

        {/* ── Strongest memes for this stock ───────────────────────────── */}
        <div className="mt-8 flex items-end justify-between gap-4">
          <h2 className="font-display text-xl font-bold text-ink">Top memes · {pool.stock}</h2>
          <span className="text-sm text-ink-soft">{memes.length} LPing this pool</span>
        </div>

        <div className="card mt-4 overflow-hidden rounded-2xl">
          {/* desktop table */}
          <table className="hidden w-full md:table">
            <thead>
              <tr className="border-b border-border text-left text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
                <th className="px-5 py-3">Meme</th>
                <th className="px-5 py-3 text-right">Price</th>
                <th className="px-5 py-3 text-right">24h</th>
                <th className="px-5 py-3 text-right">Market cap</th>
                <th className="px-5 py-3 text-right">24h reward</th>
                <th className="px-5 py-3 text-right">Liquidity</th>
                <th className="px-5 py-3 text-right">APY</th>
                <th className="px-5 py-3 text-right">Trend</th>
              </tr>
            </thead>
            <tbody>
              {memes.map((m, i) => (
                <tr key={m.id} className="border-b border-border/70 transition last:border-0 hover:bg-panel-2">
                  <td className="px-5 py-3.5">
                    <Link href={`/token/${m.id}`} className="flex items-center gap-3">
                      <span className="tnum w-4 text-xs font-bold text-ink-faint">{i + 1}</span>
                      <CoinImage m={m} size={30} />
                      <span className="font-mono text-sm font-bold text-ink">${m.ticker}</span>
                    </Link>
                  </td>
                  <td className="tnum px-5 py-3.5 text-right text-ink">{usd(m.priceUsd)}</td>
                  <td className={`tnum px-5 py-3.5 text-right font-semibold ${m.change24h >= 0 ? "text-up" : "text-down"}`}>
                    <span className="inline-flex items-center gap-0.5">{m.change24h >= 0 ? <CaretUp size={11} weight="bold" /> : <CaretDown size={11} weight="bold" />}{pct(m.change24h)}</span>
                  </td>
                  <td className="tnum px-5 py-3.5 text-right text-ink-soft">{compact(m.mcapUsd)}</td>
                  <td className="tnum px-5 py-3.5 text-right font-semibold text-up">{compact(m.rewardPayout24hUsd)}</td>
                  <td className="tnum px-5 py-3.5 text-right text-ink-soft">{compact(m.liquidityUsd)}</td>
                  <td className="tnum px-5 py-3.5 text-right font-semibold text-up">{m.apy}%</td>
                  <td className="px-5 py-3.5"><div className="ml-auto w-20"><Sparkline points={m.spark} up={m.change24h >= 0} w={80} h={26} /></div></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* mobile list */}
          <div className="divide-y divide-border md:hidden">
            {memes.map((m, i) => (
              <Link key={m.id} href={`/token/${m.id}`} className="flex items-center gap-3 px-4 py-3.5">
                <span className="tnum w-3 text-xs font-bold text-ink-faint">{i + 1}</span>
                <CoinImage m={m} size={34} />
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-sm font-bold text-ink">${m.ticker}</span>
                  <span className="tnum block text-xs text-ink-soft">MC {compact(m.mcapUsd)} · reward {compact(m.rewardPayout24hUsd)}</span>
                </span>
                <span className="text-right">
                  <span className="tnum block font-semibold text-ink">{usd(m.priceUsd)}</span>
                  <span className={`tnum block text-xs font-semibold ${m.change24h >= 0 ? "text-up" : "text-down"}`}>{pct(m.change24h)}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* other pools */}
        <div className="mt-8">
          <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-ink-soft">Other pools</h2>
          <div className="flex flex-wrap gap-2">
            {allPools.filter((p) => p.stock !== pool.stock).map((p) => (
              <Link key={p.stock} href={`/pools/${p.stock}`}
                className="tnum rounded-lg border border-border bg-panel px-3 py-2 text-sm font-semibold text-ink transition hover:border-[color:var(--border-strong)]">
                {p.stock} <span className="text-ink-soft">{compact(p.tvlUsd)}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
