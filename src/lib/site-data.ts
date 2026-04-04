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

export type EducationItem = {
  id: string;
  degree: string;
  institution: string;
  period: string;
  details: string;
};

export type CertificateItem = {
  id: string;
  title: string;
  issuer: string;
  year: string;
  details: string;
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
  educationItems: EducationItem[];
  certificates: CertificateItem[];
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
    "Java",
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
    {
      id: "p4",
      title: "Student Result Analyzer",
      description:
        "A Java desktop project that stores student marks, calculates GPA, and generates subject-wise performance summaries with pass/fail insights.",
      stack: "Java, JavaFX, MySQL",
    },
    {
      id: "p5",
      title: "Library Management API",
      description:
        "A Java backend system for managing books, borrowing records, and due-date notifications with role-based access for admin and students.",
      stack: "Java, Spring Boot, PostgreSQL, JWT",
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
  educationItems: [
    {
      id: "e1",
      degree: "B.Sc. in Computer Science and Engineering",
      institution: "University Program",
      period: "2023 - Present",
      details:
        "Studying core computer science, software engineering, and project-based development with a focus on practical systems.",
    },
    {
      id: "e2",
      degree: "Higher Secondary / Pre-University",
      institution: "Science Background",
      period: "2021 - 2023",
      details:
        "Built a strong foundation in mathematics, logic, and analytical problem solving before entering CSE.",
    },
  ],
  certificates: [
    {
      id: "c1",
      title: "Web Development Fundamentals",
      issuer: "Online Learning Platform",
      year: "2025",
      details: "Certificate covering responsive UI, semantic HTML, CSS, and modern frontend workflows.",
    },
    {
      id: "c2",
      title: "Problem Solving and Algorithms",
      issuer: "Programming Course",
      year: "2024",
      details: "Completed training in algorithmic thinking, data structures, and structured coding practice.",
    },
  ],
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
    const asStringArray = (value: unknown, fallback: string[]) =>
      Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : fallback;
    const asEducationArray = (value: unknown) =>
      Array.isArray(value)
        ? value.filter(
            (item): item is EducationItem =>
              Boolean(item) &&
              typeof item === "object" &&
              typeof (item as EducationItem).id === "string" &&
              typeof (item as EducationItem).degree === "string" &&
              typeof (item as EducationItem).institution === "string" &&
              typeof (item as EducationItem).period === "string" &&
              typeof (item as EducationItem).details === "string",
          )
        : defaultPortfolioContent.educationItems;
    const asCertificateArray = (value: unknown) =>
      Array.isArray(value)
        ? value.filter(
            (item): item is CertificateItem =>
              Boolean(item) &&
              typeof item === "object" &&
              typeof (item as CertificateItem).id === "string" &&
              typeof (item as CertificateItem).title === "string" &&
              typeof (item as CertificateItem).issuer === "string" &&
              typeof (item as CertificateItem).year === "string" &&
              typeof (item as CertificateItem).details === "string",
          )
        : defaultPortfolioContent.certificates;

    return {
      heroBio: parsed.heroBio ?? defaultPortfolioContent.heroBio,
      about: parsed.about ?? defaultPortfolioContent.about,
      technicalSkills: asStringArray(parsed.technicalSkills, defaultPortfolioContent.technicalSkills),
      softSkills: asStringArray(parsed.softSkills, defaultPortfolioContent.softSkills),
      projects: Array.isArray(parsed.projects) ? parsed.projects : defaultPortfolioContent.projects,
      blogPosts: Array.isArray(parsed.blogPosts) ? parsed.blogPosts : defaultPortfolioContent.blogPosts,
      educationTitle: parsed.educationTitle ?? defaultPortfolioContent.educationTitle,
      educationDetails: parsed.educationDetails ?? defaultPortfolioContent.educationDetails,
      educationItems: asEducationArray(parsed.educationItems),
      certificates: asCertificateArray(parsed.certificates),
      achievements: asStringArray(parsed.achievements, defaultPortfolioContent.achievements),
      contactEmail: parsed.contactEmail ?? defaultPortfolioContent.contactEmail,
    };
  } catch {
    return defaultPortfolioContent;
  }
};
