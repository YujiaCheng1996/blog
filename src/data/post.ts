import { type CollectionEntry, getCollection } from "astro:content";
import { fromMarkdown as mdastFromMarkdown } from "mdast-util-from-markdown";
import { toString as mdastToString } from "mdast-util-to-string";
import type { SetNonNullableDeep, SetRequiredDeep } from "type-fest";

/** filter out draft posts based on the environment */
export async function getAllPosts(): Promise<
	SetRequiredDeep<
		SetNonNullableDeep<CollectionEntry<"post">, "data.description">,
		"data.description"
	>[]
> {
	return (
		await getCollection("post", ({ data }) => {
			return import.meta.env.PROD ? !data.draft : true;
		})
	).map((post) => {
		let title = post.data.title ?? "";
		if (!title) {
			let description = post.data.description ?? "";
			if (post.body) {
				const lines = post.body.split("\n");
				for (const line of lines) {
					const trimedLine = mdastToString(mdastFromMarkdown(line), {
						includeImageAlt: false,
						includeHtml: false,
					}).trim();
					if (trimedLine.length) {
						if (!title) {
							title += trimedLine.substring(0, 60);
						}
						if (post.data.description) {
							break;
						}
						description += `${trimedLine} `;
						if (description.length >= 150) {
							description = description.substring(0, 150);
							break;
						}
					}
				}
			}
			post.data.title = title || "无标题";
			post.data.description = description;
		}
		return post as SetRequiredDeep<
			SetNonNullableDeep<CollectionEntry<"post">, "data.description">,
			"data.description"
		>;
	});
}

/** Get tag metadata by tag name */
export async function getTagMeta(tag: string): Promise<CollectionEntry<"tag"> | undefined> {
	const tagEntries = await getCollection("tag", (entry) => {
		return entry.id === tag;
	});
	return tagEntries[0];
}

/** groups posts by year (based on option siteConfig.sortPostsByUpdatedDate), using the year as the key
 *  Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so.
 */
export function groupPostsByYear(posts: CollectionEntry<"post">[]) {
	return Object.groupBy(posts, (post) => post.data.publishDate.getFullYear().toString());
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
