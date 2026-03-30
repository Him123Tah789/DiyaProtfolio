"use client";

import type { CSSProperties, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  ACCESS_KEY,
  type LoveStore,
  initialLoveStore,
} from "@/lib/love-store";
import { fetchLoveStore } from "@/lib/love-api";

const flowerIcons = ["🌸", "🌷", "🌺", "🌹", "🌼", "🪷"];
const loveIcons = ["❤", "💗", "💖", "💘", "💕", "💞", "💓", "🩷", "💜"];
const objectIcons = ["✨", "⭐", "💫", "🎀", "🫧", "💍", "🕊️"];
const colors = [
  "#ff5f9e",
  "#a96ae0",
  "#ff7f7f",
  "#6f9dff",
  "#ff9ec7",
  "#ffb347",
  "#53c6ac",
  "#d277ff",
  "#ff6699",
];

type MovingItem = {
  id: string;
  left: string;
  top: string;
  delay: string;
  duration: string;
  size: string;
  icon: string;
  color: string;
  x1: string;
  y1: string;
  x2: string;
  y2: string;
  x3: string;
  y3: string;
  x4: string;
  y4: string;
  r1: string;
  r2: string;
  r3: string;
  r4: string;
};

const createSeededRandom = (seed: number) => {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
};

const randomRange = (random: () => number, min: number, max: number) =>
  min + (max - min) * random();

const makeFloodItems = (count: number, icons: string[]) =>
  Array.from({ length: count }).map((_, index) => ({
    id: `f-${index}`,
    left: `${(index * 13 + (index % 7) * 5) % 100}%`,
    delay: `${(index * 0.35) % 8}s`,
    duration: `${4.2 + (index % 5) * 0.85}s`,
    size: `${1 + (index % 3) * 0.35}rem`,
    icon: icons[index % icons.length],
    color: colors[index % colors.length],
  }));

const makeRandomMotionItems = (count: number, icons: string[], seed: number): MovingItem[] => {
  const random = createSeededRandom(seed);

  return Array.from({ length: count }).map((_, index) => ({
    id: `m-${index}`,
    left: `${Math.round(randomRange(random, 2, 96))}%`,
    top: `${Math.round(randomRange(random, 4, 94))}%`,
    delay: `${randomRange(random, 0, 3.5).toFixed(2)}s`,
    duration: `${randomRange(random, 4.2, 7.1).toFixed(2)}s`,
    size: `${randomRange(random, 0.95, 1.75).toFixed(2)}rem`,
    icon: icons[index % icons.length],
    color: colors[(index + 3) % colors.length],
    x1: `${Math.round(randomRange(random, -26, 26))}px`,
    y1: `${Math.round(randomRange(random, -22, 22))}px`,
    x2: `${Math.round(randomRange(random, -30, 30))}px`,
    y2: `${Math.round(randomRange(random, -30, 30))}px`,
    x3: `${Math.round(randomRange(random, -36, 36))}px`,
    y3: `${Math.round(randomRange(random, -36, 36))}px`,
    x4: `${Math.round(randomRange(random, -46, 46))}px`,
    y4: `${Math.round(randomRange(random, -46, 46))}px`,
    r1: `${Math.round(randomRange(random, -18, 18))}deg`,
    r2: `${Math.round(randomRange(random, -25, 25))}deg`,
    r3: `${Math.round(randomRange(random, -35, 35))}deg`,
    r4: `${Math.round(randomRange(random, -42, 42))}deg`,
  }));
};

const makeBloomBursts = () =>
  Array.from({ length: 18 }).map((_, index) => ({
    id: `b-${index}`,
    left: `${8 + index * 8}%`,
    top: `${10 + (index % 4) * 18}%`,
    delay: `${(index * 0.6) % 7}s`,
    duration: `${2.2 + (index % 4) * 0.7}s`,
    color: colors[index % colors.length],
  }));

const makeOrbitItems = (count: number, icons: string[]) =>
  Array.from({ length: count }).map((_, index) => ({
    id: `o-${index}`,
    left: `${(index * 11 + (index % 5) * 9) % 100}%`,
    top: `${(index * 9 + (index % 6) * 7) % 100}%`,
    delay: `${(index * 0.4) % 9}s`,
    duration: `${4.6 + (index % 6) * 0.8}s`,
    size: `${0.95 + (index % 4) * 0.32}rem`,
    icon: icons[index % icons.length],
    color: colors[(index + 2) % colors.length],
  }));

const makeBloomFlowers = () =>
  Array.from({ length: 48 }).map((_, index) => ({
    id: `bf-${index}`,
    left: `${(index * 17 + (index % 3) * 6) % 100}%`,
    top: `${(index * 7 + (index % 4) * 11) % 100}%`,
    delay: `${(index * 0.42) % 11}s`,
    duration: `${2.4 + (index % 6) * 0.62}s`,
    size: `${0.8 + (index % 4) * 0.4}rem`,
    flower: flowerIcons[index % flowerIcons.length],
    color: colors[(index + 4) % colors.length],
  }));

const nameHighlights = [
  {
    id: "name-diya",
    text: "Diya",
    left: "9%",
    top: "15%",
    duration: "7.5s",
    delay: "0.2s",
    color: "#ff3a88",
    x1: "28px",
    y1: "-30px",
    x2: "-34px",
    y2: "20px",
    x3: "36px",
    y3: "-10px",
    x4: "-24px",
    y4: "-42px",
    r1: "6deg",
    r2: "-8deg",
    r3: "11deg",
    r4: "-6deg",
  },
  {
    id: "name-himu",
    text: "Himu",
    left: "68%",
    top: "68%",
    duration: "8.2s",
    delay: "0.9s",
    color: "#9a35ff",
    x1: "-32px",
    y1: "24px",
    x2: "24px",
    y2: "-28px",
    x3: "-38px",
    y3: "18px",
    x4: "28px",
    y4: "-40px",
    r1: "-7deg",
    r2: "8deg",
    r3: "-10deg",
    r4: "7deg",
  },
] as const;

const romanticDialogs = [
  "In every version of tomorrow, I still choose you.",
  "Your smile turns ordinary moments into celebrations.",
  "No distance can dim how deeply you are cherished.",
  "You are my calm in chaos and my light in doubt.",
];

export default function LovePage() {
  const [passphrase, setPassphrase] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState("");
  const [store, setStore] = useState<LoveStore>(initialLoveStore);

  const flowerFlood = useMemo(() => makeFloodItems(60, flowerIcons), []);
  const loveFlood = useMemo(() => makeFloodItems(64, loveIcons), []);
  const blooms = useMemo(() => makeBloomBursts(), []);
  const orbitItems = useMemo(() => makeRandomMotionItems(46, objectIcons, 3016), []);
  const bloomFlowers = useMemo(() => makeBloomFlowers(), []);

  const handleUnlock = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (passphrase.trim() === ACCESS_KEY) {
      try {
        const remoteStore = await fetchLoveStore();
        setStore(remoteStore);
        setIsUnlocked(true);
        setError("");
      } catch {
        setError("Could not load online love data. Please try again.");
      }
      return;
    }

    setError("Only Diya can open this private Love page.");
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

        {nameHighlights.map((item) => (
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
        <p className="text-xs font-semibold tracking-[0.2em] text-[#8858ae] uppercase">Love</p>
        <h1 className="font-display mt-2 text-4xl font-semibold sm:text-5xl">Secret Love Page</h1>

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
              Unlock Love
            </button>
            {error && <p className="text-sm font-semibold text-[#b0366f]">{error}</p>}
          </form>
        )}

        {isUnlocked && (
          <>
            <p className="mt-6 leading-8 text-[#5f4b74]">
              Every flower here blooms for your dreams, and every heart here carries one
              message: keep going, keep growing, keep glowing. You are capable of amazing
              things, and you are deeply loved.
            </p>
            <p className="mt-4 leading-8 text-[#5f4b74]">
              This Love page will always be your private corner of encouragement. On the
              hard days and the bright days, remember your journey is beautiful.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="pulse-love inline-flex items-center rounded-full bg-[#ffe3f0] px-4 py-2 text-sm font-semibold text-[#a54179]">
                Bloom beyond limits 🌸
              </span>
              <span className="float-love inline-flex items-center rounded-full bg-[#f2e5ff] px-4 py-2 text-sm font-semibold text-[#74499a]">
                Keep shining forever 💖
              </span>
              <Link
                href="/love/edit"
                className="rounded-full border border-[#d5b2ef] bg-white/85 px-4 py-2 text-sm font-semibold text-[#6c3f96] transition hover:bg-[#f4e8ff]"
              >
                Edit Story & Pictures
              </Link>
            </div>

            <section className="mt-8 rounded-2xl bg-white/70 p-5">
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
                  No story added yet. Use Edit Story & Pictures to write your love story.
                </p>
              )}
            </section>

            <section className="mt-6 grid gap-5 md:grid-cols-2">
              <article className="rounded-2xl bg-white/70 p-5">
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
              </article>

              <article className="rounded-2xl bg-white/70 p-5">
                <h2 className="font-display text-2xl font-semibold text-[#6b3d8d]">Picture Visualization</h2>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {store.images.length === 0 && (
                    <p className="col-span-2 rounded-xl bg-white/60 p-3 text-sm text-[#6d5a82]">
                      No pictures available yet.
                    </p>
                  )}
                  {store.images.map((image) => (
                    <div key={image.id} className="rounded-xl bg-white/80 p-2">
                      <Image
                        src={image.url}
                        alt={image.caption}
                        width={220}
                        height={180}
                        unoptimized
                        className="h-32 w-full rounded-lg object-cover"
                      />
                      <p className="mt-2 text-xs text-[#704f88]">{image.caption}</p>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          </>
        )}

        <div className="mt-10 flex gap-3">
          <Link
            href="/love/edit"
            className="rounded-full border border-[#caa5e5] bg-white/75 px-5 py-2 text-sm font-semibold text-[#6a3f8b] transition hover:bg-[#f5ebff]"
          >
            Open Edit Page
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
