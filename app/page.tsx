import Link from "next/link";
import { Nav } from "@/components/Nav";
import { BubbleMarket } from "@/components/BubbleMarket";
import { FeaturedPool } from "@/components/FeaturedPool";
import { FloatingBubbles } from "@/components/FloatingBubbles";
import { Ticker } from "@/components/Ticker";
import { PoolsTable } from "@/components/PoolsTable";
import { MemestockCard } from "@/components/MemestockCard";
import { MobileLiquidityBoard } from "@/components/MobileLiquidityBoard";
import { getPools, getStats, topMemes } from "@/lib/data";
import { compact } from "@/lib/format";
import {
  RocketLaunch, GraduationCap, ChartLineUp, ArrowRight, MagnifyingGlass, ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";

export default async function Home() {
  const [pools, stats, ranking] = await Promise.all([getPools(), getStats(), topMemes(6)]);
  const heroStats = [
    ["Total liquidity", compact(stats.totalLiquidityUsd)],
    ["24h volume", compact(stats.volume24hUsd)],
    ["Fees distributed", compact(stats.feesDistributedUsd)],
    ["Live pools", String(pools.length)],
  ] as const;

  return (
    <main>
      <Nav />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="hero-sky relative overflow-hidden">
        {/* brand gradient wash + drifting soap bubbles */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 opacity-[0.10]"
            style={{ background: "linear-gradient(160deg, #4f8bff 0%, #9a7bf5 45%, #f06fd8 100%)" }} />
          <div className="absolute -left-40 -top-32 h-[34rem] w-[34rem] rounded-full opacity-[0.16] blur-3xl"
            style={{ background: "radial-gradient(circle, var(--accent), transparent 65%)" }} />
          <div className="absolute right-[-10rem] top-10 h-[30rem] w-[30rem] rounded-full opacity-[0.14] blur-3xl"
            style={{ background: "radial-gradient(circle, var(--accent-2), transparent 65%)" }} />
        </div>
        <FloatingBubbles className="-z-10" />
        <div className="mx-auto max-w-7xl px-4 pt-12 pb-10 sm:px-6 lg:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
          <div className="relative z-10">
            <span className="hero-eyebrow inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold text-ink-soft shadow-sm backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent-2)]" /> Solana BubbleStock launchpad
            </span>
            <h1 className="mt-5 max-w-xl text-balance font-display text-4xl font-bold leading-[0.98] tracking-[-0.045em] text-ink sm:text-5xl lg:text-6xl">
              Turn memes into<br />market liquidity.
            </h1>
            <p className="mt-6 max-w-[34rem] text-pretty text-lg leading-relaxed text-ink-soft">
              Launch BubbleStocks that seed real STOCK/USDC liquidity. Trading fees compound
              into the pool, then flow back to holders.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/launch"
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-base font-bold text-white shadow-[0_12px_28px_rgba(47,107,246,0.24)] transition hover:-translate-y-0.5 hover:bg-[color:var(--accent-strong)] hover:shadow-[0_16px_34px_rgba(47,107,246,0.30)] active:translate-y-0 active:scale-[0.99]">
                <RocketLaunch size={20} weight="fill" /> Launch a BubbleStock
              </Link>
              <Link href="#markets"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-panel px-5 py-3 text-sm font-semibold text-ink transition hover:border-[color:var(--border-strong)]">
                <MagnifyingGlass size={18} weight="bold" /> Explore markets
              </Link>
            </div>

            {/* protocol stats */}
            <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-border/80 pt-6 sm:grid-cols-4">
              {heroStats.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs font-medium text-ink-soft">{label}</dt>
                  <dd className="tnum mt-1 font-display text-2xl font-bold text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* desktop: soap-bubble liquidity map · mobile: featured-pool card */}
          <div className="hidden md:block">
            <BubbleMarket pools={pools} />
          </div>
          <div className="md:hidden">
            <FeaturedPool pools={pools} />
            <MobileLiquidityBoard memes={ranking.slice(0, 3)} />
          </div>
        </div>

        <div className="mt-8"><Ticker /></div>
        </div>
      </section>

      {/* ── Pools table ─────────────────────────────────────────────────── */}
      <section id="pools" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-10 sm:px-6">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">Pools</h2>
            <p className="mt-1 text-sm text-ink-soft">Every STOCK/USDC pool, ranked by liquidity. Open one to inspect its BubbleStocks.</p>
          </div>
          <Link href="/explore" className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-brand sm:inline-flex">
            Explore BubbleStocks <ArrowRight size={15} weight="bold" />
          </Link>
        </div>
        <PoolsTable pools={pools} />
      </section>

      {/* ── How it works ────────────────────────────────────────────────── */}
      <section id="how" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-10 sm:px-6">
        <h2 className="font-display text-2xl font-bold tracking-tight text-ink">How the liquidity flows</h2>
        <p className="mt-1 text-sm text-ink-soft">Launch, migrate multipool, and compound fees into deeper liquidity.</p>
        <div className="home-flow-grid mt-6 grid gap-4 md:grid-cols-3">
          {[
            { icon: <RocketLaunch size={20} weight="fill" />, t: "Launch", d: "Launch BubbleStocks via a Dynamic Bonding Curve (DBC)." },
            { icon: <GraduationCap size={20} weight="fill" />, t: "Multipool", d: "BubbleStocks can migrate liquidity into several stock pools, bootstrapping initial STOCK/USDC liquidity that earns fees." },
            { icon: <ChartLineUp size={20} weight="fill" />, t: "Compounding fees", d: "BubbleStock fees are seeded into STOCK/USDC pools, growing liquidity long-term and increasing reflections over time." },
          ].map((s, i) => (
            <div key={s.t} className="home-flow-step card rounded-2xl p-5">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand/10 text-brand">{s.icon}</span>
                <span className="tnum text-sm font-semibold text-ink-faint">0{i + 1}</span>
              </div>
              <div className="mt-3 font-display font-bold text-ink">{s.t}</div>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trending ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">Trending BubbleStocks</h2>
          <Link href="/explore" className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand">
            View all <ArrowRight size={15} weight="bold" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ranking.map((m) => <MemestockCard key={m.id} m={m} />)}
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="mt-6 border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-ink-soft sm:flex-row sm:px-6">
          <span className="flex items-center gap-2">
            <ShieldCheck size={15} weight="fill" className="text-brand" /> BubbleStocks · built on Solana + Meteora
          </span>
          <span className="text-ink-faint">Not financial advice. BubbleStocks are high-risk. You sign every transaction.</span>
        </div>
      </footer>
    </main>
  );
}
