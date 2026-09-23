// Iridescent soap bubbles drifting upward — the BubbleStocks brand in motion.
// Deterministic props (no Math.random) so server + client markup match.
const BUBBLES = [
  { left: 6, size: 64, dur: 20, delay: 0 },
  { left: 16, size: 30, dur: 15, delay: -6 },
  { left: 27, size: 90, dur: 26, delay: -12 },
  { left: 38, size: 22, dur: 13, delay: -3 },
  { left: 47, size: 52, dur: 22, delay: -16 },
  { left: 58, size: 36, dur: 17, delay: -8 },
  { left: 67, size: 74, dur: 24, delay: -19 },
  { left: 76, size: 26, dur: 14, delay: -2 },
  { left: 84, size: 46, dur: 21, delay: -11 },
  { left: 92, size: 34, dur: 16, delay: -5 },
  { left: 12, size: 40, dur: 19, delay: -14 },
  { left: 52, size: 24, dur: 12, delay: -9 },
  { left: 72, size: 58, dur: 23, delay: -21 },
  { left: 34, size: 32, dur: 18, delay: -7 },
];

export function FloatingBubbles({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="soap-bubble"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            animationDuration: `${b.dur}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
