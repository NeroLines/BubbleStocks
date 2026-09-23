import { Nav } from "@/components/Nav";
import { ExploreGrid } from "@/components/ExploreGrid";
import { getMemestocks } from "@/lib/data";

export default async function ExplorePage() {
  const stocks = await getMemestocks();
  return (
    <main className="min-h-[100dvh] bg-bg">
      <Nav />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">Explore memestocks</h1>
        <p className="mt-2 text-ink-soft">Every meme live on the curve or migrated to DAMM v2. Search, filter and sort to find your play.</p>
        <ExploreGrid items={stocks} />
      </div>
    </main>
  );
}
