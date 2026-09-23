"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Wallet, SignOut } from "@phosphor-icons/react";

// Real wallet button on top of @solana/wallet-adapter. Not connected → opens the
// wallet-select modal (Phantom / Solflare / Backpack, auto-detected). Connected →
// shows the short address; click to disconnect.
export function ConnectWallet() {
  const { publicKey, connected, disconnect, connecting } = useWallet();
  const { setVisible } = useWalletModal();

  if (connected && publicKey) {
    const a = publicKey.toBase58();
    return (
      <button
        onClick={() => disconnect()}
        title="Disconnect"
        className="group inline-flex items-center gap-2 rounded-full border border-border bg-panel px-4 py-2 text-sm font-semibold text-ink transition hover:border-[color:var(--border-strong)] active:scale-[0.98]"
      >
        <Wallet size={16} weight="fill" className="group-hover:hidden" />
        <SignOut size={16} weight="bold" className="hidden group-hover:inline" />
        <span className="tnum">{a.slice(0, 4)}…{a.slice(-4)}</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => setVisible(true)}
      disabled={connecting}
      className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[color:var(--accent-strong)] active:scale-[0.98] disabled:opacity-60"
    >
      <Wallet size={16} weight="fill" />
      {connecting ? "Connecting…" : "Connect Wallet"}
    </button>
  );
}
