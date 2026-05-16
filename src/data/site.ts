export const site = {
  name: "Mokhtar Tabari",
  title: "Mokhtar Tabari — Assistant Professor of Economics",
  description:
    "Assistant Professor of Economics at University Canada West and Sessional Lecturer at UBC Sauder. Research on international trade, energy and environmental economics, and applied microeconomics.",
  url: "https://mokhtartabari.github.io",
  position: "Assistant Professor of Economics",
  institutions: [
    {
      name: "University Canada West",
      role: "Assistant Professor",
      url: "https://www.ucanwest.ca/",
    },
    {
      name: "UBC Sauder School of Business",
      role: "Sessional Lecturer",
      url: "https://www.sauder.ubc.ca/",
    },
  ],
  location: "Vancouver, Canada",
  email: "mokhtar.tabari@ucanwest.ca",
  cv: "/files/cv.pdf",
  socials: {
    scholar:
      "https://scholar.google.com/citations?user=Eti_yWQAAAAJ&hl=en",
    linkedin: "https://www.linkedin.com/in/mokhtar-tabari/",
    github: "https://github.com/mokhtartabari",
    bluesky: "https://bsky.app/profile/mokhtartabari.bsky.social",
  },
  researchInterests: [
    "International Trade",
    "Energy & Environmental Economics",
    "Applied Microeconomics",
    "Economics of AI",
  ],
} as const;

export type Site = typeof site;
