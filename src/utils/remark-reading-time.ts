import getReadingTime from "reading-time";
import { toString } from "mdast-util-to-string";

export function remarkReadingTime() {
	// @ts-expect-error:next-line
	return function (tree, { data }) {
		const textOnPage = toString(tree);
		const readingTime = getReadingTime(textOnPage);
		data.astro.frontmatter.minutesRead = `全文约 ${readingTime.words} 字 阅读需约 ${readingTime.minutes} 分钟`;
	};
}
