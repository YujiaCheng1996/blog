import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { siteConfig } from "@/site-config";
import { getTitle, getDescription } from "@/utils";

export const get = async () => {
	const posts = Object.entries({
		post: await getCollection("post"),
		post2: await getCollection("post2"),
	})
		.map(([collection, posts]) => posts.map((post) => ({ ...post, collection })))
		.flat();

	return rss({
		title: siteConfig.title,
		description: siteConfig.description,
		site: import.meta.env.SITE,
		items: posts.map((post) => ({
			title: post.data.title ?? getTitle(post.body),
			description: post.data.description ?? getDescription(post.body),
			pubDate: post.data.publishDate ?? new Date(),
			link: `${post.collection}/${post.slug}`,
		})),
	});
};
