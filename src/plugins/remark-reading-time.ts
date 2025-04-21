import { toString as mdastToString } from "mdast-util-to-string";
import getReadingTime from "reading-time";

function millisecondsToTimeDescription(seconds:number) {
    if (seconds < 0) seconds = 0;
    if (seconds < 60) {
        return "阅读需约 " + Math.ceil(seconds) + " 秒";
    } else if (seconds < 3600) {
        const minutes = seconds / 60;
        return  "阅读需约 " + Math.ceil(minutes) + " 分种";
    } else {
        const hours = seconds / 3600;
        const ceiledHours = Math.ceil(hours * 100) / 100;
        let str = ceiledHours.toFixed(2);
        let parts = str.split('.');
        if (parts.length > 1) {
            parts[1] = parts[1]!.replace(/0+$/, ''); 
            if (parts[1] === '') {
                str = parts[0]!;
            } else {
                str = parts[0] + '.' + parts[1];
            }
        }
        return  "阅读需约 " + str + " 小时";
    }
}

function estimateReadingTime(text:string|undefined) {
    if (typeof text !== 'string' || text.trim() === '') {
        return '0 秒';
    }

    const isChinese = /[\u4e00-\u9fa5]/.test(text);

    if (isChinese) {
        const charCount = text.length; 
        const wordsPerSecond = 8; 
        const seconds = charCount / wordsPerSecond;
        return millisecondsToTimeDescription(seconds);
    } else {
        const stats = getReadingTime(text);
        const seconds = stats.time / 1000;
        return millisecondsToTimeDescription(seconds);
    }
}

export function remarkReadingTime() {
	// @ts-expect-error:next-line
	return (tree, { data }) => {
		const textOnPage = mdastToString(tree);
		const readingTime = estimateReadingTime(textOnPage);
		data.astro.frontmatter.readingTime = readingTime;
	};
}
