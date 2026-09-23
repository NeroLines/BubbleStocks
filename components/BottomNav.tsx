"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { RocketLaunch, MagnifyingGlass, Stack, Gift, Wallet } from "@phosphor-icons/react";

// Mobile bottom tab bar (partner mockup). The clearest possible "where do I do
// what" on a phone: five destinations, always visible, active state highlighted.
const TABS = [
  { label: "Launch", href: "/launch", icon: RocketLaunch },
  { label: "Explore", href: "/explore", icon: MagnifyingGlass },
  { label: "Pools", href: "/#pools", icon: Stack },
  { label: "Rewards", href: "/dividends", icon: Gift },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  const isActive = (href: string) =>
    href === "/#pools" ? pathname.startsWith("/pools") : pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-[color:var(--bg)]/90 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="mx-auto grid max-w-md grid-cols-5">
        {TABS.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link key={label} href={href}
              className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold transition ${active ? "text-brand" : "text-ink-soft"}`}>
              <Icon size={22} weight={active ? "fill" : "regular"} />
              {label}
            </Link>
          );
        })}
        <button
          onClick={() => setVisible(true)}
          className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold transition ${connected ? "text-brand" : "text-ink-soft"}`}>
          <Wallet size={22} weight={connected ? "fill" : "regular"} />
          {connected && publicKey ? `${publicKey.toBase58().slice(0, 4)}…` : "Wallet"}
        </button>
      </div>
    </nav>
  );
}
