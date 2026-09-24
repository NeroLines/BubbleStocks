import { Nav } from "@/components/Nav";
import { ExploreGrid } from "@/components/ExploreGrid";
import { BrandPageHeader } from "@/components/BrandPageHeader";
import { BrandStoryVisual } from "@/components/BrandStoryVisual";
import { getMemestocks } from "@/lib/data";

export default async function ExplorePage() {
  const stocks = await getMemestocks();
  return (
    <main className="min-h-[100dvh] bg-bg">
      <Nav />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <BrandPageHeader
          eyebrow="Live market directory"
          title="Find the bubbles moving liquidity."
          description="Every BubbleStock live on the curve or migrated to DAMM v2. Search by meme or stock, then follow where its liquidity compounds."
        >
          <BrandStoryVisual variant="explore" />
        </BrandPageHeader>
        <ExploreGrid items={stocks} />
      </div>
    </main>
  );
}
