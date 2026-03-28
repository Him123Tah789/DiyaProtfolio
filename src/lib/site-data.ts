export type ProjectItem = {
  id: string;
  title: string;
  description: string;
  stack: string;
};

export type BlogPostItem = {
  id: string;
  title: string;
  summary: string;
};

export type PortfolioContent = {
  heroBio: string;
  about: string;
  technicalSkills: string[];
  softSkills: string[];
  projects: ProjectItem[];
  blogPosts: BlogPostItem[];
  educationTitle: string;
  educationDetails: string;
  achievements: string[];
  contactEmail: string;
};

export const ADMIN_STORAGE_KEY = "diyaverse-admin-panel-v1";
export const PORTFOLIO_STORAGE_KEY = "diyaverse-portfolio-content-v1";

export const defaultPortfolioContent: PortfolioContent = {
  heroBio:
    "I am Tasfia Rashid Diya, a CSE student and aspiring developer focused on building practical, elegant, and meaningful digital experiences. This space showcases my growth, projects, and the learning systems that keep me moving forward.",
  about:
    "I am currently pursuing Computer Science and Engineering and actively preparing for internships and career opportunities in software development. I enjoy transforming ideas into clean interfaces and robust systems. My long-term goal is to contribute to impactful products while continuously improving as an engineer and teammate.",
  technicalSkills: [
    "C",
    "C++",
    "Python",
    "JavaScript",
    "TypeScript",
    "HTML",
    "CSS",
    "React",
    "Next.js",
    "Tailwind CSS",
    "Git",
    "Figma",
  ],
  softSkills: [
    "Communication",
    "Teamwork",
    "Problem Solving",
    "Leadership",
    "Adaptability",
    "Time Management",
  ],
  projects: [
    {
      id: "p1",
      title: "Campus Event Finder",
      description:
        "A responsive app concept to track university events, notices, and registration deadlines.",
      stack: "Next.js, Tailwind CSS, Firebase",
    },
    {
      id: "p2",
      title: "Smart Routine Tracker",
      description:
        "A daily workflow planner that combines study blocks, focus timers, and productivity analytics.",
      stack: "React, Local Storage, Chart.js",
    },
    {
      id: "p3",
      title: "DiyaVerse Planner",
      description:
        "This portfolio's built-in planner module for tasks, assignments, goals, and exam countdowns.",
      stack: "Next.js App Router, TypeScript",
    },
  ],
  blogPosts: [
    {
      id: "b1",
      title: "How I Balance CSE and Projects",
      summary:
        "My process for balancing university coursework with hands-on software project work.",
    },
    {
      id: "b2",
      title: "Why UI Matters in Student Apps",
      summary:
        "A short reflection on making educational tools simple, beautiful, and easy to use.",
    },
  ],
  educationTitle: "B.Sc. in Computer Science and Engineering",
  educationDetails:
    "Focused on software engineering, algorithms, and data-driven systems. Relevant interests: web development, problem solving, productivity tools, and human-centered software.",
  achievements: [
    "Participated in university tech workshops and programming sessions.",
    "Built multiple academic and personal mini projects with modern web technologies.",
    "Continuously upskilling through online certifications and hands-on practice.",
    "Collaborated with peers on team-based coursework and presentations.",
  ],
  contactEmail: "tasfia.diya@example.com",
};

export const parsePortfolioContent = (raw: string | null): PortfolioContent => {
  if (!raw) {
    return defaultPortfolioContent;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<PortfolioContent>;

    return {
      heroBio: parsed.heroBio ?? defaultPortfolioContent.heroBio,
      about: parsed.about ?? defaultPortfolioContent.about,
      technicalSkills: parsed.technicalSkills ?? defaultPortfolioContent.technicalSkills,
      softSkills: parsed.softSkills ?? defaultPortfolioContent.softSkills,
      projects: parsed.projects ?? defaultPortfolioContent.projects,
      blogPosts: parsed.blogPosts ?? defaultPortfolioContent.blogPosts,
      educationTitle: parsed.educationTitle ?? defaultPortfolioContent.educationTitle,
      educationDetails: parsed.educationDetails ?? defaultPortfolioContent.educationDetails,
      achievements: parsed.achievements ?? defaultPortfolioContent.achievements,
      contactEmail: parsed.contactEmail ?? defaultPortfolioContent.contactEmail,
    };
  } catch {
    return defaultPortfolioContent;
  }
};
