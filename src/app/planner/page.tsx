"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  PLANNER_STORAGE_KEY,
  initialPlannerState,
  parsePlannerState,
  type Assignment,
  type Exam,
  type Goal,
  type PlannerState,
  type Task,
} from "@/lib/planner-data";

const generateId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export default function PlannerPage() {
  const [planner, setPlanner] = useState<PlannerState>(() => {
    if (typeof window === "undefined") {
      return initialPlannerState;
    }

    return parsePlannerState(window.localStorage.getItem(PLANNER_STORAGE_KEY));
  });
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentCourse, setAssignmentCourse] = useState("");
  const [assignmentDeadline, setAssignmentDeadline] = useState("");
  const [examName, setExamName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [goalText, setGoalText] = useState("");

  useEffect(() => {
    window.localStorage.setItem(PLANNER_STORAGE_KEY, JSON.stringify(planner));
  }, [planner]);

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

  const completedTasks = planner.tasks.filter((task) => task.done).length;

  const handleTaskSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!taskTitle.trim()) {
      return;
    }

    const newTask: Task = {
      id: generateId(),
      title: taskTitle.trim(),
      dueDate: taskDueDate,
      done: false,
    };

    setPlanner((current) => ({
      ...current,
      tasks: [newTask, ...current.tasks],
    }));

    setTaskTitle("");
    setTaskDueDate("");
  };

  const handleAssignmentSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!assignmentTitle.trim() || !assignmentCourse.trim()) {
      return;
    }

    const newAssignment: Assignment = {
      id: generateId(),
      title: assignmentTitle.trim(),
      course: assignmentCourse.trim(),
      deadline: assignmentDeadline,
      status: "Not Started",
    };

    setPlanner((current) => ({
      ...current,
      assignments: [newAssignment, ...current.assignments],
    }));

    setAssignmentTitle("");
    setAssignmentCourse("");
    setAssignmentDeadline("");
  };

  const handleExamSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!examName.trim() || !examDate) {
      return;
    }

    const newExam: Exam = {
      id: generateId(),
      name: examName.trim(),
      date: examDate,
    };

    setPlanner((current) => ({
      ...current,
      exams: [newExam, ...current.exams],
    }));

    setExamName("");
    setExamDate("");
  };

  const handleGoalSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!goalText.trim()) {
      return;
    }

    const newGoal: Goal = {
      id: generateId(),
      text: goalText.trim(),
      createdAt: new Date().toISOString(),
    };

    setPlanner((current) => ({
      ...current,
      goals: [newGoal, ...current.goals],
    }));

    setGoalText("");
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="glass soft-shadow mb-8 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-[#7b4ea1] uppercase">
              Practical Student Zone
            </p>
            <h1 className="font-display mt-2 text-4xl font-semibold">DiyaVerse Study Planner</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5f4b74] sm:text-base">
              Track daily tasks, assignments, exam deadlines, and personal goals in one
              elegant dashboard. Everything is saved locally in your browser.
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

      <section className="mb-6 grid gap-4 sm:grid-cols-3">
        <article className="glass rounded-2xl p-4">
          <p className="text-xs text-[#7b6392]">Total Tasks</p>
          <p className="font-display mt-1 text-3xl font-semibold">{planner.tasks.length}</p>
        </article>
        <article className="glass rounded-2xl p-4">
          <p className="text-xs text-[#7b6392]">Completed Tasks</p>
          <p className="font-display mt-1 text-3xl font-semibold">{completedTasks}</p>
        </article>
        <article className="glass rounded-2xl p-4">
          <p className="text-xs text-[#7b6392]">Upcoming Exams</p>
          <p className="font-display mt-1 text-3xl font-semibold">{planner.exams.length}</p>
        </article>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="glass rounded-3xl p-6">
          <h2 className="font-display text-2xl font-semibold">Daily To-Do List</h2>
          <form onSubmit={handleTaskSubmit} className="mt-4 space-y-3">
            <input
              value={taskTitle}
              onChange={(event) => setTaskTitle(event.target.value)}
              placeholder="Task title"
              className="w-full rounded-xl border border-[#dec7f4] bg-white/80 px-4 py-2 outline-none ring-[#b98fda] focus:ring"
            />
            <input
              value={taskDueDate}
              onChange={(event) => setTaskDueDate(event.target.value)}
              type="date"
              className="w-full rounded-xl border border-[#dec7f4] bg-white/80 px-4 py-2 outline-none ring-[#b98fda] focus:ring"
            />
            <button className="rounded-full bg-[#a478d1] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#8d59b8]">
              Add Task
            </button>
          </form>

          <ul className="mt-5 space-y-2">
            {planner.tasks.length === 0 && (
              <li className="rounded-xl bg-white/60 p-3 text-sm text-[#6d5a82]">No tasks yet.</li>
            )}

            {planner.tasks.map((task) => (
              <li key={task.id} className="rounded-xl bg-white/70 p-3">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => {
                      setPlanner((current) => ({
                        ...current,
                        tasks: current.tasks.map((item) =>
                          item.id === task.id ? { ...item, done: !item.done } : item,
                        ),
                      }));
                    }}
                    className="mt-1"
                  />
                  <span>
                    <span className={task.done ? "line-through opacity-55" : ""}>{task.title}</span>
                    {task.dueDate && (
                      <span className="mt-1 block text-xs text-[#7b6392]">Due: {task.dueDate}</span>
                    )}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </article>

        <article className="glass rounded-3xl p-6">
          <h2 className="font-display text-2xl font-semibold">Assignment Tracker</h2>
          <form onSubmit={handleAssignmentSubmit} className="mt-4 space-y-3">
            <input
              value={assignmentTitle}
              onChange={(event) => setAssignmentTitle(event.target.value)}
              placeholder="Assignment title"
              className="w-full rounded-xl border border-[#dec7f4] bg-white/80 px-4 py-2 outline-none ring-[#b98fda] focus:ring"
            />
            <input
              value={assignmentCourse}
              onChange={(event) => setAssignmentCourse(event.target.value)}
              placeholder="Course name"
              className="w-full rounded-xl border border-[#dec7f4] bg-white/80 px-4 py-2 outline-none ring-[#b98fda] focus:ring"
            />
            <input
              value={assignmentDeadline}
              onChange={(event) => setAssignmentDeadline(event.target.value)}
              type="date"
              className="w-full rounded-xl border border-[#dec7f4] bg-white/80 px-4 py-2 outline-none ring-[#b98fda] focus:ring"
            />
            <button className="rounded-full bg-[#a478d1] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#8d59b8]">
              Add Assignment
            </button>
          </form>

          <ul className="mt-5 space-y-2">
            {planner.assignments.length === 0 && (
              <li className="rounded-xl bg-white/60 p-3 text-sm text-[#6d5a82]">
                No assignments added.
              </li>
            )}

            {planner.assignments.map((assignment) => (
              <li key={assignment.id} className="rounded-xl bg-white/70 p-3">
                <p className="font-semibold">{assignment.title}</p>
                <p className="text-sm text-[#6f5a86]">{assignment.course}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                  <span className="rounded-full bg-[#f3e6ff] px-2 py-1 text-[#724999]">
                    {assignment.deadline ? `Deadline: ${assignment.deadline}` : "No deadline"}
                  </span>
                  <select
                    value={assignment.status}
                    onChange={(event) => {
                      const newStatus = event.target.value as Assignment["status"];

                      setPlanner((current) => ({
                        ...current,
                        assignments: current.assignments.map((item) =>
                          item.id === assignment.id ? { ...item, status: newStatus } : item,
                        ),
                      }));
                    }}
                    className="rounded-full border border-[#d6b9ef] bg-white px-3 py-1"
                  >
                    <option>Not Started</option>
                    <option>In Progress</option>
                    <option>Submitted</option>
                  </select>
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className="glass rounded-3xl p-6">
          <h2 className="font-display text-2xl font-semibold">Exam Countdown</h2>
          <form onSubmit={handleExamSubmit} className="mt-4 space-y-3">
            <input
              value={examName}
              onChange={(event) => setExamName(event.target.value)}
              placeholder="Exam name"
              className="w-full rounded-xl border border-[#dec7f4] bg-white/80 px-4 py-2 outline-none ring-[#b98fda] focus:ring"
            />
            <input
              value={examDate}
              onChange={(event) => setExamDate(event.target.value)}
              type="date"
              className="w-full rounded-xl border border-[#dec7f4] bg-white/80 px-4 py-2 outline-none ring-[#b98fda] focus:ring"
            />
            <button className="rounded-full bg-[#a478d1] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#8d59b8]">
              Add Exam
            </button>
          </form>
          <ul className="mt-5 grid gap-2">
            {upcomingExams.length === 0 && (
              <li className="rounded-xl bg-white/60 p-3 text-sm text-[#6d5a82]">No exams listed.</li>
            )}

            {upcomingExams.map((exam) => (
              <li key={exam.id} className="rounded-xl bg-white/75 p-3">
                <p className="font-semibold">{exam.name}</p>
                <p className="text-sm text-[#6f5a86]">Date: {exam.date}</p>
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
          <h2 className="font-display text-2xl font-semibold">Goal Journal and Notes</h2>

          <form onSubmit={handleGoalSubmit} className="mt-4 space-y-3">
            <input
              value={goalText}
              onChange={(event) => setGoalText(event.target.value)}
              placeholder="Add a goal"
              className="w-full rounded-xl border border-[#dec7f4] bg-white/80 px-4 py-2 outline-none ring-[#b98fda] focus:ring"
            />
            <button className="rounded-full bg-[#a478d1] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#8d59b8]">
              Save Goal
            </button>
          </form>

          <ul className="mt-5 space-y-2">
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

          <div className="mt-5">
            <label htmlFor="planner-notes" className="text-sm font-semibold text-[#5c3c7f]">
              Notes
            </label>
            <textarea
              id="planner-notes"
              value={planner.notes}
              onChange={(event) =>
                setPlanner((current) => ({
                  ...current,
                  notes: event.target.value,
                }))
              }
              rows={6}
              className="mt-2 w-full rounded-xl border border-[#dec7f4] bg-white/80 px-4 py-3 outline-none ring-[#b98fda] focus:ring"
              placeholder="Write class notes, reminders, and reflections..."
            />
          </div>
        </article>
      </div>
    </div>
  );
}
