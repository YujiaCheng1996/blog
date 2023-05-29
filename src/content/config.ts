import { z, defineCollection } from "astro:content";

function removeDupsAndLowerCase(array: string[]) {
	if (!array.length) return array;
	const lowercaseItems = array.map((str) => str.toLowerCase());
	const distinctItems = new Set(lowercaseItems);
	return Array.from(distinctItems);
}

const post = defineCollection({
	schema: z.object({
		title: z.string().max(50).optional(),
		description: z.string().max(150).optional(),
		publishDate: z
			.string()
			.transform((str) => new Date(str))
			.optional(),
		tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase).optional(),
	}),
});

export const collections = { post, post2: post };
