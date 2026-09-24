// BubbleStocks nav lockup: the "B" bubble icon (Favicon 2) + wordmark.
export function Logo({ size = 38, withWord = true, dark = false }: { size?: number; withWord?: boolean; dark?: boolean }) {
  void dark;
  return (
    <span className="inline-flex items-center gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/logo-icon.png"
        alt="BubbleStocks"
        width={size} height={size}
        className="select-none rounded-full shadow-[0_2px_10px_rgba(80,140,255,0.4)]"
        style={{ height: size, width: size }}
      />
      {withWord && <span className="hidden font-display text-[1.2rem] font-bold tracking-tight text-ink min-[480px]:inline">BubbleStocks</span>}
    </span>
  );
}
