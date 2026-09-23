# BubbleStocks

Solana memestock launchpad. Launch memestocks that seed real STOCK/USDC liquidity;
trading fees compound into the pools and flow back to holders.

Built for the StockLana hackathon (Meteora DBC + DAMM v2).

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript
- Tailwind CSS v4 · Motion
- `@solana/wallet-adapter` (Phantom / Solflare / Backpack)
- `d3-force` for the liquidity-map layout

## Run

```bash
npm install
npm run dev        # http://localhost:3000
```

## Structure

- `app/` — routes: landing, `explore`, `launch`, `pools/[stock]`, `token/[id]`, `dividends` (rewards)
- `components/` — UI (bubble market, pools table, launch form, trade panel, wallet, nav)
- `lib/data.ts` — **the single data entry point.** Swap the source with one env var:
  `NEXT_PUBLIC_DATA_SOURCE=stub` (default, mock data) or `chain` (on-chain reads).
- `lib/chain.ts` — **the connector seam.** The only file that needs on-chain wiring;
  every function mirrors `lib/stub.ts` exactly. Fill the bodies with real Meteora DBC /
  DAMM v2 reads + tx building, set `NEXT_PUBLIC_RPC_URL`, and flip the env var.
- `lib/stub.ts` — mock data + shapes (source of truth for types).

## Going live

The UI is complete and runs on mock data behind the connector seam. To go live:

1. Set `NEXT_PUBLIC_RPC_URL` and `NEXT_PUBLIC_DATA_SOURCE=chain`.
2. Implement the reads/writes in `lib/chain.ts` (program IDs, IDL, launch + swap tx).

Example data throughout. Not financial advice.
