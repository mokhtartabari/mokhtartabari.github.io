export interface ChartEntry {
  slug: string;
  filename: string;
  title: string;
  description?: string;
  category?: string;
  span?: string; // "full" → chart spans the full grid width
}

export interface VizManifest {
  topic: string;
  updated: string | null;
  charts: ChartEntry[];
}

export interface VizTopic {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  repo: string;
  repoLabel: string;
  chartsDir: string;
}

export const vizTopics: VizTopic[] = [
  {
    slug: "inflation",
    title: "Inflation & Prices",
    description:
      "Canadian CPI trends, provincial comparisons, and sector-level price dynamics.",
    longDescription:
      "An in-depth look at inflation dynamics across Canada — CPI trends over time, geographic divergence across provinces, and sector-level price pressures. Generated directly from Statistics Canada microdata and refreshed automatically with each new data release.",
    repo: "https://github.com/mokhtartabari/inflation-data-viz",
    repoLabel: "inflation-data-viz",
    chartsDir: "/charts/inflation/",
  },
  {
    slug: "gdp",
    title: "GDP & Economic Growth",
    description:
      "Real GDP, provincial output, sector contributions, and growth decompositions.",
    longDescription:
      "A comprehensive look at Canadian GDP — aggregate real output growth, provincial breakdowns, industry-level contributions, economic diffusion indexes, and structural shifts across sectors. Based on Statistics Canada national accounts data and automatically refreshed.",
    repo: "https://github.com/mokhtartabari/gdp-data-viz",
    repoLabel: "gdp-data-viz",
    chartsDir: "/charts/gdp/",
  },
];
