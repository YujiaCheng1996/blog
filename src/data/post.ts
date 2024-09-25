import { type CollectionEntry, getCollection } from "astro:content";
const currentDate = new Date();
import { siteConfig } from "@/site-config";

/** filter out draft posts based on the environment */
export async function getAllPosts() {
	return Object.entries({
		post: await getCollection("post", ({ data }) => {
			return import.meta.env.PROD ? !data.draft : true;
		}),
		post2: await getCollection("post2", ({ data }) => {
			return import.meta.env.PROD ? !data.draft : true;
		}),
	})
		.map(([collection, posts]) => posts.map((post) => ({ ...post, collection })))
		.flat() as Array<CollectionEntry<"post">>;
}

/** returns the date of the post based on option in siteConfig.sortPostsByUpdatedDate */
export function getPostSortDate(post: CollectionEntry<"post">) {
	return siteConfig.sortPostsByUpdatedDate && post.data.updatedDate !== undefined
		? new Date(post.data.updatedDate)
		: new Date(post.data.publishDate ?? currentDate);
}

/** sort post by date (by siteConfig.sortPostsByUpdatedDate), desc.*/
export function sortMDByDate(posts: CollectionEntry<"post">[]) {
	return posts.sort((a, b) => {
		const aDate = getPostSortDate(a).valueOf();
		const bDate = getPostSortDate(b).valueOf();
		return bDate - aDate;
	});
}

/** groups posts by year (based on option siteConfig.sortPostsByUpdatedDate), using the year as the key
 *  Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so.
 */
export function groupPostsByYear(posts: CollectionEntry<"post">[]) {
	return posts.reduce<Record<string, CollectionEntry<"post">[]>>((acc, post) => {
		const year = getPostSortDate(post).getFullYear();
		if (!acc[year]) {
			acc[year] = [];
		}
		acc[year]?.push(post);
		return acc;
	}, {});
}

/** returns all tags created from posts (inc duplicate tags)
 *  Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so.
 *  */
export function getAllTags(posts: Array<CollectionEntry<"post">>) {
	return posts.flatMap((post) => [...(post.data.tags ?? [])]);
}

/** returns all unique tags created from posts
 *  Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so.
 *  */
export function getUniqueTags(posts: CollectionEntry<"post">[]) {
	return [...new Set(getAllTags(posts))];
}

/** returns a count of each unique tag - [[tagName, count], ...]
 *  Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so.
 *  */
export function getUniqueTagsWithCount(posts: CollectionEntry<"post">[]): [string, number][] {
	return [
		...getAllTags(posts).reduce(
			(acc, t) => acc.set(t, (acc.get(t) ?? 0) + 1),
			new Map<string, number>(),
		),
	].sort((a, b) => b[1] - a[1]);
}

export function getTitle(body: string): string {
	const newBody = body.replaceAll(/[#]/g, "");
	const lines = newBody.split(/[\n]/);
	for (const line of lines) {
		if (line?.length) {
			return line.substring(0, 50);
		}
	}
	return "无标题";
}

export function getDescription(body: string): string {
	const newBody = body
		.replaceAll(/([#-]+ *)/g, "")
		.replaceAll(/(!*\[[^\]]*\])/g, " ")
		.replaceAll(/(!*\([^)]*\))/g, "");
	const lines = newBody.split(/[\n]/);
	let result = "";
	for (const line of lines) {
		if (line?.length) {
			result += line + " ";
			if (result.length >= 150) {
				return result.substring(0, 150);
			}
		}
	}
	return "无标题";
}
