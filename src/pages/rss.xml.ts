import rss from "@astrojs/rss";
import { siteConfig } from "@/site-config";
import { getAllPosts, getTitle, getDescription } from "@/data/post";

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
