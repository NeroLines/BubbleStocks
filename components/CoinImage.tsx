import { coinSrc } from "@/lib/coins";
import type { Memestock } from "@/lib/data";

// Creator artwork wins; curated mascot art is the fallback for stub entries.
// Every map/card/detail surface uses this component, so one metadata image URL
// automatically propagates through the full BubbleStocks UI.
export function CoinImage({ m, size = 40, ring = true }: { m: Memestock; size?: number; ring?: boolean }) {
  return (
    <span
      className={`inline-block shrink-0 overflow-hidden rounded-full bg-surface-2 ${m.imageUrl ? "creator-coin-image" : ""} ${ring ? "ring-1 ring-black/5 shadow-sm" : ""}`}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={m.imageUrl ?? coinSrc(m.emoji)} alt={`${m.ticker} coin`} width={size} height={size}
        className={`h-full w-full rounded-full object-cover ${m.imageUrl ? "p-[2px]" : ""}`} loading="lazy" />
    </span>
  );
}
