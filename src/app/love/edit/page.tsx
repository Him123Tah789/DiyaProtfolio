"use client";

import type { ChangeEvent, FormEvent } from "react";
import NextImage from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  ACCESS_KEY,
  createId,
  type LoveImage,
  type LoveStore,
  initialLoveStore,
} from "@/lib/love-store";
import {
  fetchLoveStore,
  removeLoveImage,
  removeLoveMemory,
  saveLoveImage,
  saveLoveMemory,
  saveLoveStory,
} from "@/lib/love-api";

const toDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read image."));
    reader.readAsDataURL(file);
  });

const dataUrlBytes = (dataUrl: string) => {
  const base64Index = dataUrl.indexOf(",");
  if (base64Index === -1) {
    return 0;
  }

  const base64 = dataUrl.slice(base64Index + 1);
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return Math.floor((base64.length * 3) / 4) - padding;
};

const fileToImage = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new window.Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to decode image."));
    };

    image.src = objectUrl;
  });

const resizeImageToDataUrl = async (file: File) => {
  const image = await fileToImage(file);
  const maxUploadBytes = 900 * 1024;
  const maxInitialDimension = 1400;
  const scale = Math.min(1, maxInitialDimension / Math.max(image.width, image.height));

  let width = Math.max(1, Math.round(image.width * scale));
  let height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Failed to prepare image for upload.");
  }

  const qualities = [0.8, 0.72, 0.64, 0.58, 0.5, 0.45];

  for (const quality of qualities) {
    canvas.width = width;
    canvas.height = height;
    context.clearRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    const dataUrl = canvas.toDataURL("image/jpeg", quality);
    if (dataUrlBytes(dataUrl) <= maxUploadBytes) {
      return dataUrl;
    }

    width = Math.max(480, Math.round(width * 0.82));
    height = Math.max(480, Math.round(height * 0.82));
  }

  throw new Error("Image is still too large after compression. Please choose a smaller file.");
};

export default function LoveEditPage() {
  const [passphrase, setPassphrase] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState("");

  const [store, setStore] = useState<LoveStore>(initialLoveStore);
  const [storyDraft, setStoryDraft] = useState("");
  const [memoryText, setMemoryText] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [status, setStatus] = useState("");

  const handleSaveAll = async () => {
    try {
      const refreshed = await fetchLoveStore();
      setStore(refreshed);
      setStoryDraft(refreshed.story);
      setStatus("Synced latest data from database.");
    } catch {
      setStatus("Could not sync with database right now.");
    }
  };

  const handleUnlock = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (passphrase.trim() === ACCESS_KEY) {
      try {
        const loaded = await fetchLoveStore();
        setStore(loaded);
        setStoryDraft(loaded.story);
        setIsUnlocked(true);
        setError("");
        setStatus("Love data loaded from database.");
      } catch {
        setError("Could not load online data. Check database settings.");
      }
      return;
    }

    setError("Wrong passphrase. Only Diya can edit this page.");
  };

  const handleSaveStory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const story = storyDraft.trim();
    setStore((current) => ({
      ...current,
      story,
    }));
    try {
      await saveLoveStory(story);
      setStatus("Story saved to database.");
    } catch {
      setStatus("Failed to save story.");
    }
  };

  const handleAddMemory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!memoryText.trim()) {
      return;
    }

    const newMemory = {
      id: createId(),
      text: memoryText.trim(),
      createdAt: new Date().toISOString(),
    };

    setStore((current) => ({
      ...current,
      memories: [newMemory, ...current.memories],
    }));
    setMemoryText("");
    try {
      await saveLoveMemory(newMemory.id, newMemory.text, newMemory.createdAt);
      setStatus("Memory added to database.");
    } catch {
      setStore((current) => ({
        ...current,
        memories: current.memories.filter((item) => item.id !== newMemory.id),
      }));
      setStatus("Failed to save memory.");
    }
  };

  const handleUploadImages = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    const uploaded: LoveImage[] = [];
    let failed = 0;
    let lastErrorMessage = "";
    setStatus("Uploading images...");

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        failed += 1;
        continue;
      }

      let dataUrl: string;

      try {
        dataUrl = await resizeImageToDataUrl(file);
      } catch {
        try {
          dataUrl = await toDataUrl(file);
          if (dataUrlBytes(dataUrl) > 900 * 1024) {
            throw new Error("Image is too large.");
          }
        } catch {
          failed += 1;
          lastErrorMessage = "Image processing failed. Please choose a smaller image.";
          continue;
        }
      }

      const id = createId();
      const caption = imageCaption.trim() || "Our beautiful memory";
      const createdAt = new Date().toISOString();

      try {
        const savedImage = await saveLoveImage({
          id,
          caption,
          createdAt,
          dataUrl,
        });

        uploaded.push(savedImage);
      } catch (error) {
        failed += 1;

        if (error instanceof Error) {
          lastErrorMessage = error.message;
          setStatus(`Upload issue: ${error.message}`);
        }
      }
    }

    if (uploaded.length > 0) {
      setStore((current) => ({
        ...current,
        images: [...uploaded, ...current.images],
      }));

      if (failed > 0) {
        setStatus(`${uploaded.length} image(s) uploaded, ${failed} failed.`);
      } else {
        setStatus(`${uploaded.length} image(s) uploaded to database.`);
      }
    } else if (failed > 0) {
      setStatus(lastErrorMessage || "All selected images failed to upload. Try smaller images.");
    }

    setImageCaption("");
    event.target.value = "";
  };

  const removeMemory = async (id: string) => {
    const previous = store.memories;
    setStore((current) => ({
      ...current,
      memories: current.memories.filter((item) => item.id !== id),
    }));
    try {
      await removeLoveMemory(id);
      setStatus("Memory removed from database.");
    } catch {
      setStore((current) => ({
        ...current,
        memories: previous,
      }));
      setStatus("Failed to remove memory.");
    }
  };

  const removeImage = async (id: string) => {
    const previous = store.images;
    setStore((current) => ({
      ...current,
      images: current.images.filter((item) => item.id !== id),
    }));
    try {
      await removeLoveImage(id);
      setStatus("Image removed from database.");
    } catch {
      setStore((current) => ({
        ...current,
        images: previous,
      }));
      setStatus("Failed to remove image.");
    }
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
                Changes are saved online. Press Sync Latest to refresh from database.
              </p>
              <button
                onClick={handleSaveAll}
                className="rounded-full bg-[#8c4cc2] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#7438a8]"
              >
                Sync Latest
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
                      <NextImage
                        src={image.url}
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
