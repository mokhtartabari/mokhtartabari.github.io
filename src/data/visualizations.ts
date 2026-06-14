export interface ChartEntry {
  slug: string;
  filename: string;
  title: string;
  description?: string;
  category?: string;
  span?: string; // "full" → chart spans the full grid width
  /** Formats available for this chart, e.g. ["png","svg","pdf"]. PNG always present. */
  formats?: string[];
  /** True when a <base>.csv of the underlying series exists for download. */
  csv?: boolean;
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
      "A comprehensive look at Canadian GDP — aggregate real output growth, provincial breakdowns, industry-level contributions, and structural shifts across sectors. Based on Statistics Canada national accounts data and automatically refreshed.",
    repo: "https://github.com/mokhtartabari/gdp-data-viz",
    repoLabel: "gdp-data-viz",
    chartsDir: "/charts/gdp/",
  },
  {
    slug: "trade",
    title: "Trade & Exports",
    description:
      "Canadian merchandise exports — U.S. vs the rest of the world, levels and growth.",
    longDescription:
      "Canada's merchandise trade through the lens of its export markets — monthly export levels and growth for the United States versus the rest of the world, on a balance-of-payments basis. Based on Statistics Canada international trade data and refreshed automatically.",
    repo: "https://github.com/mokhtartabari/trade-data-viz",
    repoLabel: "trade-data-viz",
    chartsDir: "/charts/trade/",
  },
  {
    slug: "employment",
    title: "Employment & Labour",
    description:
      "Canada's labour market — unemployment, employment levels, and participation by age and industry.",
    longDescription:
      "Canada's labour market from the Labour Force Survey — the headline unemployment rate and employment level, full- vs part-time composition, unemployment and participation by age group, the provincial unemployment map, and industry-level comparisons. Refreshed automatically with each LFS release.",
    repo: "https://github.com/mokhtartabari/employment-data-viz",
    repoLabel: "employment-data-viz",
    chartsDir: "/charts/employment/",
  },
];
