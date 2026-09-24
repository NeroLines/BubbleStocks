import { Nav } from "@/components/Nav";
import { BrandPageHeader } from "@/components/BrandPageHeader";
import { BrandStoryVisual } from "@/components/BrandStoryVisual";
import { getStats, getPools } from "@/lib/data";
import { compact } from "@/lib/format";
import { Coins, ArrowsClockwise, Clock, Gift, Wallet, ArrowRight, Fire } from "@phosphor-icons/react/dist/ssr";

export default async function RewardsPage() {
  const [stats, pools] = await Promise.all([getStats(), getPools()]);
  const poolFees24h = pools.reduce((s, p) => s + p.fees24hUsd, 0);

  return (
    <main className="min-h-[100dvh] bg-bg">
      <Nav />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <BrandPageHeader
          eyebrow="Holder rewards"
          title="Fees flow back into the bubble."
          description="Pool fees compound into deeper STOCK/USDC liquidity, then flow to holders alongside the 30% time-weighted reward vault."
        >
          <BrandStoryVisual variant="rewards" />
        </BrandPageHeader>

        {/* top stats */}
        <div className="relative z-10 -mt-4 grid gap-4 px-3 sm:grid-cols-3 sm:px-6">
          <Tile icon={<Coins size={22} weight="fill" />} value={compact(stats.feesDistributedUsd)} label="Fees distributed to holders" />
          <Tile icon={<ArrowsClockwise size={22} weight="fill" />} value={compact(poolFees24h)} label="24h fees compounding" />
          <Tile icon={<Gift size={22} weight="fill" />} value="30%" label="Of supply reserved as rewards" />
        </div>

        {/* the two streams */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="card rounded-2xl p-6">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand"><ArrowsClockwise size={22} weight="fill" /></span>
            <div className="mt-4 font-display text-lg font-bold text-ink">Compounding fee airdrops</div>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              A BubbleStock&apos;s trading fees compound into shared STOCK/USDC pools. The pools
              grows, and its fees are airdropped to holders — the deeper the pool gets, the
              bigger the payouts.
            </p>
            <ol className="mt-4 grid gap-2 text-sm text-ink">
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-brand" /> Meme/Stock fees compound into STOCK/USDC</li>
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[color:var(--accent-2)]" /> Snapshot of holders is taken</li>
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-up" /> Pool fees airdropped, no claim needed</li>
            </ol>
          </div>

          <div className="card rounded-2xl p-6">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand"><Clock size={22} weight="fill" /></span>
            <div className="mt-4 font-display text-lg font-bold text-ink">Holding boost · 30% vault</div>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              30% of every launch&apos;s supply is reserved in a reward vault and airdropped to
              holders, weighted by hold time. The longer you hold, the larger your slice.
            </p>
            <div className="mt-4 space-y-2.5">
              {[["Diamond hands · 90d+", 100], ["Steady · 30d", 62], ["Fresh · 7d", 28]].map(([label, w]) => (
                <div key={label as string} className="flex items-center gap-3">
                  <span className="w-32 shrink-0 text-xs text-ink-soft">{label}</span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-panel-2">
                    <div className="h-full rounded-full" style={{ width: `${w}%`, background: "linear-gradient(90deg, var(--accent-2), var(--accent))" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* note */}
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-border bg-panel-2 p-5">
          <Fire size={20} weight="fill" className="mt-0.5 shrink-0 text-down" />
          <p className="text-sm leading-relaxed text-ink-soft">
            <span className="font-semibold text-ink">Clean supply.</span> Any meme oversupply left
            after migration is burned, so the circulating supply reflects real, migrated liquidity.
          </p>
        </div>

        {/* your rewards */}
        <div className="mt-6 card flex flex-col items-start gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand"><Wallet size={22} weight="fill" /></span>
            <div>
              <div className="font-display font-bold text-ink">Your rewards</div>
              <div className="text-sm text-ink-soft">Connect a wallet to see your fee airdrops and holding boost.</div>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white">
            Connect wallet <ArrowRight size={14} weight="bold" />
          </span>
        </div>
      </div>
    </main>
  );
}

function Tile({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="card rounded-2xl p-5">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand/10 text-brand">{icon}</span>
      <div className="tnum mt-3 font-display text-2xl font-bold text-ink">{value}</div>
      <div className="mt-0.5 text-sm text-ink-soft">{label}</div>
    </div>
  );
}
