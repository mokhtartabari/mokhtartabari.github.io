export type CourseEntry = {
  code?: string;
  title: string;
  level: "graduate" | "upper-undergrad" | "principles" | "methods" | "general";
};

export type TeachingAppointment = {
  institution: string;
  role: string;
  period: string;
  url?: string;
  courses: CourseEntry[];
};

export const philosophy = [
  "My teaching is grounded in three commitments. First, meeting students where they are: I teach learners from a wide range of academic, cultural, and professional backgrounds — from first-year undergraduates encountering supply and demand for the first time to working-professional MBAs — and I design my courses so that economic theory becomes accessible without losing rigor.",
  "Second, evidence-based pedagogy. I treat my own teaching as an empirical question. I have designed and tested classroom approaches that combine flipped instruction, peer assessment, generative AI for active learning, and live case studies, and I have published this work in peer-reviewed venues.",
  "Third, connecting theory to the world. I want students to leave a course with the analytical habits to make sense of the economy they will graduate into — using contemporary policy debates, real data, and case material drawn from the firms and markets they will encounter.",
];

export const interests = [
  "Undergraduate economics — principles, intermediate, and field courses",
  "Development economics and international trade (upper-division and graduate)",
  "Panel data econometrics and quantitative methods",
];

export const innovations = [
  {
    title: "AI-Generated Think-Pair-Share (AI-TPS) Framework",
    summary:
      "A pedagogical framework that uses generative AI to help instructors efficiently produce customized, up-to-date active-learning exercises for principles of economics — reducing instructor preparation costs and making evidence-based pedagogy more scalable.",
    paperSlug: "ai-tps",
  },
  {
    title: "Flipped Classroom + Peer Assessment for MBA Economics",
    summary:
      "An integrated course design developed and tested over two consecutive terms with incoming MBA students. Surveys show improved engagement, deeper understanding, and stronger self-assessment skills.",
    paperSlug: "peer-assessment-flipped-classroom",
  },
  {
    title: "Live Case Studies in Graduate Business Courses",
    summary:
      "A randomized control trial design measuring the effect of live business cases on graduate students' confidence in real-world problem-solving, communication, and leadership.",
    paperSlug: "live-case-studies",
  },
];

export const appointments: TeachingAppointment[] = [
  {
    institution: "Capilano University",
    role: "Instructor",
    period: "2022 – Present",
    url: "https://www.capilanou.ca/",
    courses: [
      {
        code: "ECON 100",
        title: "Introduction to Economics",
        level: "principles",
      },
      {
        code: "ECON 111",
        title: "Principles of Microeconomic Theory",
        level: "principles",
      },
    ],
  },
  {
    institution: "UBC Sauder School of Business",
    role: "Sessional Instructor",
    period: "2020, 2023 – Present",
    url: "https://www.sauder.ubc.ca/",
    courses: [
      {
        code: "COMM 394",
        title: "Environment, Society, and Government",
        level: "upper-undergrad",
      },
    ],
  },
  {
    institution: "University Canada West",
    role: "Assistant Professor",
    period: "2020 – 2026",
    url: "https://www.ucanwest.ca/",
    courses: [
      { code: "MBAF 504", title: "Business Economics", level: "graduate" },
      {
        code: "ECON 104",
        title: "Principles of Macroeconomics",
        level: "principles",
      },
      {
        code: "ECON 102",
        title: "Principles of Microeconomics",
        level: "principles",
      },
      { code: "MATH 101", title: "Business Mathematics", level: "methods" },
      { code: "MATH 201", title: "Business Statistics", level: "methods" },
      {
        code: "MATH 202",
        title: "Quantitative Decision Making",
        level: "methods",
      },
      {
        code: "BUSI 100",
        title: "Introduction to Business",
        level: "general",
      },
    ],
  },
  {
    institution: "Thompson Rivers University",
    role: "Sessional Instructor",
    period: "2020 – 2022",
    url: "https://www.tru.ca/",
    courses: [
      {
        code: "ECON 1900",
        title: "Principles of Microeconomics",
        level: "principles",
      },
      {
        code: "ECON 2330",
        title: "Statistics for Business and Economics",
        level: "methods",
      },
    ],
  },
  {
    institution: "University of Calgary",
    role: "Instructor",
    period: "2019",
    url: "https://www.ucalgary.ca/",
    courses: [
      {
        code: "ECON 321",
        title: "The Global Trading System",
        level: "upper-undergrad",
      },
    ],
  },
];

export const serviceRoles = [
  {
    title: "Course Lead, MBAF 504: Business Economics",
    org: "University Canada West",
    period: "2022 – 2025",
    note: "Over 25 sections",
  },
];

export const teachingAssistantships = {
  institution: "University of Calgary",
  period: "2014 – 2020",
  summary:
    "Teaching assistant for a broad set of undergraduate and graduate economics courses, including graduate-level International Trade, Econometrics I, Macroeconomics, Microeconomics, Empirical Energy Economics, Economics of Natural Resources, Statistics for Economics, Managerial and Decision Economics, and related applied microeconomics courses.",
};

export const levelLabels: Record<CourseEntry["level"], string> = {
  graduate: "Graduate",
  "upper-undergrad": "Upper-division",
  principles: "Principles",
  methods: "Methods",
  general: "Foundations",
};

export const levelColors: Record<CourseEntry["level"], string> = {
  graduate:
    "bg-accent-500/10 text-accent-700 dark:text-accent-300 ring-accent-500/20",
  "upper-undergrad":
    "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-emerald-500/20",
  principles:
    "bg-sky-500/10 text-sky-700 dark:text-sky-300 ring-sky-500/20",
  methods:
    "bg-amber-500/10 text-amber-700 dark:text-amber-300 ring-amber-500/20",
  general:
    "bg-ink-500/10 text-ink-700 dark:text-ink-300 ring-ink-500/20",
};
