import type { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
	// Used as a meta property (src/components/BaseHead.astro L:31 + L:49)
	author: "YujiaCheng1996",
	// Meta property used to construct the meta title property, found in src/components/BaseHead.astro L:11
	title: "个人博客",
	// Meta property used as the default description meta property
	description: "基于astro-theme-cactus的个人博客",
	// HTML lang property, found in src/layouts/Base.astro L:18
	lang: "zh-cmn-Hans-CN",
	// Meta property, found in src/components/BaseHead.astro L:42
	ogLocale: "zh_CN",
	// Date.prototype.toLocaleDateString() parameters, found in src/utils/date.ts.
	date: {
		locale: "zh-Hans-CN",
		options: {
			day: "numeric",
			month: "short",
			year: "numeric",
		},
	},
	// Include view-transitions: https://docs.astro.build/en/guides/view-transitions/
	includeViewTransitions: false,
	webmentions: {
		link: "https://webmention.io/astro-cactus.chriswilliams.dev/webmention",
	},
};

// Used to generate links in both the Header & Footer.
export const menuLinks: Array<{ title: string; path: string }> = [
	{
		title: "首页",
		path: "/",
	},
	{
		title: "关于",
		path: "/about",
	},
	{
		title: "博客",
		path: "/post",
	},
];
