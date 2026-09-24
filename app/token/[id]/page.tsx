import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Sparkline } from "@/components/Sparkline";
import { TradePanel } from "@/components/TradePanel";
import { CoinImage } from "@/components/CoinImage";
import { CopyButton } from "@/components/CopyButton";
import { ProviderBadge } from "@/components/ProviderBadge";
import { getMemestock } from "@/lib/data";
import { compact, pct, usd } from "@/lib/format";
import { ArrowLeft, ArrowRight, GlobeSimple, TelegramLogo, XLogo } from "@phosphor-icons/react/dist/ssr";

export default async function TokenPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const m = await getMemestock(id);
  if (!m) notFound();
  const up = m.change24h >= 0;

  return (
    <main className="min-h-[100dvh] bg-bg">
      <Nav />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Link href="/explore" className="inline-flex items-center gap-1 text-sm font-semibold text-ink-soft transition hover:text-ink">
          <ArrowLeft size={16} weight="bold" /> Explore BubbleStocks
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <section className="token-brand-hero overflow-hidden rounded-3xl border p-5 sm:p-7">
            <div className="relative z-10 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <div className="flex min-w-0 items-center gap-3">
                <CoinImage m={m} size={56} />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-mono text-3xl font-extrabold text-ink">${m.ticker}</h1>
                    <CopyButton address={m.address} label="Copy example BubbleStock mint" />
                  </div>
                  <div className="mt-1 text-ink-soft">{m.name} · launched {m.launchedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <div className="font-mono text-3xl font-extrabold text-ink">{usd(m.priceUsd)}</div>
                <div className={`font-mono text-sm font-bold ${up ? "text-up" : "text-down"}`}>{pct(m.change24h)} · 24h</div>
              </div>
            </div>

            <div className="relative z-10 mt-5 flex flex-wrap gap-2">
              {m.website && <SocialLink href={m.website} icon={<GlobeSimple size={16} />} label="Website" />}
              {m.twitter && <SocialLink href={m.twitter} icon={<XLogo size={15} />} label="X" />}
              {m.telegram && <SocialLink href={m.telegram} icon={<TelegramLogo size={16} />} label="Telegram" />}
            </div>
            <p className="relative z-10 mt-4 max-w-3xl text-pretty leading-relaxed text-ink-soft">{m.description}</p>
            </section>

            <div className="glass mt-6 rounded-3xl p-6">
              <Sparkline points={m.spark} up={up} w={820} h={220} />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Stat label="Market cap" value={compact(m.mcapUsd)} />
              <Stat label="Meme liquidity" value={compact(m.memeLiquidityUsd)} />
              <Stat label="Compounding liquidity" value={compact(m.compoundingLiquidityUsd)} accent />
              <Stat label="Status" value={m.migrated ? "Migrated" : `${m.bondingPct}% bonded`} />
              <Stat label="Pairings" value={`${m.pairings.length} pools`} />
              <Stat label="Holders" value={m.holders.toLocaleString()} />
            </div>

            <section className="mt-8" aria-labelledby="pairings-title">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 id="pairings-title" className="font-display text-xl font-bold text-ink">Compounding destinations</h2>
                  <p className="mt-1 text-sm text-ink-soft">Stock/USDC pools receiving trading-fee liquidity from this BubbleStock.</p>
                </div>
                <span className="text-xs text-ink-faint">Example data</span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {m.pairings.map((pairing) => (
                  <article key={pairing.poolAddress} className="card rounded-2xl p-4">
                    <div className="flex items-center justify-between gap-3">
                      <Link href={`/pools/${pairing.stock}`} className="font-display text-lg font-bold text-ink hover:text-brand">{pairing.stock}<span className="text-ink-soft">/USDC</span></Link>
                      <ProviderBadge provider={pairing.provider} />
                    </div>
                    <dl className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-panel-2 p-3">
                      <div><dt className="text-xs text-ink-soft">LP liquidity</dt><dd className="tnum mt-1 font-bold text-ink">{compact(pairing.lpUsd)}</dd></div>
                      <div><dt className="text-xs text-ink-soft">Pool share</dt><dd className="tnum mt-1 font-bold text-brand">{pairing.lpSharePct.toFixed(2)}%</dd></div>
                    </dl>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-ink-faint">Example pool address</span>
                      <CopyButton address={pairing.poolAddress} label="Copy example pool address" />
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <Link href={`/pools/${m.stock}`} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
              See the primary {m.stock}/USDC pool <ArrowRight size={14} weight="bold" />
            </Link>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <TradePanel m={m} />
          </div>
        </div>
      </div>
    </main>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-panel px-3 py-2 text-sm font-semibold text-ink-soft transition hover:border-[color:var(--border-strong)] hover:text-ink">{icon}{label}</a>;
}

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className={`font-mono text-lg font-bold ${accent ? "text-brand" : "text-ink"}`}>{value}</div>
      <div className="mt-1 text-xs text-ink-soft">{label}</div>
    </div>
  );
}
