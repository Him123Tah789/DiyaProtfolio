"use client";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";

const ACCESS_KEY = "DiyaHimu127";
const LOVE_STORAGE_KEY = "diyaverse-love-v1";

type MemoryEntry = {
  id: string;
  text: string;
  createdAt: string;
};

type LoveImage = {
  id: string;
  dataUrl: string;
  caption: string;
  createdAt: string;
};

type LoveStore = {
  memories: MemoryEntry[];
  images: LoveImage[];
};

const initialLoveStore: LoveStore = {
  memories: [],
  images: [],
};

const flowerIcons = ["🌸", "🌷", "🌺", "🌹", "🌼", "🪷"];
const loveIcons = ["❤", "💗", "💖", "💘", "💕", "💞", "💓", "🩷", "💜"];
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

const makeFloodItems = (count: number, icons: string[]) =>
  Array.from({ length: count }).map((_, index) => ({
    id: `f-${index}`,
    left: `${(index * 13 + (index % 7) * 5) % 100}%`,
    delay: `${(index * 0.35) % 8}s`,
    duration: `${8 + (index % 7)}s`,
    size: `${1 + (index % 3) * 0.35}rem`,
    icon: icons[index % icons.length],
    color: colors[index % colors.length],
  }));

const makeBloomBursts = () =>
  Array.from({ length: 12 }).map((_, index) => ({
    id: `b-${index}`,
    left: `${8 + index * 8}%`,
    top: `${10 + (index % 4) * 18}%`,
    delay: `${(index * 0.6) % 7}s`,
    duration: `${4 + (index % 4)}s`,
    color: colors[index % colors.length],
  }));

const toDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read image."));
    reader.readAsDataURL(file);
  });

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
  const [memoryText, setMemoryText] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [store, setStore] = useState<LoveStore>(() => {
    if (typeof window === "undefined") {
      return initialLoveStore;
    }

    const saved = window.localStorage.getItem(LOVE_STORAGE_KEY);
    if (!saved) {
      return initialLoveStore;
    }

    try {
      const parsed = JSON.parse(saved) as LoveStore;
      return {
        memories: parsed.memories ?? [],
        images: parsed.images ?? [],
      };
    } catch {
      return initialLoveStore;
    }
  });

  const flowerFlood = useMemo(() => makeFloodItems(44, flowerIcons), []);
  const loveFlood = useMemo(() => makeFloodItems(46, loveIcons), []);
  const blooms = useMemo(() => makeBloomBursts(), []);

  useEffect(() => {
    if (!isUnlocked) {
      return;
    }

    window.localStorage.setItem(LOVE_STORAGE_KEY, JSON.stringify(store));
  }, [store, isUnlocked]);

  const handleUnlock = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (passphrase.trim() === ACCESS_KEY) {
      setIsUnlocked(true);
      setError("");
      return;
    }

    setError("Only Diya can open this private Love page.");
  };

  const handleAddMemory = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!memoryText.trim()) {
      return;
    }

    const newMemory: MemoryEntry = {
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      text: memoryText.trim(),
      createdAt: new Date().toISOString(),
    };

    setStore((current) => ({
      ...current,
      memories: [newMemory, ...current.memories],
    }));
    setMemoryText("");
  };

  const handleUploadImages = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    const uploaded: LoveImage[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        continue;
      }

      const dataUrl = await toDataUrl(file);
      uploaded.push({
        id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
        dataUrl,
        caption: imageCaption.trim() || "Our beautiful memory",
        createdAt: new Date().toISOString(),
      });
    }

    if (uploaded.length > 0) {
      setStore((current) => ({
        ...current,
        images: [...uploaded, ...current.images],
      }));
    }

    setImageCaption("");
    event.target.value = "";
  };

  const removeMemory = (id: string) => {
    setStore((current) => ({
      ...current,
      memories: current.memories.filter((item) => item.id !== id),
    }));
  };

  const removeImage = (id: string) => {
    setStore((current) => ({
      ...current,
      images: current.images.filter((item) => item.id !== id),
    }));
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
              animationDuration: `${Number.parseFloat(item.duration) + 1.8}s`,
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

            <section className="mt-6 grid gap-5 md:grid-cols-2">
              <article className="rounded-2xl bg-white/70 p-5">
                <h2 className="font-display text-2xl font-semibold text-[#6b3d8d]">Our Memories</h2>
                <form onSubmit={handleAddMemory} className="mt-4 space-y-3">
                  <textarea
                    value={memoryText}
                    onChange={(event) => setMemoryText(event.target.value)}
                    rows={4}
                    placeholder="Write a sweet memory..."
                    className="w-full rounded-xl border border-[#dec7f4] bg-white/85 px-4 py-3 outline-none ring-[#b98fda] focus:ring"
                  />
                  <button className="rounded-full bg-[#a478d1] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#8d59b8]">
                    Save Memory
                  </button>
                </form>

                <ul className="mt-4 space-y-2">
                  {store.memories.length === 0 && (
                    <li className="rounded-xl bg-white/60 p-3 text-sm text-[#6d5a82]">
                      No memory yet. Start writing your story.
                    </li>
                  )}
                  {store.memories.map((memory) => (
                    <li key={memory.id} className="rounded-xl bg-white/80 p-3">
                      <p className="text-sm text-[#6a507f]">{memory.text}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-[#8b6ca4]">
                          {new Date(memory.createdAt).toLocaleString()}
                        </span>
                        <button
                          onClick={() => removeMemory(memory.id)}
                          className="rounded-full border border-[#f0bfd8] bg-white px-3 py-1 text-xs font-semibold text-[#a44a73]"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-2xl bg-white/70 p-5">
                <h2 className="font-display text-2xl font-semibold text-[#6b3d8d]">Picture Vault</h2>
                <p className="mt-2 text-sm text-[#5f4b74]">Store pictures of us and keep them here.</p>
                <input
                  value={imageCaption}
                  onChange={(event) => setImageCaption(event.target.value)}
                  placeholder="Caption for uploaded images"
                  className="mt-3 w-full rounded-xl border border-[#dec7f4] bg-white/85 px-4 py-2 outline-none ring-[#b98fda] focus:ring"
                />
                <label className="mt-3 inline-block cursor-pointer rounded-full bg-[#a478d1] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#8d59b8]">
                  Upload Pictures
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleUploadImages}
                    className="hidden"
                  />
                </label>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {store.images.length === 0 && (
                    <p className="col-span-2 rounded-xl bg-white/60 p-3 text-sm text-[#6d5a82]">
                      No pictures uploaded yet.
                    </p>
                  )}
                  {store.images.map((image) => (
                    <div key={image.id} className="rounded-xl bg-white/80 p-2">
                      <Image
                        src={image.dataUrl}
                        alt={image.caption}
                        width={220}
                        height={180}
                        unoptimized
                        className="h-32 w-full rounded-lg object-cover"
                      />
                      <p className="mt-2 text-xs text-[#704f88]">{image.caption}</p>
                      <button
                        onClick={() => removeImage(image.id)}
                        className="mt-2 rounded-full border border-[#f0bfd8] bg-white px-3 py-1 text-xs font-semibold text-[#a44a73]"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          </>
        )}

        <div className="mt-10 flex gap-3">
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
