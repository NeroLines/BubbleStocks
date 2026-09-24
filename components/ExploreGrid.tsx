"use client";
import { useMemo, useState } from "react";
import { MemestockCard } from "./MemestockCard";
import { MagnifyingGlass } from "@phosphor-icons/react";
import type { Memestock } from "@/lib/data";

type Sort = "launched" | "liquidity" | "volume" | "apy" | "change";
const SORTS: { key: Sort; label: string }[] = [
  { key: "launched", label: "Last launched" },
  { key: "liquidity", label: "Liquidity" },
  { key: "volume", label: "24h volume" },
  { key: "apy", label: "APY" },
  { key: "change", label: "24h change" },
];
const FILTERS = ["All", "Migrated", "On curve"] as const;

// Explore is where people go to find a specific memestock, so it needs the three
// things every listing needs: search, filter, sort. Client-side over the full set.
export function ExploreGrid({ items }: { items: Memestock[] }) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("launched");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = items.filter((m) =>
      !needle || m.ticker.toLowerCase().includes(needle) || m.name.toLowerCase().includes(needle) || m.stock.toLowerCase().includes(needle)
    );
    if (filter === "Migrated") list = list.filter((m) => m.migrated);
    if (filter === "On curve") list = list.filter((m) => !m.migrated);
    if (sort === "launched") return [...list].sort((a, b) => new Date(b.launchedAt).getTime() - new Date(a.launchedAt).getTime());
    const key = { liquidity: "liquidityUsd", volume: "vol24hUsd", apy: "apy", change: "change24h" }[sort] as keyof Memestock;
    return [...list].sort((a, b) => (b[key] as number) - (a[key] as number));
  }, [items, q, sort, filter]);

  return (
    <>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative w-full sm:max-w-xs">
          <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search ticker, name or stock"
            className="bs-input !pl-10" />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${filter === f ? "bg-brand text-white" : "border border-border bg-panel text-ink-soft hover:text-ink"}`}>
              {f}
            </button>
          ))}
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-lg border border-border bg-panel px-3 py-1.5 text-sm font-semibold text-ink">
            {SORTS.map((s) => <option key={s.key} value={s.key}>Sort: {s.label}</option>)}
          </select>
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="card mt-6 rounded-2xl p-10 text-center text-ink-soft">
          No BubbleStocks match “{q}”. Try another ticker or clear the filters.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {shown.map((m) => <MemestockCard key={m.id} m={m} />)}
        </div>
      )}
    </>
  );
}
