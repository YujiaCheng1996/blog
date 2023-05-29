import type { CollectionEntry } from "astro:content";
const currentDate = new Date();

export function sortMDByDate(posts: CollectionEntry<"post">[] = []) {
	return posts.sort(
		(a, b) =>
			new Date(b.data.publishDate ?? currentDate).valueOf() -
			new Date(a.data.publishDate ?? currentDate).valueOf()
	);
}

export function getUniqueTags(posts: CollectionEntry<"post">[] = []) {
	const uniqueTags = new Set<string>();
	posts.forEach((post) => {
		post.data.tags?.map((tag) => uniqueTags.add(tag));
	});
	return Array.from(uniqueTags);
}

export function getUniqueTagsWithCount(posts: CollectionEntry<"post">[] = []): {
	[key: string]: number;
} {
	return posts.reduce((prev, post) => {
		const runningTags: { [key: string]: number } = { ...prev };
		post.data.tags?.forEach((tag) => {
			runningTags[tag] = (runningTags[tag] || 0) + 1;
		});
		return runningTags;
	}, {});
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
