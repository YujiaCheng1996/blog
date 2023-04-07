interface SiteConfig {
	author: string;
	title: string;
	description: string;
	lang: string;
	ogLocale: string;
	themeColorLight: string;
	themeColorDark: string;
	date: {
		locale: string | string[] | undefined;
		options: Intl.DateTimeFormatOptions;
	};
}

export const siteConfig: SiteConfig = {
	// Used as both a meta property (src/components/BaseHead.astro L:31 + L:49) & the generated satori png (src/pages/og-image/[slug].png.ts)
	author: "YujiaCheng1996",
	// Meta property used to construct the meta title property, found in src/components/BaseHead.astro L:11
	title: "个人博客",
	// Meta property used as a default description meta property
	description: "基于astro-theme-cactus的个人博客",
	// HTML lang property, found in src/layouts/Base.astro L:18
	lang: "zh-cmn-Hans-CN",
	// Meta property, found in src/components/BaseHead.astro L:42
	ogLocale: "zh_CN",
	// Sets the meta data theme-color, found in src/components/BaseHead.astro L:34. Toggling the dark mode will update the meta content with either light/dark color, implementation in src/layouts/Base.astro L:41.
	themeColorLight: "#fafafa",
	themeColorDark: "#1d1f21",
	// Date.prototype.toLocaleDateString() parameters, found in src/utils/date.ts.
	date: {
		locale: "zh-Hans-CN",
		options: {
			day: "numeric",
			month: "short",
			year: "numeric",
		},
	},
};
