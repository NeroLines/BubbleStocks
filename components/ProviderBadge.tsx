import type { Provider } from "@/lib/data";

const META: Record<Provider, { label: string; src: string }> = {
  teslax: { label: "teslax", src: "/brand/providers/teslax.svg" },
  prestock: { label: "prestock", src: "/brand/providers/prestock.svg" },
  Tessera: { label: "Tessera", src: "/brand/providers/tessera.svg" },
};

export function ProviderBadge({ provider, compact = false }: { provider: Provider; compact?: boolean }) {
  const meta = META[provider];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-panel/75 px-2 py-1 text-[11px] font-semibold text-ink-soft shadow-sm backdrop-blur-md">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={meta.src} alt="" width={16} height={16} className="h-4 w-4 rounded-full" />
      {!compact && meta.label}
    </span>
  );
}
