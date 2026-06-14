export const site = {
  name: "Mokhtar Tabari",
  title: "Mokhtar Tabari — Economist",
  description:
    "Economist working on development economics and international trade, energy and environmental economics, and the economics of AI. Based in Vancouver, Canada.",
  url: "https://mokhtartabari.github.io",
  position: "Instructor of Economics",
  institutions: [
    {
      name: "Capilano University",
      role: "Instructor",
      url: "https://www.capilanou.ca/",
    },
    {
      name: "UBC Sauder School of Business",
      role: "Sessional Instructor",
      url: "https://www.sauder.ubc.ca/",
    },
  ],
  location: "Vancouver, Canada",
  email: "mokhtartabari@capilanou.ca",
  emailPersonal: "mokhtar.tab@gmail.com",
  cv: "/files/cv.pdf",
  socials: {
    scholar:
      "https://scholar.google.com/citations?user=Eti_yWQAAAAJ&hl=en",
    linkedin: "https://www.linkedin.com/in/mokhtar-tabari/",
    github: "https://github.com/mokhtartabari",
    bluesky: "https://bsky.app/profile/mokhtartabari.bsky.social",
    sponsor: "https://github.com/sponsors/mokhtartabari",
    stripe: "https://buy.stripe.com/cNieVd65a9PddYZfT85AQ00",
  },
  researchInterests: [
    "International Trade",
    "Development Economics",
    "Energy & Environmental Economics",
    "Applied Microeconomics",
    "Economics of AI",
  ],
} as const;

export type Site = typeof site;
