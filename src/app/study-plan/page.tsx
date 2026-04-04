"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PLANNER_STORAGE_KEY,
  initialPlannerState,
  parsePlannerState,
  type PlannerState,
} from "@/lib/planner-data";

export default function StudyPlanPage() {
  const router = useRouter();
  const [planner, setPlanner] = useState<PlannerState>(() => {
    if (typeof window === "undefined") {
      return initialPlannerState;
    }

    return parsePlannerState(window.localStorage.getItem(PLANNER_STORAGE_KEY));
  });
  const [swipeStart, setSwipeStart] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const syncFromStorage = () => {
      setPlanner(parsePlannerState(window.localStorage.getItem(PLANNER_STORAGE_KEY)));
    };

    syncFromStorage();
    window.addEventListener("storage", syncFromStorage);

    return () => window.removeEventListener("storage", syncFromStorage);
  }, []);

  const upcomingExams = useMemo(() => {
    return planner.exams
      .map((exam) => {
        const now = new Date();
        const examDay = new Date(exam.date);
        const diffMs = examDay.getTime() - now.getTime();
        const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        return {
          ...exam,
          daysLeft,
        };
      })
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, [planner.exams]);

  const handleSwipeEnd = (endX: number, endY: number) => {
    if (!swipeStart) {
      return;
    }

    const deltaX = endX - swipeStart.x;
    const deltaY = endY - swipeStart.y;

    if (Math.abs(deltaX) >= 70 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2 && deltaX <= -70) {
      router.push("/projects");
    }

    setSwipeStart(null);
  };

  return (
    <div
      className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12"
      onPointerDown={(event) => setSwipeStart({ x: event.clientX, y: event.clientY })}
      onPointerUp={(event) => handleSwipeEnd(event.clientX, event.clientY)}
    >
      <header className="glass soft-shadow mb-8 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-[#7b4ea1] uppercase">
              Study Snapshot
            </p>
            <h1 className="font-display mt-2 text-4xl font-semibold">Study Plan</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--muted-foreground)] sm:text-base">
              This page is view-only and shows your planner items. Swipe left to go to Projects.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/planner"
              className="rounded-full border border-[#c9a7e8] bg-white/70 px-5 py-2 text-sm font-semibold text-[#603b80] transition hover:bg-[#f5ebff]"
            >
              Open Editor
            </Link>
            <Link
              href="/projects"
              className="rounded-full border border-[#c9a7e8] bg-white/70 px-5 py-2 text-sm font-semibold text-[#603b80] transition hover:bg-[#f5ebff]"
            >
              Project Page
            </Link>
          </div>
        </div>
      </header>

      <section className="mb-6 grid gap-4 sm:grid-cols-3">
        <article className="glass rounded-2xl p-4">
          <p className="text-xs text-[#7b6392]">Tasks</p>
          <p className="font-display mt-1 text-3xl font-semibold">{planner.tasks.length}</p>
        </article>
        <article className="glass rounded-2xl p-4">
          <p className="text-xs text-[#7b6392]">Assignments</p>
          <p className="font-display mt-1 text-3xl font-semibold">{planner.assignments.length}</p>
        </article>
        <article className="glass rounded-2xl p-4">
          <p className="text-xs text-[#7b6392]">Upcoming Exams</p>
          <p className="font-display mt-1 text-3xl font-semibold">{planner.exams.length}</p>
        </article>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="glass rounded-3xl p-6">
          <h2 className="font-display text-2xl font-semibold">Tasks</h2>
          <ul className="mt-4 space-y-2">
            {planner.tasks.length === 0 && (
              <li className="rounded-xl bg-white/60 p-3 text-sm text-[#6d5a82]">No tasks yet.</li>
            )}
            {planner.tasks.map((task) => (
              <li key={task.id} className="rounded-xl bg-white/70 p-3 text-sm">
                <p className={task.done ? "line-through opacity-60" : ""}>{task.title}</p>
                {task.dueDate && <p className="mt-1 text-xs text-[#7b6392]">Due: {task.dueDate}</p>}
              </li>
            ))}
          </ul>
        </article>

        <article className="glass rounded-3xl p-6">
          <h2 className="font-display text-2xl font-semibold">Assignments</h2>
          <ul className="mt-4 space-y-2">
            {planner.assignments.length === 0 && (
              <li className="rounded-xl bg-white/60 p-3 text-sm text-[#6d5a82]">No assignments.</li>
            )}
            {planner.assignments.map((item) => (
              <li key={item.id} className="rounded-xl bg-white/70 p-3 text-sm">
                <p className="font-semibold">{item.title}</p>
                <p className="text-xs text-[#7b6392]">{item.course}</p>
                <p className="mt-1 text-xs text-[#7b6392]">
                  {item.deadline ? `Deadline: ${item.deadline}` : "No deadline"}
                </p>
                <p className="mt-1 inline-block rounded-full bg-[#f3e6ff] px-2 py-1 text-xs text-[#724999]">
                  {item.status}
                </p>
              </li>
            ))}
          </ul>
        </article>

        <article className="glass rounded-3xl p-6">
          <h2 className="font-display text-2xl font-semibold">Exam Countdown</h2>
          <ul className="mt-4 space-y-2">
            {upcomingExams.length === 0 && (
              <li className="rounded-xl bg-white/60 p-3 text-sm text-[#6d5a82]">No exams listed.</li>
            )}
            {upcomingExams.map((exam) => (
              <li key={exam.id} className="rounded-xl bg-white/70 p-3 text-sm">
                <p className="font-semibold">{exam.name}</p>
                <p className="text-xs text-[#7b6392]">Date: {exam.date}</p>
                <p className="mt-1 text-xs font-semibold text-[#9d4f7f]">
                  {exam.daysLeft >= 0
                    ? `${exam.daysLeft} day(s) left`
                    : `${Math.abs(exam.daysLeft)} day(s) ago`}
                </p>
              </li>
            ))}
          </ul>
        </article>

        <article className="glass rounded-3xl p-6">
          <h2 className="font-display text-2xl font-semibold">Goals and Notes</h2>
          <ul className="mt-4 space-y-2">
            {planner.goals.length === 0 && (
              <li className="rounded-xl bg-white/60 p-3 text-sm text-[#6d5a82]">No goals yet.</li>
            )}
            {planner.goals.map((goal) => (
              <li key={goal.id} className="rounded-xl bg-white/70 p-3 text-sm">
                <p>{goal.text}</p>
                <p className="mt-1 text-xs text-[#7b6392]">
                  {new Date(goal.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-4 rounded-xl bg-white/70 p-3">
            <p className="text-xs font-semibold text-[#5c3c7f]">Notes</p>
            <p className="mt-2 text-sm text-[color:var(--muted-foreground)] whitespace-pre-wrap">
              {planner.notes || "No notes yet."}
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
