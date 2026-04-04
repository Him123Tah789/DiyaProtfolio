"use client";

import Link from "next/link";
import { useState } from "react";
import {
  PORTFOLIO_STORAGE_KEY,
  defaultPortfolioContent,
  parsePortfolioContent,
  type PortfolioContent,
} from "@/lib/site-data";

export default function ProjectsPage() {
  const [content] = useState<PortfolioContent>(() => {
    if (typeof window === "undefined") {
      return defaultPortfolioContent;
    }

    return parsePortfolioContent(window.localStorage.getItem(PORTFOLIO_STORAGE_KEY));
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 text-[color:var(--foreground)]">
      <header className="mb-8 rounded-3xl border border-white/30 bg-transparent p-6 backdrop-blur-md sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-[color:var(--lavender-500)] uppercase">
              Project Collection
            </p>
            <h1 className="font-display mt-2 text-4xl font-semibold">All Projects</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--muted-foreground)] sm:text-base">
              Full project list in one transparent view.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="rounded-full border border-white/35 bg-transparent px-5 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-white/10"
            >
              Back Home
            </Link>
            <Link
              href="/study-plan"
              className="rounded-full border border-white/35 bg-transparent px-5 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-white/10"
            >
              Study Plan
            </Link>
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {content.projects.map((project) => (
          <article
            key={project.id}
            className="rounded-2xl border border-white/30 bg-transparent p-6 backdrop-blur-md"
          >
            <p className="text-xs font-semibold tracking-[0.18em] text-[color:var(--lavender-500)] uppercase">
              Project
            </p>
            <h2 className="font-display mt-2 text-2xl font-semibold">{project.title}</h2>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted-foreground)]">
              {project.description}
            </p>
            <p className="mt-4 inline-block rounded-full border border-white/30 bg-transparent px-3 py-1 text-xs font-semibold tracking-wide text-[color:var(--foreground)]">
              {project.stack}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
