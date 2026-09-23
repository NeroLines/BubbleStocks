import { Nav } from "@/components/Nav";
import { LaunchForm } from "@/components/LaunchForm";

export default function LaunchPage() {
  return (
    <main className="min-h-[100dvh] bg-surface-2">
      <Nav />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink md:text-4xl">
          Launch a memestock
        </h1>
        <p className="mt-2 max-w-xl text-ink-soft">
          Configure it, launch it on the Meteora bonding curve. You sign the transaction.
        </p>
        <div className="mt-8">
          <LaunchForm />
        </div>
      </div>
    </main>
  );
}
