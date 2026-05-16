import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { site } from "~/data/site";

export async function GET(context: APIContext) {
  const posts = (await getCollection("posts"))
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: site.name,
    description: site.description,
    site: context.site ?? site.url,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/posts/${post.id}/`,
    })),
    customData: `<language>en-ca</language>`,
  });
}
