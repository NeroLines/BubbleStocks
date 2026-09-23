"use client";
import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { CurrencyDollar } from "@phosphor-icons/react";

// Live SOL balance of the connected wallet. Renders nothing until connected, so
// the nav stays clean for visitors who haven't linked a wallet yet.
export function SolBalance() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [sol, setSol] = useState<number | null>(null);

  useEffect(() => {
    if (!publicKey) { setSol(null); return; }
    let alive = true;
    const load = () => connection.getBalance(publicKey)
      .then((l) => alive && setSol(l / LAMPORTS_PER_SOL))
      .catch(() => alive && setSol(null));
    load();
    const id = setInterval(load, 30_000);
    return () => { alive = false; clearInterval(id); };
  }, [publicKey, connection]);

  if (sol === null) return null;
  return (
    <span className="hidden items-center gap-1.5 rounded-full border border-border bg-panel px-3 py-1.5 text-sm font-semibold text-ink sm:inline-flex">
      <CurrencyDollar size={15} weight="bold" className="text-brand" />
      <span className="tnum">{sol.toFixed(2)}</span> SOL
    </span>
  );
}
