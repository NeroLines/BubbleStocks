import { ArrowsClockwise, Gift, TrendUp } from "@phosphor-icons/react/dist/ssr";

type Story = "explore" | "launch" | "rewards";

const Mascot = ({ src, className = "" }: { src: string; className?: string }) => (
  // Decorative token art; the surrounding page copy carries the meaning.
  // eslint-disable-next-line @next/next/no-img-element
  <img src={src} alt="" width={46} height={46} className={`story-mascot ${className}`} />
);

export function BrandStoryVisual({ variant }: { variant: Story }) {
  if (variant === "explore") {
    return (
      <div className="brand-story story-explore" aria-hidden>
        <span className="story-ambient story-ambient-a" />
        <span className="story-ambient story-ambient-b" />
        <svg className="story-wires" viewBox="0 0 420 180" preserveAspectRatio="none">
          <path d="M76 119 C130 50 202 42 273 81" />
          <path d="M196 143 C255 160 320 140 355 99" />
        </svg>
        <div className="story-pool story-pool-main">
          <span>TSLA/USDC</span><strong>$4.8M</strong><small>shared liquidity</small>
          <Mascot src="/coins/cat.jpg" className="story-token story-token-a" />
          <Mascot src="/coins/frog.jpg" className="story-token story-token-b" />
          <Mascot src="/coins/dog.jpg" className="story-token story-token-c" />
        </div>
        <div className="story-pool story-pool-small story-pool-left"><span>NVDA</span><strong>$3.2M</strong></div>
        <div className="story-pool story-pool-small story-pool-right"><span>GOOGL</span><strong>$2.8M</strong></div>
        <span className="story-live"><i /> live pool network</span>
      </div>
    );
  }

  if (variant === "launch") {
    return (
      <div className="brand-story story-launch" aria-hidden>
        <svg className="story-wires story-launch-wires" viewBox="0 0 420 180" preserveAspectRatio="none">
          <path d="M210 79 V103 C210 116 94 108 94 129" />
          <path d="M210 79 V129" />
          <path d="M210 103 C210 116 326 108 326 129" />
        </svg>
        <div className="story-main-pair">
          <span>MAIN PAIR</span><strong>MEME / STOCK</strong><small>50% minimum locked</small>
        </div>
        {[
          ["TSLA", "story-destination-a"],
          ["NVDA", "story-destination-b"],
          ["AAPL", "story-destination-c"],
        ].map(([stock, cls], index) => (
          <div className={`story-destination ${cls}`} key={stock}>
            <i>0{index + 1}</i><strong>{stock}</strong><span>/ USDC</span>
          </div>
        ))}
        <span className="story-compound"><ArrowsClockwise size={13} weight="bold" /> fees compound</span>
      </div>
    );
  }

  return (
    <div className="brand-story story-rewards" aria-hidden>
      <span className="story-ambient story-ambient-a" />
      <div className="story-fee-pool">
        <ArrowsClockwise size={24} weight="bold" />
        <strong>Shared pool</strong><span>fee engine</span>
      </div>
      <div className="story-reward-stream">
        <i /><i /><i />
        <TrendUp size={17} weight="bold" />
      </div>
      <div className="story-holder-cluster">
        <Mascot src="/coins/cat.jpg" />
        <Mascot src="/coins/frog.jpg" />
        <Mascot src="/coins/dog.jpg" />
        <span><Gift size={14} weight="fill" /> holder reflections</span>
      </div>
    </div>
  );
}
