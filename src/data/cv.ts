// CV-only data.
//
// The generated CV (/cv → public/files/cv.pdf) reuses the SAME site data as the
// rest of the website — `about.ts` (experience, education, awards, otherExperience),
// the `publications` collection, `teaching.ts` (appointments, TA, service), and
// `talks.ts` (presentations). Update those and the CV regenerates on the next build.
//
// This file holds only the few sections the website doesn't already model.

export const contact = {
  phone: "(672) 673-0025", // shown on the PDF only when SHOW_PHONE is true in cv.astro
  email: "mokhtartabari@capilanou.ca",
  website: "mokhtartabari.github.io",
  websiteUrl: "https://mokhtartabari.github.io",
  // Optional QR to the website — drop the PNG at public/img/cv-qr.png to include it.
  qr: "/img/cv-qr.png",
};

export const teachingCertificates = [
  {
    name: "LEADing in Learning: Teaching with AI Certificate",
    org: "Capilano University",
    year: "2024",
  },
  {
    name: "Instructional Skills Workshop (ISW) Certificate",
    org: "Taylor Institute for Teaching and Learning, University of Calgary",
    year: "2018",
  },
];

export const computerSkills = {
  software: ["Stata", "R", "Python", "MS Office", "LaTeX"],
  teaching: [
    "Zoom", "MS Teams", "BigBlueButton", "Moodle", "Canvas",
    "Brightspace (D2L)", "iClicker", "Poll Everywhere", "Mentimeter", "Kahoot!",
  ],
};

// Service / reviewing beyond the Course-Lead role already in teaching.ts (serviceRoles).
export const service = [
  { role: "ACBSP Teaching Excellence Award Reviewer", period: "2024" },
  {
    role: "Research and Scholarly Activity Committee Member",
    org: "University Canada West",
    period: "2021 – 2025",
  },
  {
    role: "Reviewer, Journal of Environmental Economics and Management",
    period: "2020",
  },
];
