import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const publications = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/publications" }),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    year: z.number(),
    venue: z.string().optional(),
    venueShort: z.string().optional(),
    status: z.enum([
      "published",
      "accepted",
      "revise-and-resubmit",
      "working-paper",
    ]),
    abstract: z.string(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    links: z
      .array(
        z.object({
          label: z.string(),
          href: z.string(),
          icon: z.enum([
            "pdf",
            "doi",
            "code",
            "data",
            "slides",
            "media",
            "preprint",
            "external",
          ]),
        }),
      )
      .default([]),
    tags: z.array(z.string()).default([]),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { publications, posts };
