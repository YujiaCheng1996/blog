import { getAllPosts, getTitle, getDescription } from "@/data/post";
import { siteConfig } from "@/site-config";
import rss from "@astrojs/rss";

export const GET = async () => {
	const posts = await getAllPosts();

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
