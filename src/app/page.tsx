"use client";

import type { MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ADMIN_STORAGE_KEY,
  PORTFOLIO_STORAGE_KEY,
  defaultPortfolioContent,
  parsePortfolioContent,
  type PortfolioContent,
} from "@/lib/site-data";

type AdminPanelStore = {
  profileImageDataUrl: string;
};

const defaultAdminStore: AdminPanelStore = {
  profileImageDataUrl: "",
};

const handleProjectPointerMove = (event: MouseEvent<HTMLElement>) => {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const offsetY = event.clientY - rect.top;
  const rotateY = ((offsetX / rect.width) * 2 - 1) * 8;
  const rotateX = ((offsetY / rect.height) * 2 - 1) * -8;

  card.style.setProperty("--rx", `${rotateX.toFixed(2)}deg`);
  card.style.setProperty("--ry", `${rotateY.toFixed(2)}deg`);
};

const resetProjectPointer = (event: MouseEvent<HTMLElement>) => {
  const card = event.currentTarget;
  card.style.setProperty("--rx", "0deg");
  card.style.setProperty("--ry", "0deg");
};

export default function Home() {
  const [content] = useState<PortfolioContent>(() => {
    if (typeof window === "undefined") {
      return defaultPortfolioContent;
    }

    return parsePortfolioContent(window.localStorage.getItem(PORTFOLIO_STORAGE_KEY));
  });
  const [profileImageDataUrl] = useState(() => {
    if (typeof window === "undefined") {
      return defaultAdminStore.profileImageDataUrl;
    }

    const rawAdmin = window.localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!rawAdmin) {
      return defaultAdminStore.profileImageDataUrl;
    }

    try {
      const parsed = JSON.parse(rawAdmin) as Partial<AdminPanelStore>;
      return parsed.profileImageDataUrl ?? "";
    } catch {
      return defaultAdminStore.profileImageDataUrl;
    }
  });
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [projectChangeTick, setProjectChangeTick] = useState(0);

  useEffect(() => {
    if (content.projects.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveProjectIndex((current) => (current + 1) % content.projects.length);
    }, 3200);

    return () => window.clearInterval(timer);
  }, [content.projects.length]);

  const goToNextProject = () => {
    setActiveProjectIndex((current) => (current + 1) % content.projects.length);
    setProjectChangeTick((current) => current + 1);
  };

  const goToPreviousProject = () => {
    setActiveProjectIndex((current) =>
      current === 0 ? content.projects.length - 1 : current - 1,
    );
    setProjectChangeTick((current) => current + 1);
  };

  const activeProject = content.projects[activeProjectIndex];

  return (
    <div className="hacker-vibe text-[#2b1c3c]">
      <header className="sticky top-0 z-40 bg-transparent">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="#home" className="font-display text-xl font-semibold tracking-wide">
            DiyaVerse
          </a>
          <div className="hidden items-center gap-5 text-sm font-semibold md:flex">
            <a href="#about" className="transition hover:text-[#8d59b8]">
              About
            </a>
            <a href="#skills" className="transition hover:text-[#8d59b8]">
              Skills
            </a>
            <a href="#projects" className="transition hover:text-[#8d59b8]">
              Projects
            </a>
            <a href="#blog" className="transition hover:text-[#8d59b8]">
              Blog
            </a>
            <a href="#education" className="transition hover:text-[#8d59b8]">
              Education
            </a>
            <a href="#achievements" className="transition hover:text-[#8d59b8]">
              Achievements
            </a>
            <a href="#contact" className="transition hover:text-[#8d59b8]">
              Contact
            </a>
            <Link href="/admin" className="transition hover:text-[#8d59b8]">
              Admin
            </Link>
          </div>
          <Link
            href="/planner"
            className="rounded-full bg-[#a478d1] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#8d59b8]"
          >
            Study Planner
          </Link>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
        <section
          id="home"
          className="hero-stage fade-up grid gap-8 rounded-3xl px-6 py-10 sm:px-9 md:grid-cols-[1.35fr_auto] md:items-center"
        >
          <span className="hero-glow" />
          <span className="hero-orb hero-orb-left" />
          <span className="hero-orb hero-orb-right" />
          <div className="hero-content space-y-5">
            <p className="inline-block rounded-full bg-[#f3e6ff] px-4 py-1 text-xs font-semibold tracking-[0.18em] text-[#6f3f9c] uppercase">
              Portfolio and Study Space
            </p>
            <h1 className="font-display text-4xl leading-tight font-semibold sm:text-5xl">
              DiyaVerse - Portfolio and Study Space of Tasfia Rashid Diya
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[#5f4b74] sm:text-lg">{content.heroBio}</p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#projects"
                className="rounded-full bg-[#a478d1] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#8d59b8]"
              >
                View Projects
              </a>
              <Link
                href="/planner"
                className="rounded-full border border-[#c9a7e8] bg-white/70 px-6 py-3 text-sm font-semibold text-[#603b80] transition hover:bg-[#f5ebff]"
              >
                Open Planner
              </Link>
              <Link
                href="/admin"
                className="rounded-full border border-[#f0bfd8] bg-white/70 px-6 py-3 text-sm font-semibold text-[#8f3b69] transition hover:bg-[#ffeef6]"
              >
                Admin Panel
              </Link>
            </div>
          </div>
          <div className="hero-content relative mx-auto w-full max-w-[240px] md:mx-0">
            <div className="soft-shadow glass rounded-3xl p-5 text-center">
              <div className="hero-profile mx-auto mb-3 grid h-28 w-28 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-[#ffd9eb] to-[#e8d8ff] text-4xl">
                {profileImageDataUrl ? (
                  <Image
                    src={profileImageDataUrl}
                    alt="Tasfia Rashid Diya profile"
                    width={112}
                    height={112}
                    unoptimized
                    className="h-28 w-28 object-cover"
                  />
                ) : (
                  <span className="float-love">👩‍💻</span>
                )}
              </div>
              <h2 className="font-display text-xl font-semibold">Tasfia Rashid Diya</h2>
              <p className="mt-1 text-xs text-[#694d80]">CSE Student | Future Software Engineer</p>
            </div>
          </div>
        </section>

        <section id="about" className="glass rounded-3xl px-6 py-8 sm:px-9">
          <h3 className="font-display text-3xl font-semibold">About</h3>
          <p className="mt-3 max-w-4xl leading-7 text-[#5f4b74]">{content.about}</p>
        </section>

        <section
          id="skills"
          className="skills-stage relative overflow-hidden rounded-3xl px-6 py-8 sm:px-9"
        >
          <span className="skills-orb skills-orb-a" />
          <span className="skills-orb skills-orb-b" />
          <span className="skills-grid-glow" />

          <div className="skills-grid grid gap-5 md:grid-cols-2">
            <article className="skills-card rounded-3xl p-6">
            <h3 className="font-display text-2xl font-semibold">Technical Skills</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {content.technicalSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-[#dcc2ff] bg-white/70 px-3 py-1 text-sm text-[#58387a]"
                >
                  {skill}
                </span>
              ))}
            </div>
            </article>

            <article className="skills-card rounded-3xl p-6">
            <h3 className="font-display text-2xl font-semibold">Soft Skills</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {content.softSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-[#ffd8ea] bg-white/70 px-3 py-1 text-sm text-[#7f4667]"
                >
                  {skill}
                </span>
              ))}
            </div>
            </article>
          </div>
        </section>

        <section
          id="projects"
          className="projects-stage relative overflow-hidden rounded-3xl px-6 py-8 sm:px-9"
        >
          <span className="projects-orb projects-orb-a" />
          <span className="projects-orb projects-orb-b" />
          <span className="projects-grid-glow" />

          <h3 className="font-display text-3xl font-semibold">Projects</h3>

          <div className="project-viewport mt-6">
            <div key={`${activeProject.id}-${projectChangeTick}`} className="project-slide-shell">
              <article
                className="project-showcase-card project-swipe soft-shadow rounded-2xl p-6"
                onMouseMove={handleProjectPointerMove}
                onMouseLeave={resetProjectPointer}
              >
                <p className="project-kicker text-xs font-semibold tracking-[0.18em] uppercase">
                  Featured Build
                </p>
                <h4 className="font-display mt-2 text-2xl font-semibold">{activeProject.title}</h4>
                <p className="mt-3 text-sm leading-7 text-[#4f426a]">{activeProject.description}</p>
                <p className="project-stack mt-4 inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-wide">
                  {activeProject.stack}
                </p>
              </article>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={goToPreviousProject}
              className="project-nav-btn"
              aria-label="Previous project"
            >
              Prev
            </button>
            {content.projects.map((project, index) => (
              <button
                type="button"
                key={project.id}
                className={`h-2.5 rounded-full transition ${
                  index === activeProjectIndex ? "w-8 bg-[#a478d1]" : "w-2.5 bg-[#d9c0ef]"
                }`}
                onClick={() => {
                  setActiveProjectIndex(index);
                  setProjectChangeTick((current) => current + 1);
                }}
                aria-label={`Show project ${index + 1}`}
              />
            ))}
            <button
              type="button"
              onClick={goToNextProject}
              className="project-nav-btn"
              aria-label="Next project"
            >
              Next
            </button>
          </div>
        </section>

        <section
          id="blog"
          className="theme-stage relative overflow-hidden rounded-3xl px-6 py-8 sm:px-9"
        >
          <span className="theme-orb theme-orb-a" />
          <span className="theme-orb theme-orb-b" />
          <span className="theme-grid-glow" />

          <h3 className="font-display text-3xl font-semibold">Blog Posts</h3>
          <div className="theme-grid mt-5 grid gap-4 md:grid-cols-2">
            {content.blogPosts.map((post) => (
              <article key={post.id} className="theme-card rounded-2xl p-5">
                <h4 className="font-display text-xl font-semibold">{post.title}</h4>
                <p className="mt-2 text-sm leading-6 text-[#614b79]">{post.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="education"
          className="theme-stage relative overflow-hidden rounded-3xl px-6 py-8 sm:px-9"
        >
          <span className="theme-orb theme-orb-a" />
          <span className="theme-orb theme-orb-b" />
          <span className="theme-grid-glow" />

          <h3 className="font-display text-3xl font-semibold">Education</h3>
          <div className="theme-grid mt-5">
            <div className="theme-card rounded-2xl p-5">
            <p className="font-semibold text-[#4f3368]">{content.educationTitle}</p>
            <p className="mt-1 text-sm text-[#5f4b74]">{content.educationDetails}</p>
            </div>
          </div>
        </section>

        <section
          id="achievements"
          className="theme-stage relative overflow-hidden rounded-3xl px-6 py-8 sm:px-9"
        >
          <span className="theme-orb theme-orb-a" />
          <span className="theme-orb theme-orb-b" />
          <span className="theme-grid-glow" />

          <h3 className="font-display text-3xl font-semibold">Achievements and Activities</h3>
          <ul className="theme-grid theme-card mt-4 space-y-3 rounded-2xl p-5 text-sm leading-7 text-[#5f4b74]">
            {content.achievements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section id="contact" className="glass rounded-3xl px-6 py-8 text-center sm:px-9">
          <h3 className="font-display text-3xl font-semibold">Contact</h3>
          <p className="mt-3 text-sm leading-7 text-[#5f4b74] sm:text-base">
            Open to internship opportunities, student collaborations, and meaningful tech
            conversations. Reach out and let us build something valuable.
          </p>
          <p className="mt-4 text-sm font-semibold text-[#75489c]">Email: {content.contactEmail}</p>
        </section>
      </main>

      <footer className="relative mx-auto mb-6 mt-2 w-full max-w-6xl px-6 text-center text-sm text-[#8b75a2]">
        <p>Designed with care for Tasfia Rashid Diya&apos;s future journey.</p>
        <Link
          href="/love"
          className="pulse-love absolute right-6 top-0 text-xl opacity-35 transition hover:opacity-95"
          aria-label="Love page"
          title="Love"
        >
          ❤
        </Link>
      </footer>
    </div>
  );
}
