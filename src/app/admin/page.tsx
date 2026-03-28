"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  ADMIN_STORAGE_KEY,
  PORTFOLIO_STORAGE_KEY,
  defaultPortfolioContent,
  parsePortfolioContent,
  type BlogPostItem,
  type PortfolioContent,
  type ProjectItem,
} from "@/lib/site-data";

type UploadedDoc = {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  dataUrl: string;
};

type AdminStore = {
  profileImageDataUrl: string;
  documents: UploadedDoc[];
};

const ADMIN_KEY = "DiyaHimu127";

const initialStore: AdminStore = {
  profileImageDataUrl: "",
  documents: [],
};

const toDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });

const formatBytes = (value: number) => {
  if (value < 1024) {
    return `${value} B`;
  }

  if (value < 1024 * 1024) {
    return `${(value / 1024).toFixed(1)} KB`;
  }

  return `${(value / (1024 * 1024)).toFixed(2)} MB`;
};

const generateId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export default function AdminPage() {
  const router = useRouter();
  const swipeTrackRef = useRef<HTMLDivElement>(null);
  const swipeStartOffsetRef = useRef(0);

  const [passphrase, setPassphrase] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState("");
  const [store, setStore] = useState<AdminStore>(() => {
    if (typeof window === "undefined") {
      return initialStore;
    }

    const saved = window.localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!saved) {
      return initialStore;
    }

    try {
      return JSON.parse(saved) as AdminStore;
    } catch {
      return initialStore;
    }
  });
  const [content, setContent] = useState<PortfolioContent>(() => {
    if (typeof window === "undefined") {
      return defaultPortfolioContent;
    }

    return parsePortfolioContent(window.localStorage.getItem(PORTFOLIO_STORAGE_KEY));
  });
  const [busy, setBusy] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeX, setSwipeX] = useState(0);

  useEffect(() => {
    if (!unlocked) {
      return;
    }

    window.localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(store));
  }, [store, unlocked]);

  useEffect(() => {
    if (!unlocked) {
      return;
    }

    window.localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(content));
  }, [content, unlocked]);

  const totalDocs = store.documents.length;
  const totalSize = useMemo(
    () => store.documents.reduce((sum, item) => sum + item.size, 0),
    [store.documents],
  );

  const handleUnlock = () => {
    if (passphrase.trim() === ADMIN_KEY) {
      setUnlocked(true);
      setError("");
      return;
    }

    setUnlocked(false);
    setError("Access denied. This admin panel is private.");
  };

  const updateProject = (id: string, field: keyof ProjectItem, value: string) => {
    setContent((current) => ({
      ...current,
      projects: current.projects.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const updateBlog = (id: string, field: keyof BlogPostItem, value: string) => {
    setContent((current) => ({
      ...current,
      blogPosts: current.blogPosts.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const handleProfileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file for profile photo.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const dataUrl = await toDataUrl(file);
      setStore((current) => ({
        ...current,
        profileImageDataUrl: dataUrl,
      }));
    } catch {
      setError("Profile upload failed. Please try another file.");
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  };

  const handleDocsUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    setBusy(true);
    setError("");

    try {
      const uploaded: UploadedDoc[] = [];

      for (const file of Array.from(files)) {
        const dataUrl = await toDataUrl(file);
        uploaded.push({
          id: generateId(),
          name: file.name,
          type: file.type || "unknown",
          size: file.size,
          uploadedAt: new Date().toISOString(),
          dataUrl,
        });
      }

      setStore((current) => ({
        ...current,
        documents: [...uploaded, ...current.documents],
      }));
    } catch {
      setError("One or more documents could not be uploaded.");
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  };

  const removeDoc = (id: string) => {
    setStore((current) => ({
      ...current,
      documents: current.documents.filter((item) => item.id !== id),
    }));
  };

  const clearProfile = () => {
    setStore((current) => ({
      ...current,
      profileImageDataUrl: "",
    }));
  };

  const getClientX = (event: React.MouseEvent | React.TouchEvent) => {
    if ("touches" in event) {
      return event.touches[0]?.clientX ?? 0;
    }

    return event.clientX;
  };

  const handleSwipeStart = (event: React.MouseEvent | React.TouchEvent) => {
    if (!unlocked) {
      return;
    }

    setIsDragging(true);
    swipeStartOffsetRef.current = getClientX(event) - swipeX;
  };

  const handleSwipeMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !swipeTrackRef.current) {
      return;
    }

    const trackWidth = swipeTrackRef.current.clientWidth;
    const knobMax = Math.max(trackWidth - 56, 0);
    const next = getClientX(event) - swipeStartOffsetRef.current;

    setSwipeX(Math.max(0, Math.min(next, knobMax)));
  };

  const handleSwipeEnd = () => {
    if (!isDragging || !swipeTrackRef.current) {
      return;
    }

    setIsDragging(false);

    const trackWidth = swipeTrackRef.current.clientWidth;
    const knobMax = Math.max(trackWidth - 56, 0);

    if (swipeX >= knobMax * 0.75) {
      setSwipeX(knobMax);
      router.push("/love");
      return;
    }

    setSwipeX(0);
  };

  return (
    <div
      className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12"
      onMouseMove={handleSwipeMove}
      onMouseUp={handleSwipeEnd}
      onMouseLeave={handleSwipeEnd}
      onTouchMove={handleSwipeMove}
      onTouchEnd={handleSwipeEnd}
    >
      <header className="glass soft-shadow rounded-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-[#7b4ea1] uppercase">
              Private Content Manager
            </p>
            <h1 className="font-display mt-2 text-4xl font-semibold">DiyaVerse Admin Panel</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5f4b74] sm:text-base">
              Upload profile/documents and edit blog, skills, projects, achievements,
              education, and contact content from one place.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-[#c9a7e8] bg-white/70 px-5 py-2 text-sm font-semibold text-[#603b80] transition hover:bg-[#f5ebff]"
          >
            Back to Portfolio
          </Link>
        </div>
      </header>

      {!unlocked && (
        <section className="glass mt-6 rounded-3xl p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold">Admin Login</h2>
          <p className="mt-2 text-sm text-[#5f4b74]">Enter passphrase to continue.</p>
          <div className="mt-4 flex flex-col gap-3 sm:max-w-md">
            <input
              value={passphrase}
              onChange={(event) => setPassphrase(event.target.value)}
              type="password"
              placeholder="Passphrase"
              className="w-full rounded-xl border border-[#dec7f4] bg-white/85 px-4 py-2 outline-none ring-[#b98fda] focus:ring"
            />
            <button
              onClick={handleUnlock}
              className="w-fit rounded-full bg-[#a478d1] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#8d59b8]"
            >
              Unlock Admin
            </button>
            {error && <p className="text-sm font-semibold text-[#b0366f]">{error}</p>}
          </div>
        </section>
      )}

      {unlocked && (
        <>
          <section className="mt-6 rounded-3xl border border-[#eddaff] bg-white/65 p-5">
            <p className="text-sm font-semibold text-[#6e4a8f]">Swipe right to open Love page</p>
            <div ref={swipeTrackRef} className="relative mt-3 h-14 rounded-full bg-[#f4e8ff] p-1">
              <div className="absolute inset-0 grid place-items-center text-xs font-semibold tracking-wide text-[#9066b4]">
                Slide to Love ➜
              </div>
              <button
                onMouseDown={handleSwipeStart}
                onTouchStart={handleSwipeStart}
                className="absolute top-1 z-10 grid h-12 w-12 place-items-center rounded-full bg-[#a478d1] text-white shadow-lg"
                style={{ left: `${swipeX}px` }}
                aria-label="Swipe to love page"
              >
                ❤
              </button>
            </div>
          </section>

          <section className="mt-6 grid gap-4 sm:grid-cols-3">
            <article className="glass rounded-2xl p-4">
              <p className="text-xs text-[#7b6392]">Profile Photo</p>
              <p className="font-display mt-1 text-3xl font-semibold">
                {store.profileImageDataUrl ? "1" : "0"}
              </p>
            </article>
            <article className="glass rounded-2xl p-4">
              <p className="text-xs text-[#7b6392]">Documents</p>
              <p className="font-display mt-1 text-3xl font-semibold">{totalDocs}</p>
            </article>
            <article className="glass rounded-2xl p-4">
              <p className="text-xs text-[#7b6392]">Storage Used</p>
              <p className="font-display mt-1 text-3xl font-semibold">{formatBytes(totalSize)}</p>
            </article>
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-2">
            <article className="glass rounded-3xl p-6">
              <h2 className="font-display text-2xl font-semibold">Upload Profile Photo</h2>
              <p className="mt-2 text-sm text-[#5f4b74]">Accepted: JPG, PNG, WEBP, GIF</p>
              <label className="mt-4 inline-block cursor-pointer rounded-full bg-[#a478d1] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#8d59b8]">
                Choose Image
                <input
                  onChange={handleProfileUpload}
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
              </label>

              {store.profileImageDataUrl && (
                <div className="mt-5 rounded-2xl bg-white/75 p-4">
                  <Image
                    src={store.profileImageDataUrl}
                    alt="Uploaded profile"
                    width={720}
                    height={360}
                    unoptimized
                    className="h-48 w-full rounded-xl object-cover"
                  />
                  <button
                    onClick={clearProfile}
                    className="mt-3 rounded-full border border-[#e8c8f4] bg-white px-4 py-1 text-sm font-semibold text-[#7b3a92]"
                  >
                    Remove Photo
                  </button>
                </div>
              )}
            </article>

            <article className="glass rounded-3xl p-6">
              <h2 className="font-display text-2xl font-semibold">Upload Documents</h2>
              <p className="mt-2 text-sm text-[#5f4b74]">
                You can add CV, certificates, transcripts, or project documents.
              </p>
              <label className="mt-4 inline-block cursor-pointer rounded-full bg-[#a478d1] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#8d59b8]">
                Choose Files
                <input
                  onChange={handleDocsUpload}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip,.rar,image/*"
                  className="hidden"
                />
              </label>

              {busy && <p className="mt-3 text-sm text-[#6e5984]">Uploading...</p>}
              {error && <p className="mt-3 text-sm font-semibold text-[#b0366f]">{error}</p>}

              <ul className="mt-5 space-y-3">
                {store.documents.length === 0 && (
                  <li className="rounded-xl bg-white/60 p-3 text-sm text-[#6d5a82]">
                    No documents uploaded yet.
                  </li>
                )}

                {store.documents.map((item) => (
                  <li key={item.id} className="rounded-xl bg-white/75 p-3">
                    <p className="text-sm font-semibold text-[#53336f]">{item.name}</p>
                    <p className="mt-1 text-xs text-[#6f5a86]">
                      {item.type} • {formatBytes(item.size)} • {new Date(item.uploadedAt).toLocaleString()}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <a
                        href={item.dataUrl}
                        download={item.name}
                        className="rounded-full border border-[#d8b9ef] bg-white px-3 py-1 text-xs font-semibold text-[#7c4aa5]"
                      >
                        Download
                      </a>
                      <button
                        onClick={() => removeDoc(item.id)}
                        className="rounded-full border border-[#f0bfd8] bg-white px-3 py-1 text-xs font-semibold text-[#a44a73]"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          </section>

          <section className="glass mt-6 rounded-3xl p-6">
            <h2 className="font-display text-3xl font-semibold">Edit Portfolio Content</h2>
            <p className="mt-2 text-sm text-[#5f4b74]">
              Changes are auto-saved and reflected on the homepage.
            </p>

            <div className="mt-5 grid gap-5">
              <label className="text-sm font-semibold text-[#5c3c7f]">
                Hero Bio
                <textarea
                  value={content.heroBio}
                  onChange={(event) =>
                    setContent((current) => ({
                      ...current,
                      heroBio: event.target.value,
                    }))
                  }
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-[#dec7f4] bg-white/80 px-4 py-3 outline-none ring-[#b98fda] focus:ring"
                />
              </label>

              <label className="text-sm font-semibold text-[#5c3c7f]">
                About
                <textarea
                  value={content.about}
                  onChange={(event) =>
                    setContent((current) => ({
                      ...current,
                      about: event.target.value,
                    }))
                  }
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-[#dec7f4] bg-white/80 px-4 py-3 outline-none ring-[#b98fda] focus:ring"
                />
              </label>

              <label className="text-sm font-semibold text-[#5c3c7f]">
                Technical Skills (comma separated)
                <input
                  value={content.technicalSkills.join(", ")}
                  onChange={(event) =>
                    setContent((current) => ({
                      ...current,
                      technicalSkills: event.target.value
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean),
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-[#dec7f4] bg-white/80 px-4 py-2 outline-none ring-[#b98fda] focus:ring"
                />
              </label>

              <label className="text-sm font-semibold text-[#5c3c7f]">
                Soft Skills (comma separated)
                <input
                  value={content.softSkills.join(", ")}
                  onChange={(event) =>
                    setContent((current) => ({
                      ...current,
                      softSkills: event.target.value
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean),
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-[#dec7f4] bg-white/80 px-4 py-2 outline-none ring-[#b98fda] focus:ring"
                />
              </label>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#5c3c7f]">Projects</p>
                  <button
                    onClick={() =>
                      setContent((current) => ({
                        ...current,
                        projects: [
                          ...current.projects,
                          {
                            id: generateId(),
                            title: "New Project",
                            description: "Describe project.",
                            stack: "Tech stack",
                          },
                        ],
                      }))
                    }
                    className="rounded-full border border-[#d8b9ef] bg-white px-3 py-1 text-xs font-semibold text-[#7c4aa5]"
                  >
                    Add Project
                  </button>
                </div>
                <div className="space-y-3">
                  {content.projects.map((project) => (
                    <div key={project.id} className="rounded-xl bg-white/70 p-3">
                      <input
                        value={project.title}
                        onChange={(event) => updateProject(project.id, "title", event.target.value)}
                        className="w-full rounded-lg border border-[#dec7f4] bg-white px-3 py-2 text-sm"
                      />
                      <textarea
                        value={project.description}
                        onChange={(event) =>
                          updateProject(project.id, "description", event.target.value)
                        }
                        rows={2}
                        className="mt-2 w-full rounded-lg border border-[#dec7f4] bg-white px-3 py-2 text-sm"
                      />
                      <input
                        value={project.stack}
                        onChange={(event) => updateProject(project.id, "stack", event.target.value)}
                        className="mt-2 w-full rounded-lg border border-[#dec7f4] bg-white px-3 py-2 text-sm"
                      />
                      <button
                        onClick={() =>
                          setContent((current) => ({
                            ...current,
                            projects: current.projects.filter((item) => item.id !== project.id),
                          }))
                        }
                        className="mt-2 rounded-full border border-[#f0bfd8] bg-white px-3 py-1 text-xs font-semibold text-[#a44a73]"
                      >
                        Delete Project
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#5c3c7f]">Blog Posts</p>
                  <button
                    onClick={() =>
                      setContent((current) => ({
                        ...current,
                        blogPosts: [
                          ...current.blogPosts,
                          {
                            id: generateId(),
                            title: "New Blog Title",
                            summary: "Blog summary...",
                          },
                        ],
                      }))
                    }
                    className="rounded-full border border-[#d8b9ef] bg-white px-3 py-1 text-xs font-semibold text-[#7c4aa5]"
                  >
                    Add Blog
                  </button>
                </div>
                <div className="space-y-3">
                  {content.blogPosts.map((post) => (
                    <div key={post.id} className="rounded-xl bg-white/70 p-3">
                      <input
                        value={post.title}
                        onChange={(event) => updateBlog(post.id, "title", event.target.value)}
                        className="w-full rounded-lg border border-[#dec7f4] bg-white px-3 py-2 text-sm"
                      />
                      <textarea
                        value={post.summary}
                        onChange={(event) => updateBlog(post.id, "summary", event.target.value)}
                        rows={2}
                        className="mt-2 w-full rounded-lg border border-[#dec7f4] bg-white px-3 py-2 text-sm"
                      />
                      <button
                        onClick={() =>
                          setContent((current) => ({
                            ...current,
                            blogPosts: current.blogPosts.filter((item) => item.id !== post.id),
                          }))
                        }
                        className="mt-2 rounded-full border border-[#f0bfd8] bg-white px-3 py-1 text-xs font-semibold text-[#a44a73]"
                      >
                        Delete Blog
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <label className="text-sm font-semibold text-[#5c3c7f]">
                Education Title
                <input
                  value={content.educationTitle}
                  onChange={(event) =>
                    setContent((current) => ({
                      ...current,
                      educationTitle: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-[#dec7f4] bg-white/80 px-4 py-2 outline-none ring-[#b98fda] focus:ring"
                />
              </label>

              <label className="text-sm font-semibold text-[#5c3c7f]">
                Education Details
                <textarea
                  value={content.educationDetails}
                  onChange={(event) =>
                    setContent((current) => ({
                      ...current,
                      educationDetails: event.target.value,
                    }))
                  }
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-[#dec7f4] bg-white/80 px-4 py-3 outline-none ring-[#b98fda] focus:ring"
                />
              </label>

              <label className="text-sm font-semibold text-[#5c3c7f]">
                Achievements (one per line)
                <textarea
                  value={content.achievements.join("\n")}
                  onChange={(event) =>
                    setContent((current) => ({
                      ...current,
                      achievements: event.target.value
                        .split("\n")
                        .map((item) => item.trim())
                        .filter(Boolean),
                    }))
                  }
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-[#dec7f4] bg-white/80 px-4 py-3 outline-none ring-[#b98fda] focus:ring"
                />
              </label>

              <label className="text-sm font-semibold text-[#5c3c7f]">
                Contact Email
                <input
                  value={content.contactEmail}
                  onChange={(event) =>
                    setContent((current) => ({
                      ...current,
                      contactEmail: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-[#dec7f4] bg-white/80 px-4 py-2 outline-none ring-[#b98fda] focus:ring"
                />
              </label>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
