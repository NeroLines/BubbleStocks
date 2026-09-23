import { coinSrc } from "@/lib/coins";
import type { Memestock } from "@/lib/data";

// A meme's mascot coin as a crisp circular token. rounded-full clips the source
// corners (where the generator watermark sits), so it always reads clean.
export function CoinImage({ m, size = 40, ring = true }: { m: Memestock; size?: number; ring?: boolean }) {
  return (
    <span
      className={`inline-block shrink-0 overflow-hidden rounded-full bg-surface-2 ${ring ? "ring-1 ring-black/5 shadow-sm" : ""}`}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={coinSrc(m.emoji)} alt={`${m.ticker} coin`} width={size} height={size}
        className="h-full w-full object-cover" loading="lazy" />
    </span>
  );
}
