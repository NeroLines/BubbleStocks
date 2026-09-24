// Single data entry point for the whole UI. Swap the source with one env var:
//   NEXT_PUBLIC_DATA_SOURCE=stub   → mock data (default, ships today)
//   NEXT_PUBLIC_DATA_SOURCE=chain  → real on-chain reads (lib/chain.ts)
// Pages/components import from "@/lib/data", never from stub/chain directly, so
// going live is a one-line switch once the connector seam is filled in.
import * as stub from "./stub";
import * as chain from "./chain";

const src = process.env.NEXT_PUBLIC_DATA_SOURCE === "chain" ? chain : stub;

export const getPools = src.getPools;
export const getPool = src.getPool;
export const getMemestocks = src.getMemestocks;
export const getMemestock = src.getMemestock;
export const topMemes = src.topMemes;
export const getStats = src.getStats;
export const launchMemestock = src.launchMemestock;
export const swap = src.swap;

// Constants + types live in stub (they are shape, not data source).
export { ALLOCATION_RULES, SUPPORTED_STOCKS, isLaunchAllocationValid } from "./stub";
export type { Memestock, Pairing, Provider, StockPool, LaunchAllocation, LaunchInput, LaunchResult, SwapInput } from "./stub";
