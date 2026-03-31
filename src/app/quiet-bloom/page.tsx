"use client";

import type { CSSProperties, FormEvent } from "react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { ACCESS_KEY, type LoveStore, initialLoveStore } from "@/lib/love-store";
import { fetchLoveStore } from "@/lib/love-api";
import {
  flowerIcons,
  loveIcons,
  makeBloomBursts,
  makeBloomFlowers,
  makeFloodItems,
  makeNameBits,
  makeRandomMotionItems,
  objectIcons,
} from "@/lib/love-decor";

const romanticDialogs = [
  "In every version of tomorrow, I still choose you.",
  "Your smile turns ordinary moments into celebrations.",
  "No distance can dim how deeply you are cherished.",
  "You are my calm in chaos and my light in doubt.",
];

export default function QuietBloomPage() {
  const [passphrase, setPassphrase] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState("");
  const [store, setStore] = useState<LoveStore>(initialLoveStore);

  const flowerFlood = useMemo(() => makeFloodItems(60, flowerIcons), []);
  const loveFlood = useMemo(() => makeFloodItems(64, loveIcons), []);
  const blooms = useMemo(() => makeBloomBursts(), []);
  const orbitItems = useMemo(() => makeRandomMotionItems(46, objectIcons, 3016), []);
  const bloomFlowers = useMemo(() => makeBloomFlowers(), []);
  const nameBits = useMemo(() => makeNameBits(132, 8128), []);

  const handleUnlock = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (passphrase.trim() === ACCESS_KEY) {
      try {
        const remoteStore = await fetchLoveStore();
        setStore(remoteStore);
        setIsUnlocked(true);
        setError("");
      } catch {
        setError("Could not load story data. Please try again.");
      }
      return;
    }

    setError("Only Diya can open this private page.");
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#fff7fd] via-[#f7ecff] to-[#ffeef8]" />

      {blooms.map((bloom) => (
        <span
          key={bloom.id}
          className="bloom-burst pointer-events-none absolute h-28 w-28 rounded-full"
          style={{
            left: bloom.left,
            top: bloom.top,
            animationDelay: bloom.delay,
            animationDuration: bloom.duration,
            background: `radial-gradient(circle, ${bloom.color} 0%, transparent 65%)`,
          }}
        />
      ))}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {orbitItems.map((item) => (
          <span
            key={item.id}
            className="random-wander absolute opacity-80"
            style={
              {
                left: item.left,
                top: item.top,
                animationDelay: item.delay,
                animationDuration: item.duration,
                fontSize: item.size,
                color: item.color,
                textShadow: "0 8px 20px rgba(235, 120, 170, 0.32)",
                "--x1": item.x1,
                "--y1": item.y1,
                "--x2": item.x2,
                "--y2": item.y2,
                "--x3": item.x3,
                "--y3": item.y3,
                "--x4": item.x4,
                "--y4": item.y4,
                "--r1": item.r1,
                "--r2": item.r2,
                "--r3": item.r3,
                "--r4": item.r4,
              } as CSSProperties
            }
          >
            {item.icon}
          </span>
        ))}

        {nameBits.map((item) => (
          <span
            key={item.id}
            className="love-name-highlight random-wander absolute"
            style={
              {
                left: item.left,
                top: item.top,
                animationDelay: item.delay,
                animationDuration: item.duration,
                color: item.color,
                opacity: 0.55,
                letterSpacing: "0.06em",
                fontSize: item.size,
                "--x1": item.x1,
                "--y1": item.y1,
                "--x2": item.x2,
                "--y2": item.y2,
                "--x3": item.x3,
                "--y3": item.y3,
                "--x4": item.x4,
                "--y4": item.y4,
                "--r1": item.r1,
                "--r2": item.r2,
                "--r3": item.r3,
                "--r4": item.r4,
              } as CSSProperties
            }
          >
            {item.text}
          </span>
        ))}

        {bloomFlowers.map((item) => (
          <span
            key={item.id}
            className="bloom-flower absolute opacity-65"
            style={{
              left: item.left,
              top: item.top,
              animationDelay: item.delay,
              animationDuration: item.duration,
              fontSize: item.size,
              color: item.color,
              textShadow: "0 7px 16px rgba(255, 145, 198, 0.3)",
            }}
          >
            {item.flower}
          </span>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0">
        {flowerFlood.map((item) => (
          <span
            key={item.id}
            className="flood-rise flood-wave absolute opacity-75"
            style={{
              left: item.left,
              bottom: "-8rem",
              animationDelay: item.delay,
              animationDuration: item.duration,
              fontSize: item.size,
              color: item.color,
              textShadow: "0 6px 16px rgba(255, 149, 193, 0.35)",
            }}
          >
            {item.icon}
          </span>
        ))}
        {loveFlood.map((item) => (
          <span
            key={item.id}
            className="flood-rise flood-wave absolute opacity-80"
            style={{
              left: item.left,
              bottom: "-8rem",
              animationDelay: item.delay,
              animationDuration: `${Number.parseFloat(item.duration) + 0.7}s`,
              fontSize: item.size,
              color: item.color,
              textShadow: "0 6px 16px rgba(255, 149, 193, 0.35)",
            }}
          >
            {item.icon}
          </span>
        ))}
      </div>

      <article className="glass soft-shadow relative z-10 mx-auto mt-4 w-full max-w-4xl rounded-3xl p-7 sm:p-10">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#8858ae] uppercase">Quiet Bloom</p>
        <h1 className="font-display mt-2 text-4xl font-semibold sm:text-5xl">Story and Romantic Notes</h1>

        {!isUnlocked && (
          <form onSubmit={handleUnlock} className="mt-7 max-w-md space-y-3">
            <p className="text-sm leading-7 text-[#5f4b74]">
              Enter your private passphrase to unlock this page.
            </p>
            <input
              value={passphrase}
              onChange={(event) => setPassphrase(event.target.value)}
              type="password"
              placeholder="Passphrase"
              className="w-full rounded-xl border border-[#dec7f4] bg-white/85 px-4 py-2 outline-none ring-[#b98fda] focus:ring"
            />
            <button className="rounded-full bg-[#a478d1] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#8d59b8]">
              Unlock Page
            </button>
            {error && <p className="text-sm font-semibold text-[#b0366f]">{error}</p>}
          </form>
        )}

        {isUnlocked && (
          <>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/love/edit"
                className="rounded-full border border-[#d5b2ef] bg-white/85 px-4 py-2 text-sm font-semibold text-[#6c3f96] transition hover:bg-[#f4e8ff]"
              >
                Edit Story and Memories
              </Link>
              <Link
                href="/love"
                className="rounded-full border border-[#d5b2ef] bg-white/85 px-4 py-2 text-sm font-semibold text-[#6c3f96] transition hover:bg-[#f4e8ff]"
              >
                Open Picture Page
              </Link>
            </div>

            <section className="mt-6 rounded-2xl bg-white/70 p-5">
              <h2 className="font-display text-2xl font-semibold text-[#6b3d8d]">Romantic Poem</h2>
              <p className="mt-3 text-sm leading-8 text-[#604a77]">
                If love were a garden, your name would be spring,
                every petal a promise, every breeze a song to sing.
                In the quiet of night and the glow of day,
                my heart keeps finding you, in every possible way.
              </p>
            </section>

            <section className="mt-6 rounded-2xl bg-white/70 p-5">
              <h2 className="font-display text-2xl font-semibold text-[#6b3d8d]">Romantic Dialogs</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {romanticDialogs.map((line) => (
                  <p key={line} className="rounded-xl bg-[#fff3fa] px-4 py-3 text-sm text-[#7a4a68]">
                    {line}
                  </p>
                ))}
              </div>
            </section>

            <section className="mt-6 rounded-2xl bg-white/70 p-5">
              <h2 className="font-display text-2xl font-semibold text-[#6b3d8d]">Our Story</h2>
              {store.story ? (
                <p className="mt-3 whitespace-pre-line text-sm leading-8 text-[#604a77]">{store.story}</p>
              ) : (
                <p className="mt-3 rounded-xl bg-white/65 p-3 text-sm text-[#6d5a82]">
                  No story added yet. Use Edit Story and Memories to write your love story.
                </p>
              )}
            </section>

            <section className="mt-6 rounded-2xl bg-white/70 p-5">
              <h2 className="font-display text-2xl font-semibold text-[#6b3d8d]">Sweet Memories</h2>
              <ul className="mt-4 space-y-2">
                {store.memories.length === 0 && (
                  <li className="rounded-xl bg-white/60 p-3 text-sm text-[#6d5a82]">
                    No memories added yet.
                  </li>
                )}
                {store.memories.map((memory) => (
                  <li key={memory.id} className="rounded-xl bg-white/80 p-3">
                    <p className="text-sm text-[#6a507f]">{memory.text}</p>
                    <span className="mt-2 block text-xs text-[#8b6ca4]">
                      {new Date(memory.createdAt).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}

        <div className="mt-10 flex gap-3">
          <Link
            href="/love"
            className="rounded-full border border-[#caa5e5] bg-white/75 px-5 py-2 text-sm font-semibold text-[#6a3f8b] transition hover:bg-[#f5ebff]"
          >
            Open Picture Page
          </Link>
          <Link
            href="/"
            className="rounded-full border border-[#c9a7e8] bg-white/75 px-5 py-2 text-sm font-semibold text-[#603b80] transition hover:bg-[#f5ebff]"
          >
            Return to DiyaVerse
          </Link>
        </div>
      </article>
    </div>
  );
}
