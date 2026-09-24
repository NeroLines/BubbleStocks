import { Nav } from "@/components/Nav";
import { LaunchForm } from "@/components/LaunchForm";
import { BrandPageHeader } from "@/components/BrandPageHeader";
import { BrandStoryVisual } from "@/components/BrandStoryVisual";

export default function LaunchPage() {
  return (
    <main className="min-h-[100dvh] bg-bg">
      <Nav />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <BrandPageHeader
          eyebrow="Create on Solana"
          title="Launch a BubbleStock"
          description="Build the identity, choose where fees compound, then launch on the Meteora bonding curve. You sign the transaction."
        >
          <BrandStoryVisual variant="launch" />
        </BrandPageHeader>
        <div className="mt-8">
          <LaunchForm />
        </div>
      </div>
    </main>
  );
}
