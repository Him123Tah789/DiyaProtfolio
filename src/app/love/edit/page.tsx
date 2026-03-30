"use client";

import type { ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  ACCESS_KEY,
  createId,
  type LoveImage,
  type LoveStore,
  initialLoveStore,
  loadLoveStore,
  saveLoveStore,
} from "@/lib/love-store";

const toDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read image."));
    reader.readAsDataURL(file);
  });

export default function LoveEditPage() {
  const [passphrase, setPassphrase] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState("");

  const [store, setStore] = useState<LoveStore>(initialLoveStore);
  const [storyDraft, setStoryDraft] = useState("");
  const [memoryText, setMemoryText] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [status, setStatus] = useState("");

  const updateStore = (updater: (current: LoveStore) => LoveStore) => {
    setStore((current) => {
      const next = updater(current);
      if (isUnlocked) {
        saveLoveStore(next);
      }
      return next;
    });
  };

  const handleSaveAll = () => {
    saveLoveStore(store);
    setStatus("All changes saved.");
  };

  const handleUnlock = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (passphrase.trim() === ACCESS_KEY) {
      const loaded = loadLoveStore();
      setStore(loaded);
      setStoryDraft(loaded.story);
      setIsUnlocked(true);
      setError("");
      setStatus("Love data loaded.");
      return;
    }

    setError("Wrong passphrase. Only Diya can edit this page.");
  };

  const handleSaveStory = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateStore((current) => ({
      ...current,
      story: storyDraft.trim(),
    }));
    setStatus("Story saved successfully.");
  };

  const handleAddMemory = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!memoryText.trim()) {
      return;
    }

    updateStore((current) => ({
      ...current,
      memories: [
        {
          id: createId(),
          text: memoryText.trim(),
          createdAt: new Date().toISOString(),
        },
        ...current.memories,
      ],
    }));
    setMemoryText("");
    setStatus("Memory added.");
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
        id: createId(),
        dataUrl,
        caption: imageCaption.trim() || "Our beautiful memory",
        createdAt: new Date().toISOString(),
      });
    }

    if (uploaded.length > 0) {
      updateStore((current) => ({
        ...current,
        images: [...uploaded, ...current.images],
      }));
      setStatus(`${uploaded.length} image(s) added.`);
    }

    setImageCaption("");
    event.target.value = "";
  };

  const removeMemory = (id: string) => {
    updateStore((current) => ({
      ...current,
      memories: current.memories.filter((item) => item.id !== id),
    }));
    setStatus("Memory removed.");
  };

  const removeImage = (id: string) => {
    updateStore((current) => ({
      ...current,
      images: current.images.filter((item) => item.id !== id),
    }));
    setStatus("Image removed.");
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#fff7fd] via-[#f7ecff] to-[#ffeef8]" />

      <article className="glass soft-shadow relative z-10 mx-auto mt-4 w-full max-w-4xl rounded-3xl p-7 sm:p-10">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#8858ae] uppercase">Love Admin</p>
        <h1 className="font-display mt-2 text-4xl font-semibold sm:text-5xl">Edit Love Page</h1>

        {!isUnlocked && (
          <form onSubmit={handleUnlock} className="mt-7 max-w-md space-y-3">
            <p className="text-sm leading-7 text-[#5f4b74]">Enter your private passphrase to edit this page.</p>
            <input
              value={passphrase}
              onChange={(event) => setPassphrase(event.target.value)}
              type="password"
              placeholder="Passphrase"
              className="w-full rounded-xl border border-[#dec7f4] bg-white/85 px-4 py-2 outline-none ring-[#b98fda] focus:ring"
            />
            <button className="rounded-full bg-[#a478d1] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#8d59b8]">
              Unlock Editor
            </button>
            {error && <p className="text-sm font-semibold text-[#b0366f]">{error}</p>}
          </form>
        )}

        {isUnlocked && (
          <>
            <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl bg-white/70 p-4">
              <p className="text-sm text-[#5f4b74]">
                Changes are auto-saved. You can also press Save All Changes anytime.
              </p>
              <button
                onClick={handleSaveAll}
                className="rounded-full bg-[#8c4cc2] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#7438a8]"
              >
                Save All Changes
              </button>
            </div>

            <section className="mt-8 rounded-2xl bg-white/70 p-5">
              <h2 className="font-display text-2xl font-semibold text-[#6b3d8d]">Our Story</h2>
              <form onSubmit={handleSaveStory} className="mt-4 space-y-3">
                <textarea
                  value={storyDraft}
                  onChange={(event) => setStoryDraft(event.target.value)}
                  rows={8}
                  placeholder="Write your story here..."
                  className="w-full rounded-xl border border-[#dec7f4] bg-white/85 px-4 py-3 outline-none ring-[#b98fda] focus:ring"
                />
                <button className="rounded-full bg-[#a478d1] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#8d59b8]">
                  Save Story
                </button>
              </form>
            </section>

            <section className="mt-6 grid gap-5 md:grid-cols-2">
              <article className="rounded-2xl bg-white/70 p-5">
                <h2 className="font-display text-2xl font-semibold text-[#6b3d8d]">Add Memories</h2>
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
                    <li className="rounded-xl bg-white/60 p-3 text-sm text-[#6d5a82]">No memory yet.</li>
                  )}
                  {store.memories.map((memory) => (
                    <li key={memory.id} className="rounded-xl bg-white/80 p-3">
                      <p className="text-sm text-[#6a507f]">{memory.text}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-[#8b6ca4]">{new Date(memory.createdAt).toLocaleString()}</span>
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
                <h2 className="font-display text-2xl font-semibold text-[#6b3d8d]">Add Pictures</h2>
                <p className="mt-2 text-sm text-[#5f4b74]">Upload your moments for visualization in Love page.</p>
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
                    <p className="col-span-2 rounded-xl bg-white/60 p-3 text-sm text-[#6d5a82]">No pictures yet.</p>
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

            {status && <p className="mt-6 text-sm font-semibold text-[#6b3d8d]">{status}</p>}
          </>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/love"
            className="rounded-full border border-[#c9a7e8] bg-white/75 px-5 py-2 text-sm font-semibold text-[#603b80] transition hover:bg-[#f5ebff]"
          >
            Back to Love Page
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
