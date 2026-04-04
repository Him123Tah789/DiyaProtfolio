export type Task = {
  id: string;
  title: string;
  dueDate: string;
  done: boolean;
};

export type Assignment = {
  id: string;
  title: string;
  course: string;
  deadline: string;
  status: "Not Started" | "In Progress" | "Submitted";
};

export type Exam = {
  id: string;
  name: string;
  date: string;
};

export type Goal = {
  id: string;
  text: string;
  createdAt: string;
};

export type PlannerState = {
  tasks: Task[];
  assignments: Assignment[];
  exams: Exam[];
  goals: Goal[];
  notes: string;
};

export const PLANNER_STORAGE_KEY = "diyaverse-planner-v1";

export const initialPlannerState: PlannerState = {
  tasks: [],
  assignments: [],
  exams: [],
  goals: [],
  notes: "",
};

const isString = (value: unknown): value is string => typeof value === "string";

export const parsePlannerState = (raw: string | null): PlannerState => {
  if (!raw) {
    return initialPlannerState;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<PlannerState>;

    const tasks = Array.isArray(parsed.tasks)
      ? parsed.tasks.filter(
          (task): task is Task =>
            Boolean(task) &&
            typeof task === "object" &&
            isString((task as Task).id) &&
            isString((task as Task).title) &&
            isString((task as Task).dueDate) &&
            typeof (task as Task).done === "boolean",
        )
      : initialPlannerState.tasks;

    const assignments = Array.isArray(parsed.assignments)
      ? parsed.assignments.filter(
          (assignment): assignment is Assignment =>
            Boolean(assignment) &&
            typeof assignment === "object" &&
            isString((assignment as Assignment).id) &&
            isString((assignment as Assignment).title) &&
            isString((assignment as Assignment).course) &&
            isString((assignment as Assignment).deadline) &&
            ["Not Started", "In Progress", "Submitted"].includes(
              String((assignment as Assignment).status),
            ),
        )
      : initialPlannerState.assignments;

    const exams = Array.isArray(parsed.exams)
      ? parsed.exams.filter(
          (exam): exam is Exam =>
            Boolean(exam) &&
            typeof exam === "object" &&
            isString((exam as Exam).id) &&
            isString((exam as Exam).name) &&
            isString((exam as Exam).date),
        )
      : initialPlannerState.exams;

    const goals = Array.isArray(parsed.goals)
      ? parsed.goals.filter(
          (goal): goal is Goal =>
            Boolean(goal) &&
            typeof goal === "object" &&
            isString((goal as Goal).id) &&
            isString((goal as Goal).text) &&
            isString((goal as Goal).createdAt),
        )
      : initialPlannerState.goals;

    return {
      tasks,
      assignments,
      exams,
      goals,
      notes: isString(parsed.notes) ? parsed.notes : initialPlannerState.notes,
    };
  } catch {
    return initialPlannerState;
  }
};
