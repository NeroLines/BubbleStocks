import type { ReactNode } from "react";

export function BrandPageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="brand-page-hero overflow-hidden rounded-[2rem] border px-6 py-8 sm:px-8 sm:py-10">
      <span aria-hidden className="brand-page-bubble brand-page-bubble-a" />
      <span aria-hidden className="brand-page-bubble brand-page-bubble-b" />
      <div className={`relative z-10 grid items-center gap-7 ${children ? "lg:grid-cols-[1fr_0.72fr]" : ""}`}>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">{eyebrow}</p>
          <h1 className="mt-3 max-w-2xl text-balance font-display text-3xl font-extrabold tracking-[-0.035em] text-ink sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-ink-soft sm:text-lg">{description}</p>
        </div>
        {children && <div className="relative min-h-36">{children}</div>}
      </div>
    </section>
  );
}
