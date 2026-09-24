// ┌─────────────────────────────────────────────────────────────────────────┐
// │ CONNECTOR SEAM — this is the ONLY file that needs on-chain wiring.         │
// │ Every function mirrors lib/stub.ts exactly (same name, args, return type). │
// │ Fill each body with the real Meteora DBC / DAMM v2 RPC read, and flip      │
// │ NEXT_PUBLIC_DATA_SOURCE=chain. The UI never changes.                       │
// └─────────────────────────────────────────────────────────────────────────┘
import type { Memestock, Pairing, Provider, StockPool } from "./stub";

// Keep the full multipool model visible at the connector seam. The aliases are
// intentionally referenced here so provider/pairing changes cannot drift from stub.
export type ChainPairing = Pairing;
export type ChainProvider = Provider;

// TODO(connector): const RPC = process.env.NEXT_PUBLIC_RPC_URL!  → new Connection(RPC)
// TODO(connector): DBC program id + DAMM v2 program id + IDL from partner (@fblochx1)
// TODO(connector): stock allowlist + metadata source (Meteora-quoted stocks)

const TODO = (fn: string): never => {
  throw new Error(`chain.${fn}: not wired yet. Set NEXT_PUBLIC_DATA_SOURCE=stub or implement the RPC read.`);
};

export async function getPools(): Promise<StockPool[]> {
  // TODO(connector): read every STOCK/USDC DAMM v2 pool + its meme LPs, map to StockPool[]
  return TODO("getPools");
}

export async function getPool(stock: string): Promise<StockPool | undefined> {
  // TODO(connector): read one STOCK/USDC pool + its meme LPs by stock symbol
  void stock;
  return TODO("getPool");
}

export async function getMemestocks(): Promise<Memestock[]> {
  // TODO(connector): read all launched memestocks (bonding-curve + migrated) → Memestock[]
  return TODO("getMemestocks");
}

export async function getMemestock(id: string): Promise<Memestock | undefined> {
  // TODO(connector): read one memestock by mint/id
  void id;
  return TODO("getMemestock");
}

export async function topMemes(n = 5): Promise<Memestock[]> {
  // TODO(connector): same source as getMemestocks, sorted by liquidity
  void n;
  return TODO("topMemes");
}

export async function getStats() {
  // TODO(connector): protocol-wide aggregates (TVL, 24h volume, fees distributed)
  return TODO("getStats");
}

// Write path — creator submits a launch. Returns the new mint id / tx signature.
// LaunchInput shape lives in stub.ts (single source of truth).
import type { LaunchInput, LaunchResult, SwapInput } from "./stub";
export async function launchMemestock(input: LaunchInput): Promise<LaunchResult> {
  // TODO(connector): build + send the DBC launch tx (single-segment fair curve, 1bln
  // supply, $69k threshold, 2.5%+0.5% fee) via the connected wallet. Upload
  // imageDataUrl first, write its permanent URL into token metadata, then return
  // the mint id, tx signature, imageUrl and metadataUri.
  void input;
  return TODO("launchMemestock");
}

export async function swap(input: SwapInput): Promise<{ signature: string; amountOut: number }> {
  // TODO(connector): quote + build the Meteora DBC (pre-migration) or DAMM v2 swap tx,
  // apply slippageBps, send via the connected wallet, return the fill.
  void input;
  return TODO("swap");
}
