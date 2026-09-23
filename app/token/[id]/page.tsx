import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Sparkline } from "@/components/Sparkline";
import { TradePanel } from "@/components/TradePanel";
import { CoinImage } from "@/components/CoinImage";
import { getMemestock } from "@/lib/data";
import { compact, pct, usd } from "@/lib/format";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";

export default async function TokenPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const m = await getMemestock(id);
  if (!m) notFound();
  const up = m.change24h >= 0;

  return (
    <main className="min-h-[100dvh] bg-bg">
      <Nav />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Link href={`/pools/${m.stock}`} className="inline-flex items-center gap-1 text-sm font-semibold text-ink-soft transition hover:text-ink">
          <ArrowLeft size={16} weight="bold" /> {m.stock}/USDC pool
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex items-center gap-3">
                <CoinImage m={m} size={52} />
                <div>
                  <h1 className="font-mono text-3xl font-extrabold text-ink">${m.ticker}</h1>
                  <div className="mt-1 text-ink-soft">
                    {m.name} · tracks{" "}
                    <Link href={`/pools/${m.stock}`} className="font-semibold text-brand hover:underline">{m.stock}</Link>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-3xl font-extrabold text-ink">{usd(m.priceUsd)}</div>
                <div className={`font-mono text-sm font-bold ${up ? "text-up" : "text-down"}`}>
                  {pct(m.change24h)} · 24h
                </div>
              </div>
            </div>

            <div className="glass mt-6 rounded-3xl p-6">
              <Sparkline points={m.spark} up={up} w={820} h={220} />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Stat label="Market cap" value={compact(m.mcapUsd)} />
              <Stat label="Liquidity" value={compact(m.liquidityUsd)} />
              <Stat label="Status" value={m.migrated ? "Migrated" : `${m.bondingPct}% bonded`} />
              <Stat label="Underlying" value={m.stock} />
            </div>

            <Link href={`/pools/${m.stock}`}
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
              See all {m.stock} memes and the pool <ArrowRight size={14} weight="bold" />
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="font-mono text-lg font-bold text-ink">{value}</div>
      <div className="mt-1 text-xs text-ink-soft">{label}</div>
    </div>
  );
}
