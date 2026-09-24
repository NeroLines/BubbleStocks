import type { StockPool } from "./stub";

// Actual routed liquidity for a pool's contributors. This deliberately avoids
// a fixed protocol split because each creator chooses a valid 50–100% main pair.
export function poolLiquidityBreakdown(pool: StockPool) {
  const memeLiquidityUsd = pool.contributors.reduce(
    (sum, meme) => sum + (meme.stock === pool.stock ? meme.memeLiquidityUsd : 0),
    0,
  );
  const compoundingLiquidityUsd = pool.contributors.reduce((sum, meme) => {
    const pairing = meme.pairings.find((item) => item.poolAddress === pool.poolAddress);
    return sum + (pairing?.lpUsd ?? 0);
  }, 0);
  const routedLiquidityUsd = memeLiquidityUsd + compoundingLiquidityUsd;

  return {
    memeLiquidityUsd,
    compoundingLiquidityUsd,
    routedLiquidityUsd,
    memePct: routedLiquidityUsd ? (memeLiquidityUsd / routedLiquidityUsd) * 100 : 0,
    compoundingPct: routedLiquidityUsd ? (compoundingLiquidityUsd / routedLiquidityUsd) * 100 : 0,
  };
}
