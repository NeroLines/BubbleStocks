// Stub data layer. Every export here is what the UI reads today with mock data.
// When the on-chain side is ready, swap these bodies for real RPC / Meteora
// reads — the shapes stay the same, so the UI does not change.
//
// ponytail: mock now, RPC later. Keep function names/return shapes stable.

// One source of truth for creator-controlled migration allocations.
export const ALLOCATION_RULES = {
  totalPct: 100,
  mainMinPct: 50,
  maxExtraPools: 3,
  extraPoolMinPct: 10,
  extraPoolMaxPct: 50,
  stepPct: 5,
} as const;

export type LaunchAllocation = {
  memeStockPct: number;
  pools: { stock: string; pct: number }[];
};

export function isLaunchAllocationValid(allocation: LaunchAllocation, mainStock?: string): boolean {
  const { memeStockPct, pools } = allocation;
  if (!Number.isFinite(memeStockPct)
    || memeStockPct < ALLOCATION_RULES.mainMinPct
    || memeStockPct > ALLOCATION_RULES.totalPct
    || pools.length > ALLOCATION_RULES.maxExtraPools) return false;

  const destinations = new Set(mainStock ? [mainStock] : []);
  let total = memeStockPct;
  for (const pool of pools) {
    if (!pool.stock
      || destinations.has(pool.stock)
      || !Number.isFinite(pool.pct)
      || pool.pct < ALLOCATION_RULES.extraPoolMinPct
      || pool.pct > ALLOCATION_RULES.extraPoolMaxPct) return false;
    destinations.add(pool.stock);
    total += pool.pct;
  }
  return total === ALLOCATION_RULES.totalPct;
}

export type Provider = "teslax" | "prestock" | "Tessera";

export type Pairing = {
  stock: string;
  provider: Provider;
  poolAddress: string;
  lpUsd: number;
  lpSharePct: number;
};

export type Memestock = {
  id: string;
  ticker: string;    // meme ticker, e.g. TSCATLA
  name: string;      // display name
  stock: string;     // real underlying, e.g. TSLA
  emoji: string;     // stand-in avatar until real art lands
  imageUrl?: string; // creator artwork from permanent metadata storage
  metadataUri?: string; // IPFS/Arweave/HTTPS metadata document
  address: string;   // mint address (example data in the stub)
  launchedAt: Date;
  website?: string;
  twitter?: string;
  telegram?: string;
  description: string;
  priceUsd: number;
  change24h: number; // percent, can be negative
  mcapUsd: number;
  liquidityUsd: number; // total across meme + compounding liquidity
  memeLiquidityUsd: number;
  compoundingLiquidityUsd: number;
  pairings: Pairing[];
  apy: number;          // dividend APY from compounded fees
  holders: number;
  vol24hUsd: number;
  fees24hUsd: number;
  rewardPayout24hUsd: number; // estimated holder reflections generated in 24h
  bondingPct: number;   // 0..100 progress along the bonding curve
  migrated: boolean;    // has it graduated to DAMM v2 yet
  spark: number[];      // recent price points for the sparkline
};

// A shared STOCK/USDC pool: the "major bubble" in the Bubble Market. Every meme
// that tracks this stock LPs into it; each is a satellite bubble around it.
export type StockPool = {
  stock: string;
  provider: Provider;
  poolAddress: string;
  tvlUsd: number;
  apy: number;              // blended dividend APY
  vol24hUsd: number;
  fees24hUsd: number;
  contributors: Memestock[]; // the memes LPing into this pool, biggest first
  // Layout hint for the Bubble Market canvas: center (%), size tier.
  cx: number; cy: number; tier: 0 | 1 | 2; // 0 = hero pool, 1 = major, 2 = minor
};

function spark(seed: number, up: boolean): number[] {
  const pts: number[] = [];
  let v = 40 + (seed % 20);
  for (let i = 0; i < 24; i++) {
    v += Math.sin(seed + i) * 4 + (up ? 1.1 : -0.9) + ((i * seed) % 5) - 2;
    pts.push(Math.max(6, v));
  }
  return pts;
}

// Each entry: [ticker, name, emoji, liquidityUsd(K), change24h, apy, holders]
type MemeSeed = [string, string, string, number, number, number, number];

// Curated to mirror the Bubble Market reference: hero TSLA pool in the middle,
// major pools around it, minor pools filling the edges. cx/cy are % on the canvas.
const POOL_SEEDS: {
  stock: string; provider: Provider; tvlUsd: number; cx: number; cy: number; tier: 0 | 1 | 2; memes: MemeSeed[];
}[] = [
  {
    stock: "TSLA", provider: "teslax", tvlUsd: 4_820_000, cx: 50, cy: 45, tier: 0,
    memes: [
      ["TSCATLA", "Tesla Cat",  "🐱", 842, -12.4, 42.8, 3482],
      ["TSLAMEME", "Tesla Bull", "🐂", 126,  6.1, 26.4, 910],
      ["TSLAHODL", "Tesla Bear", "🐻", 98,  -3.2, 21.7, 604],
    ],
  },
  {
    stock: "NVDA", provider: "prestock", tvlUsd: 3_210_000, cx: 23, cy: 28, tier: 1,
    memes: [
      ["NVCATDA", "Nvidia Cat",  "🐱", 621,  8.7, 31.2, 2812],
      ["NVDAFROG", "Nvidia Frog", "🐸", 284, 21.3, 28.0, 1140],
      ["NVDAWIF",  "Nvidia Wif",  "🐶", 192,  5.1, 24.5, 760],
    ],
  },
  {
    stock: "GOOGL", provider: "Tessera", tvlUsd: 2_760_000, cx: 77, cy: 28, tier: 1,
    memes: [
      ["GOOCAT",   "Google Cat",  "🐱", 412,  3.2, 31.7, 2110],
      ["GOOGFROG", "Google Frog", "🐸", 208,  4.4, 27.1, 980],
      ["GOOGWIF",  "Google Wif",  "🐶", 141,  9.9, 22.8, 640],
    ],
  },
  {
    stock: "AAPL", provider: "prestock", tvlUsd: 2_140_000, cx: 20, cy: 68, tier: 1,
    memes: [
      ["AACATPL",  "Apple Cat",   "🐱", 318, -2.1, 26.9, 1620],
      ["APPLEFROG","Apple Frog",  "🐸", 156,  4.8, 23.4, 720],
      ["APLWIF",   "Apple Wif",   "🐶", 104,  2.7, 19.6, 480],
    ],
  },
  {
    stock: "AMZN", provider: "teslax", tvlUsd: 1_930_000, cx: 45, cy: 74, tier: 1,
    memes: [
      ["AMCATZN", "Amazon Cat",  "🐱", 274,  4.8, 28.9, 1690],
      ["AMZDOG",  "Amazon Dog",  "🐶", 161, 11.9, 25.2, 810],
      ["AMZPEPE", "Amazon Pepe", "🐸", 97,   7.3, 20.1, 430],
    ],
  },
  {
    stock: "COIN", provider: "Tessera", tvlUsd: 1_560_000, cx: 70, cy: 68, tier: 2,
    memes: [
      ["COCATIN",  "Coinbase Cat",  "🐱", 231, 15.6, 24.6, 1410],
      ["COINFROG", "Coinbase Frog", "🐸", 142,  6.3, 21.0, 690],
      ["COINWIF",  "Coinbase Wif",  "🐶", 88,   3.1, 18.2, 360],
    ],
  },
  {
    stock: "HOOD", provider: "prestock", tvlUsd: 1_390_000, cx: 82, cy: 50, tier: 2,
    memes: [
      ["HOCATOD",  "Hood Cat",  "🐱", 231, 11.9, 23.7, 1300],
      ["HOODFROG", "Hood Frog", "🐸", 121,  5.4, 20.4, 620],
      ["HOODWIF",  "Hood Wif",  "🐶", 76,   2.2, 17.1, 300],
    ],
  },
];

const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const fakePubkey = (seed: number) => Array.from({ length: 44 }, (_, i) => BASE58[(seed * 17 + i * 11) % BASE58.length]).join("");

const EXTRA_PAIRINGS: Record<string, number[]> = {
  TSCATLA: [1, 2],
  NVCATDA: [0, 5],
  GOOCAT: [0],
  AACATPL: [1],
  AMCATZN: [2, 5],
  COCATIN: [0, 6],
  HOCATOD: [4],
};

let _cache: { pools: StockPool[]; memes: Memestock[] } | null = null;

function build() {
  if (_cache) return _cache;
  const pools: StockPool[] = POOL_SEEDS.map((p, i) => ({
    stock: p.stock,
    provider: p.provider,
    poolAddress: fakePubkey(100 + i),
    tvlUsd: p.tvlUsd,
    apy: 0,
    vol24hUsd: 0,
    fees24hUsd: 0,
    contributors: [],
    cx: p.cx,
    cy: p.cy,
    tier: p.tier,
  }));
  let uid = 0;
  const memes: Memestock[] = POOL_SEEDS.flatMap((p, poolIndex) =>
    p.memes.map(([ticker, name, emoji, liqK, chg, apy, holders], i) => {
      const memeLiquidityUsd = liqK * 1000;
      const primaryLpUsd = Math.round(memeLiquidityUsd * (0.22 + (i * 0.035)));
      const vol24hUsd = Math.round(memeLiquidityUsd * (1.2 + ((i * 7) % 10) / 10));
      const price = +(0.004 + (uid % 9) * 0.006 + Math.abs(chg) * 0.0004).toFixed(4);
      uid++;
      return {
        id: String(uid),
        ticker, name, stock: p.stock, emoji,
        address: fakePubkey(uid),
        launchedAt: new Date(Date.UTC(2026, 8, Math.max(1, 24 - uid), 9 + (uid % 8), (uid * 7) % 60)),
        website: `https://example.com/bubblestocks/${ticker.toLowerCase()}`,
        twitter: `https://x.com/${ticker.toLowerCase()}`,
        telegram: `https://t.me/${ticker.toLowerCase()}`,
        description: `${name} is a community-launched BubbleStock routing trading fees into ${p.stock}/USDC liquidity and holder rewards.`,
        priceUsd: price,
        change24h: chg,
        mcapUsd: memeLiquidityUsd * 10,
        liquidityUsd: memeLiquidityUsd + primaryLpUsd,
        memeLiquidityUsd,
        compoundingLiquidityUsd: primaryLpUsd,
        pairings: [{
          stock: p.stock,
          provider: pools[poolIndex].provider,
          poolAddress: pools[poolIndex].poolAddress,
          lpUsd: primaryLpUsd,
          lpSharePct: +(primaryLpUsd / pools[poolIndex].tvlUsd * 100).toFixed(2),
        }],
        apy, holders,
        vol24hUsd,
        fees24hUsd: Math.round(vol24hUsd * 0.003),
        // Estimated reflections generated for this meme's holders in the last 24h.
        rewardPayout24hUsd: Math.round(vol24hUsd * 0.003 * 0.6),
        bondingPct: 100,
        migrated: true,
        spark: spark(uid + 3, chg >= 0),
      };
    })
  );

  for (const meme of memes) {
    const targets = EXTRA_PAIRINGS[meme.ticker] ?? [];
    targets.forEach((poolIndex, i) => {
      const target = pools[poolIndex];
      const lpUsd = Math.round(meme.memeLiquidityUsd * (0.075 + i * 0.025));
      meme.pairings.push({
        stock: target.stock,
        provider: target.provider,
        poolAddress: target.poolAddress,
        lpUsd,
        lpSharePct: +(lpUsd / target.tvlUsd * 100).toFixed(2),
      });
    });
    meme.compoundingLiquidityUsd = meme.pairings.reduce((sum, pairing) => sum + pairing.lpUsd, 0);
    meme.liquidityUsd = meme.memeLiquidityUsd + meme.compoundingLiquidityUsd;
  }

  for (const pool of pools) {
    pool.contributors = memes
      .filter((m) => m.pairings.some((pairing) => pairing.poolAddress === pool.poolAddress))
      .sort((a, b) => {
        const aLp = a.pairings.find((pairing) => pairing.poolAddress === pool.poolAddress)?.lpUsd ?? 0;
        const bLp = b.pairings.find((pairing) => pairing.poolAddress === pool.poolAddress)?.lpUsd ?? 0;
        return bLp - aLp;
      });
    pool.vol24hUsd = pool.contributors.reduce((sum, m) => sum + m.vol24hUsd, 0);
    pool.fees24hUsd = pool.contributors.reduce((sum, m) => sum + m.fees24hUsd, 0);
    pool.apy = +(pool.contributors.reduce((sum, m) => sum + m.apy, 0) / Math.max(1, pool.contributors.length)).toFixed(1);
  }

  _cache = { pools, memes };
  return _cache;
}

export async function getPools(): Promise<StockPool[]> {
  return build().pools;
}

export async function getPool(stock: string): Promise<StockPool | undefined> {
  return build().pools
    .filter((p) => p.stock.toLowerCase() === stock.toLowerCase())
    .sort((a, b) => b.tvlUsd - a.tvlUsd)[0];
}

export async function getMemestocks(): Promise<Memestock[]> {
  return build().memes;
}

export async function getMemestock(id: string): Promise<Memestock | undefined> {
  return (await getMemestocks()).find((m) => m.id === id);
}

// Ranking for the "Top Meme Liquidity" board.
export async function topMemes(n = 5): Promise<Memestock[]> {
  return (await getMemestocks()).sort((a, b) => b.liquidityUsd - a.liquidityUsd).slice(0, n);
}

// Protocol-wide headline numbers.
export async function getStats() {
  const { pools, memes } = build();
  return {
    totalLiquidityUsd: 48_700_000,
    volume24hUsd: 12_300_000,
    feesDistributedUsd: 482_600,
    stockUsdcTvlUsd: pools.reduce((s, p) => s + p.tvlUsd, 0),
    launches: 128,
    live: memes.length,
    allocationRules: ALLOCATION_RULES,
  };
}

// Write path (stub): pretend to launch and hand back a fake mint id + signature.
// Fields mirror the partner's launch spec: name, ticker, picture, quote token,
// dev buy, socials, plus the underlying stock this memestock is paired with.
export type LaunchInput = {
  name: string;
  ticker: string;
  stock: string;
  quoteToken: "USDC";     // fixed launch quote; no creator-selectable alternatives
  // Portable source for the connector to upload to permanent metadata storage.
  // Never pass a blob: URL here: it stops working when the browser tab closes.
  imageDataUrl?: string;
  description?: string;
  devBuySol?: number;      // optional creator's first buy
  website?: string;
  twitter?: string;
  telegram?: string;
  // Migration allocation (partner spec): meme/stock keeps >= 50%; the rest splits
  // across up to 3 STOCK/USDC fee-recipient pools. Percentages sum to 100.
  allocation: LaunchAllocation;
};
export type LaunchResult = {
  id: string;
  signature: string;
  imageUrl?: string;
  metadataUri?: string;
};
export async function launchMemestock(input: LaunchInput): Promise<LaunchResult> {
  if (!isLaunchAllocationValid(input.allocation, input.stock)) {
    throw new Error("Invalid allocation: keep at least 50% in the main pair and distribute at most 50% across up to three unique pools.");
  }
  await new Promise((r) => setTimeout(r, 1200)); // feel of a real tx
  return {
    id: input.ticker.toLowerCase(),
    signature: "stub" + Math.random().toString(36).slice(2, 12),
    // The real connector replaces this with the uploaded permanent asset URL.
    imageUrl: input.imageDataUrl,
  };
}

// Buy/sell a memestock (stub): estimate the fill and hand back a fake signature.
export type SwapInput = { id: string; side: "buy" | "sell"; amountIn: number; quoteToken: string; slippageBps: number };
export async function swap(input: SwapInput): Promise<{ signature: string; amountOut: number }> {
  await new Promise((r) => setTimeout(r, 1100));
  const m = (await getMemestocks()).find((x) => x.id === input.id);
  const price = m?.priceUsd ?? 0.01;
  const amountOut = input.side === "buy" ? input.amountIn / price : input.amountIn * price;
  return { signature: "stub" + Math.random().toString(36).slice(2, 12), amountOut };
}

// The real underlyings a creator can pick when launching.
export const SUPPORTED_STOCKS = [
  "TSLA", "NVDA", "AAPL", "GOOGL", "AMZN", "META", "MSFT",
  "COIN", "SPY", "HOOD", "MSTR", "AMD",
];
