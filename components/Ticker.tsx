import { getMemestocks } from "@/lib/data";
import { pct, usd } from "@/lib/format";
import { CaretUp, CaretDown } from "@phosphor-icons/react/dist/ssr";

// Live-feed strip under the hero. Duplicated once so the CSS marquee loops
// seamlessly. Motion is decorative but communicates "live market" — motivated.
export async function Ticker() {
  const stocks = await getMemestocks();
  const row = [...stocks, ...stocks];
  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="flex shrink-0 items-center gap-2 pr-3 text-sm font-semibold text-ink">
          <span className="h-2 w-2 rounded-full bg-up" /> Live market
        </span>
        <div className="relative flex-1 overflow-hidden">
          <div className="ticker-track flex w-max gap-6">
            {row.map((s, i) => {
              const up = s.change24h >= 0;
              return (
                <span key={i} className="flex items-center gap-2 whitespace-nowrap text-sm">
                  <span className="font-mono font-semibold text-ink">${s.ticker}</span>
                  <span className="font-mono text-ink-soft">{usd(s.priceUsd)}</span>
                  <span className={`inline-flex items-center gap-0.5 font-mono font-semibold ${up ? "text-up" : "text-down"}`}>
                    {up ? <CaretUp size={12} weight="bold" /> : <CaretDown size={12} weight="bold" />}
                    {pct(s.change24h)}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
