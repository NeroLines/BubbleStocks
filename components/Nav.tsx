import Link from "next/link";
import { Logo } from "./Logo";
import { ConnectWallet } from "./ConnectWallet";
import { SolBalance } from "./SolBalance";
import { ThemeToggle } from "./ThemeToggle";

// Single professional top bar, used across the app. Sticky, solid, 1px underline.
export function Nav() {
  const links = [
    ["Pools", "/#pools"],
    ["Explore", "/explore"],
    ["Launch", "/launch"],
    ["Rewards", "/dividends"],
    ["How it works", "/#how"],
  ] as const;
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[color:var(--bg)]/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center"><Logo dark /></Link>
          <div className="hidden items-center gap-6 text-sm font-medium text-ink-soft md:flex">
            {links.map(([label, href]) => (
              <Link key={label} href={href} className="transition hover:text-ink">{label}</Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SolBalance />
          <ThemeToggle />
          <ConnectWallet />
        </div>
      </nav>
    </header>
  );
}
