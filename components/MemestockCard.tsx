"use client";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import type { Memestock } from "@/lib/data";
import { compact, pct, usd } from "@/lib/format";
import { Sparkline } from "./Sparkline";
import { CoinImage } from "./CoinImage";
import { CaretUp, CaretDown } from "@phosphor-icons/react";

// Card with a subtle 3D pointer tilt and a cursor-tracking spotlight. Motion
// values only (no state), so it stays smooth on scroll and mobile.
export function MemestockCard({ m }: { m: Memestock }) {
  const up = m.change24h >= 0;
  const reduce = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotX = useSpring(useTransform(py, [0, 1], [6, -6]), { stiffness: 150, damping: 18 });
  const rotY = useSpring(useTransform(px, [0, 1], [-6, 6]), { stiffness: 150, damping: 18 });
  const spotX = useTransform(px, (v) => `${v * 100}%`);
  const spotY = useTransform(py, (v) => `${v * 100}%`);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => { px.set(0.5); py.set(0.5); };

  return (
    <motion.div
      style={{ perspective: 900 }}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      <motion.div
        style={{ transformStyle: "preserve-3d", rotateX: reduce ? 0 : rotX, rotateY: reduce ? 0 : rotY }}
      >
        <Link
          href={`/token/${m.id}`}
          className="group glass relative block overflow-hidden rounded-2xl p-4 transition-shadow duration-200 hover:shadow-[0_20px_60px_rgb(12_35_64_/_0.18)]"
        >
          {/* cursor spotlight */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            style={{
              background: useTransform(
                [spotX, spotY],
                ([x, y]) => `radial-gradient(220px circle at ${x} ${y}, rgb(47 107 246 / 0.12), transparent 60%)`
              ),
            }}
          />
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <CoinImage m={m} size={38} />
              <div className="min-w-0">
                <div className="font-mono text-sm font-bold text-ink">${m.ticker}</div>
                <div className="truncate text-xs text-ink-soft">
                  {m.name} · tracks {m.stock}
                </div>
              </div>
            </div>
            <span
              className={`inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-1 font-mono text-xs font-bold ${
                up ? "bg-up/10 text-up" : "bg-down/10 text-down"
              }`}
            >
              {up ? <CaretUp size={12} weight="bold" /> : <CaretDown size={12} weight="bold" />}
              {pct(m.change24h)}
            </span>
          </div>

          <div className="mt-3">
            <Sparkline points={m.spark} up={up} w={240} h={44} />
          </div>

          <div className="mt-3 flex items-end justify-between">
            <div>
              <div className="font-mono text-lg font-bold text-ink">{usd(m.priceUsd)}</div>
              <div className="text-[11px] text-ink-soft">MCap {compact(m.mcapUsd)}</div>
            </div>
            {m.migrated ? (
              <span className="rounded-full bg-brand/10 px-2 py-1 text-[11px] font-semibold text-brand">
                Migrated
              </span>
            ) : (
              <div className="w-24">
                <div className="mb-1 text-right text-[11px] font-semibold text-ink-soft">
                  {m.bondingPct}% bonded
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-line">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${m.bondingPct}%` }} />
                </div>
              </div>
            )}
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
