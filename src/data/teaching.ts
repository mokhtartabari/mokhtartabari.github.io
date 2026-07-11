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
  "His teaching is grounded in three commitments. First, meeting students where they are: he teaches learners from a wide range of academic, cultural, and professional backgrounds — from first-year undergraduates encountering supply and demand for the first time to working-professional MBAs — and designs his courses so that economic theory becomes accessible without losing rigor.",
  "Second, evidence-based pedagogy. He treats teaching as an empirical question. He has designed and tested classroom approaches that combine flipped instruction, peer assessment, generative AI for active learning, and live case studies, and has published this work in peer-reviewed venues.",
  "Third, connecting theory to the world. He wants students to leave a course with the analytical habits to make sense of the economy they will graduate into — using contemporary policy debates, real data, and case material drawn from the firms and markets they will encounter.",
];

export const interests = [
  "Undergraduate economics — principles, intermediate, and field courses",
  "International trade (upper-division and graduate)",
  "Panel data econometrics and quantitative methods",
];

// Institution-neutral teaching evidence (evaluations, peer observations, PD).
export const effectiveness = {
  evalCourse: "MBAF 504: Business Economics",
  evalBefore: 87.4,
  evalPeak: 94.2,
  videoViews: "3,000+",
};

export const studentQuotes = [
  {
    quote:
      "This has been a very interactive and effective class. The instructor made sure we learned, wrote, and practiced.",
    source: "MBA student, Spring 2022",
  },
  {
    quote:
      "I am very impressed with the teaching method through video and in-class activities. It helped me grasp and learn economics fundamentals easily.",
    source: "MBA student, Fall 2021",
  },
];

export const peerObservations = [
  {
    quote:
      "Creative, inclusive, and clearly communicated … an exemplary colleague whose practices align with the vision of the department and university in fostering academic excellence and innovation.",
    name: "Eduardo Azmitia",
    role: "Capilano University",
  },
  {
    quote:
      "An excellent instructor who treats his students with respect and tries to instil motivation in them to learn more. His class covered the learning outcomes of the course uniquely and ingeniously.",
    name: "Chieko Tanimura",
    role: "Economics Department Convenor, Capilano University",
  },
  {
    quote:
      "Articulate, enthusiastic, confident, prepared … easy to follow and explains complex ideas very clearly. Dr. Tabari is a gifted teacher who cares a lot about his students learning the course material.",
    name: "Peter Tsigaris",
    role: "Thompson Rivers University",
  },
];

export const professionalDevelopment = [
  {
    title: "LEADing in Learning: Teaching with AI (Certificate)",
    org: "Capilano University",
    year: "2024",
  },
  {
    title: "Centre for Excellence in Learning and Teaching workshops",
    org: "Thompson Rivers University",
    year: "",
  },
  {
    title: "Teaching Online Series",
    org: "UBC Sauder School of Business",
    year: "",
  },
  {
    title: "Instructional Skills Workshop (ISW)",
    org: "Taylor Institute, University of Calgary",
    year: "2018",
  },
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
