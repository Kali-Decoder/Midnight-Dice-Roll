"use client";

import { useState } from "react";
import { DicePair } from "@/components/Dice";
import { Toast } from "@/components/Toast";
import { rollDice, RollResponse } from "@/lib/api";
import { classNames, truncateHash } from "@/lib/utils";
import { Dices, ShieldCheck, Sparkles, Timer, RefreshCcw } from "lucide-react";

type RollEntry = RollResponse & { timestamp: string };

const DEFAULT_ROLL: RollResponse = {
  rollId: 0,
  dieOne: 1,
  dieTwo: 1,
  total: 2,
  txId: "",
};

export default function Home() {
  const [rolling, setRolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRoll, setLastRoll] = useState<RollEntry | null>(null);
  const [history, setHistory] = useState<RollEntry[]>([]);

  const activeRoll = lastRoll ?? { ...DEFAULT_ROLL, timestamp: "" };

  const handleRoll = async () => {
    try {
      setRolling(true);
      setError(null);

      const result = await rollDice();
      const entry: RollEntry = {
        ...result,
        timestamp: new Date().toLocaleTimeString(),
      };

      setLastRoll(entry);
      setHistory((prev) => [entry, ...prev].slice(0, 6));
    } catch (err: any) {
      console.error(err);
      setError("Roll failed. Check the server connection and try again.");
    } finally {
      setRolling(false);
    }
  };

  return (
    <main className="min-h-screen relative flex flex-col px-4 sm:px-6 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto w-full">
        <header className="flex flex-col gap-6 sm:gap-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 w-fit mx-auto sm:mx-0">
            <Sparkles className="w-4 h-4 text-brand-amber" />
            <span className="text-xs uppercase tracking-[0.35em] text-white/60">
              Midnight Dice Roll
            </span>
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-white">
              Roll dice, record it on-chain, show it in real time.
            </h1>
            <p className="text-white/60 text-base sm:text-lg max-w-2xl">
              A clean, visual demo of the new DiceRoll contract. Each roll generates fresh entropy,
              derives two dice values, and anchors the outcome on Midnight.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
            <button
              onClick={handleRoll}
              disabled={rolling}
              className={classNames(
                "px-8 py-4 rounded-2xl font-semibold tracking-[0.2em] uppercase text-sm flex items-center gap-3 transition-all",
                "bg-gradient-to-r from-brand-amber via-brand-gold to-brand-teal text-black shadow-[0_12px_30px_rgba(251,191,36,0.3)]",
                rolling ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02] active:scale-95"
              )}
            >
              <Dices className={classNames("w-5 h-5", rolling ? "animate-spin" : "")} />
              {rolling ? "Rolling..." : "Roll Dice"}
            </button>
            <div className="inline-flex items-center gap-2 text-xs text-white/50">
              <ShieldCheck className="w-4 h-4 text-brand-teal" />
              Network: Preprod
            </div>
          </div>
        </header>

        <section className="mt-12 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Live Roll</h2>
                <p className="text-sm text-white/50">Dice outcomes update as soon as the tx lands.</p>
              </div>
              <div className="inline-flex items-center gap-2 text-xs text-white/40">
                <Timer className="w-4 h-4" />
                {activeRoll.timestamp || "Waiting for roll"}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-8">
              <DicePair dieOne={activeRoll.dieOne} dieTwo={activeRoll.dieTwo} rolling={rolling} />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/40">Total</p>
                  <p className="text-3xl font-semibold mt-2 text-brand-amber">{activeRoll.total}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/40">Roll ID</p>
                  <p className="text-xl font-semibold mt-2 text-white">
                    {activeRoll.rollId ? `#${activeRoll.rollId}` : "—"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/40">Tx ID</p>
                  <p className="text-sm font-mono mt-2 text-white/70" title={activeRoll.txId}>
                    {activeRoll.txId ? truncateHash(activeRoll.txId) : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-6">
              <h3 className="text-lg font-semibold">Recent Rolls</h3>
              <p className="text-sm text-white/50">Most recent results captured by this session.</p>
              <div className="mt-4 flex flex-col gap-3">
                {history.length === 0 && (
                  <div className="text-sm text-white/40 border border-white/10 rounded-2xl px-4 py-3">
                    Roll the dice to populate history.
                  </div>
                )}
                {history.map((entry) => (
                  <div
                    key={`${entry.rollId}-${entry.txId}`}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-white/50">#{entry.rollId}</span>
                      <span className="text-lg font-semibold text-white">
                        {entry.dieOne} + {entry.dieTwo}
                      </span>
                    </div>
                    <div className="text-sm text-brand-amber">{entry.total}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold">How it works</h3>
              <div className="mt-4 grid grid-cols-1 gap-4">
                {[
                  {
                    title: "Entropy",
                    text: "The server generates a 32-byte secret and maps it to two dice values.",
                  },
                  {
                    title: "On-chain record",
                    text: "The DiceRoll contract stores the pair and updates roll history.",
                  },
                  {
                    title: "Instant UI",
                    text: "The frontend pulls the response and renders the dice animation.",
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/40">{item.title}</p>
                    <p className="mt-2 text-sm text-white/70">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-white/50">
          <div>
            Built on Midnight. Dice rolls are recorded via `roll_dice` calls.
          </div>
          <button
            onClick={() => {
              setLastRoll(null);
              setHistory([]);
            }}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white transition"
          >
            <RefreshCcw className="w-4 h-4" />
            Reset Session
          </button>
        </section>
      </div>

      <Toast message={error} onClose={() => setError(null)} />
    </main>
  );
}
