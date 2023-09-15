import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
const currentDate = new Date();

/** Note: this function filters out draft posts based on the environment */
export async function getAllPosts() {
	return Object.entries({
		post: await getCollection("post", ({ data }) => {
			return import.meta.env.PROD ? data.draft !== true : true;
		}),
		post2: await getCollection("post2", ({ data }) => {
			return import.meta.env.PROD ? data.draft !== true : true;
		}),
	})
		.map(([collection, posts]) => posts.map((post) => ({ ...post, collection })))
		.flat();
}

export function sortMDByDate(posts: Array<CollectionEntry<"post">>) {
	return posts.sort((a, b) => {
		const aDate = new Date(a.data.updatedDate ?? a.data.publishDate ?? currentDate).valueOf();
		const bDate = new Date(b.data.updatedDate ?? b.data.publishDate ?? currentDate).valueOf();
		return bDate - aDate;
	});
}

/** Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so. */
export function getAllTags(posts: Array<CollectionEntry<"post">>) {
	return posts.flatMap((post) => [...(post.data.tags ?? [])]);
}

/** Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so. */
export function getUniqueTags(posts: Array<CollectionEntry<"post">>) {
	return [...new Set(getAllTags(posts))];
}

/** Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so. */
export function getUniqueTagsWithCount(
	posts: Array<CollectionEntry<"post">>,
): Array<[string, number]> {
	return [
		...getAllTags(posts).reduce(
			(acc, t) => acc.set(t, (acc.get(t) || 0) + 1),
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
