// Pure-SVG donut ring. Used for the 30/70 liquidity composition and the small
// split ring inside each pool bubble. Server component, no JS needed.
type Seg = { pct: number; color: string };

export function Donut({
  segments, size = 120, thickness = 14, gap = 2, children,
}: {
  segments: Seg[]; size?: number; thickness?: number; gap?: number; children?: React.ReactNode;
}) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const rings = segments.map((segment, index) => {
    const len = (segment.pct / 100) * c;
    const visible = Math.max(0, len - gap);
    const offset = segments
      .slice(0, index)
      .reduce((sum, previous) => sum + (previous.pct / 100) * c, 0);
    return { ...segment, dash: `${visible} ${c - visible}`, offset };
  });
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgb(255 255 255 / 0.35)" strokeWidth={thickness} />
        {rings.map((segment, index) => (
          <circle
            key={index}
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke={segment.color} strokeWidth={thickness}
            strokeDasharray={segment.dash} strokeDashoffset={-segment.offset} strokeLinecap="round"
          />
        ))}
      </svg>
      {children && <div className="absolute inset-0 grid place-items-center text-center">{children}</div>}
    </div>
  );
}
