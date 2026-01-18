# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Tooling & commands

This is an Astro v5 site using pnpm as the package manager (see `package.json: packageManager`). All commands below assume pnpm; substitute `npm`/`yarn` if you prefer.

### Install & local development

- Install dependencies: `pnpm install`
- Start dev server: `pnpm dev`
  - Runs the Astro dev server (see README; defaults to `http://localhost:3000`).

### Build, preview & search index

- Production build (HTML/JS/CSS into `dist/`): `pnpm build`
- Build Pagefind search index from the built site: `pnpm postbuild`
- Build + search index + preview locally:
  - `pnpm build && pnpm postbuild && pnpm preview`
- Preview an existing build: `pnpm preview`

Pagefind-based search only works against a built site, so ensure `pnpm postbuild` has been run after `pnpm build` when validating search results locally.

### Linting, formatting & type checking

- Lint (Biome): `pnpm lint`
- Format code & imports:
  - All-in-one: `pnpm format`
  - Code style only (Biome + Prettier): `pnpm format:code`
  - Imports only (Biome): `pnpm format:imports`
- Astro type / diagnostics check: `pnpm check`

### Testing

There is currently **no test script** defined in `package.json` and no test framework configured. Do not assume commands like `pnpm test` or `pnpm test -- <pattern>` exist; if you introduce a test runner, add appropriate scripts and update this section.

### Content collections tooling

- Regenerate TypeScript types for content collections after changing `src/content/config.ts`:
  - `pnpm sync`

## High-level architecture

### Routing, layouts & page shell

- **Routing** is file-based under `src/pages`:
  - `src/pages/index.astro` – home page, showing three curated sections of posts based on tags (`showcase`, `archive`, `musings`).
  - `src/pages/posts/[...slug].astro` – per-post route sourced from content collections; uses `getAllPosts()` for static paths and wraps content in the blog layout.
  - `src/pages/posts/[...page].astro` – paginated list of posts using Astro's `paginate`, plus a tags sidebar populated via `getUniqueTags()` / `groupPostsByYear()`.
  - `src/pages/tags/index.astro` – overview of all tags with counts, linking to `/tags/{tag}/` routes (note: per-tag pages are not yet implemented).
  - `src/pages/about.astro`, `src/pages/404.astro` – static content pages.
  - `src/pages/rss.xml.ts` – RSS feed endpoint built from the post collection.
  - `src/pages/og-image/[...slug].png.ts` – dynamic OG image generator using Satori + Resvg.

- **Global layout shell** lives in `src/layouts/Base.astro`:
  - Imports `BaseHead.astro` for all meta/SEO, `Header`/`Footer` layout components, `ThemeProvider` for theme management, and `SkipLink` for accessibility.
  - Uses `siteConfig.lang` for the `<html lang>` attribute and wraps the app in a constrained-width, background-imaged `<body>`.
  - Includes the `@vercel/analytics/astro` component.

- **Blog post layout** in `src/layouts/BlogPost.astro`:
  - Wraps its children in `BaseLayout` and sets up article-level metadata: it chooses `articleDate` from `updatedDate` or `publishDate`, and the OG image as either `data.ogImage` or `/og-image/{slug}.png`.
  - Calls `post.render()` to access `headings` for the table of contents and passes them into `components/blog/TOC.astro` (which uses `utils/generateToc.ts`).
  - Marks the `<article>` with `data-pagefind-body` so Pagefind indexes only blog content.
  - Renders the `WebMentions` component at the bottom of posts and includes a `Back to Top` button with an `IntersectionObserver` script.

- **Head & metadata** in `src/components/BaseHead.astro`:
  - Composes canonical URLs and social image URLs from `Astro.url`, `Astro.site` and the `ogImage` prop.
  - Imports global styles (`src/styles/global.css`) and sets up favicons, web app manifest links, RSS auto-discovery, sitemap link, and meta tags for Open Graph and Twitter.
  - Uses `siteConfig` for author, site name, description, locale, and optionally webmention `link` / `pingback` URLs.
  - Adds a `meta[name="theme-color"]` tag, which `ThemeProvider` later updates based on the active theme.

- **Theme system** in `src/components/ThemeProvider.astro`:
  - Inlined script (parser-blocking to avoid FOUC) that:
    - Computes the initial theme from `localStorage.theme` or `prefers-color-scheme` (falls back to `light`).
    - Writes the theme to `document.documentElement.dataset.theme`, which drives both Tailwind/CSS variables and Expressive Code theme selectors.
    - Updates `meta[name='theme-color']` from the CSS custom property `--theme-bg` on `document.body`.
    - Persists theme changes back to `localStorage`.
    - Listens to a custom `theme-change` event (fired by `ThemeToggle.astro`) and OS `prefers-color-scheme` changes.
    - Re-applies theme on `astro:after-swap` for view transitions.

### Configuration, types & path aliases

- **Site configuration** lives in `src/site.config.ts`:
  - `siteConfig` (type `SiteConfig` from `src/types.ts`) controls author identity, date formatting (locale + `Intl.DateTimeFormatOptions`), base description, language, OG locale, and whether posts are sorted by `updatedDate` instead of `publishDate`.
  - `menuLinks` drives navigation links in `Header` and `Footer`.
  - `expressiveCodeOptions` configures the `astro-expressive-code` integration, including code font settings, theme list (`dracula` + `github-light`), and a custom `themeCssSelector` that binds Expressive Code themes to the current `data-theme`.

- **Astro configuration** in `astro.config.ts`:
  - Integrations: Tailwind (with `applyBaseStyles: false`), `astro-expressive-code`, `astro-icon`, `@astrojs/mdx`, sitemap, `astro-robots-txt`, `astro-webmanifest` (driven by `siteConfig`), and image optimization (whitelisting `webmention.io`).
  - Markdown pipeline:
    - `remark` plugins: `remark-unwrap-images`, `remarkReadingTime`, `remark-directive`, and `remarkAdmonitions`.
    - `rehypeExternalLinks` forces external links to open in a new tab with `rel="nofollow, noreferrer"`.
  - Sets `prefetch: true` for link prefetching and `site` to the production URL used for canonical URLs, RSS, and webmentions.
  - Adds a Vite plugin (`rawFonts`) to import `.ttf`/`.woff` font files as raw buffers (used in OG image generation).

- **Shared types** in `src/types.ts`:
  - `SiteConfig` / `SiteMeta` types are used across layout and meta components.
  - A small Webmentions type model (`WebmentionsFeed`, `WebmentionsCache`, `WebmentionsChildren`, etc.) is reused in `utils/webmentions.ts` and `components/blog/webmentions`.
  - `AdmonitionType` constrains allowed admonition directive types and is referenced in `plugins/remark-admonitions.ts`.

- **Path aliases** are defined in `tsconfig.json`:
  - Key aliases:
    - `@/assets/*` → `src/assets/*`
    - `@/components/*` → `src/components/*`
    - `@/data/*` → `src/data/*`
    - `@/layouts/*` → `src/layouts/*`
    - `@/utils/*` → `src/utils/*`
    - `@/types` → `src/types.ts`
    - `@/site-config` → `src/site.config.ts`
  - When adding new shared modules, prefer wiring them through these aliases for consistency with existing imports.

### Content model & data utilities

- **Content collections** are defined in `src/content/config.ts` using `defineCollection`:
  - The `post` collection enforces frontmatter via Zod:
    - `title` (max 60 chars) and `description` (50–160 chars) are required.
    - `publishDate` / `updatedDate` are coerced to `Date` instances.
    - `tags` is an array of strings, coerced to lower-case and de-duplicated via `removeDupsAndLowerCase`.
    - `draft` defaults to `false` and is used to hide posts in production.
    - Optional `coverImage` object (`src`, `alt`, `height`, `width`) and `ogImage` URL.

- **Post data helpers** in `src/data/post.ts` are the primary abstraction for working with posts:
  - `getAllPosts()` calls `getCollection("post")` and filters out drafts when `import.meta.env.PROD` is true.
  - `getPostSortDate()` and `sortMDByDate()` implement the sort strategy controlled by `siteConfig.sortPostsByUpdatedDate`.
  - `groupPostsByYear()` groups posts by year (used in the paginated posts list).
  - `getAllTags()`, `getUniqueTags()`, and `getUniqueTagsWithCount()` power the tags sidebar and the `/tags` index.

- **Homepage & sectioning** (`src/pages/index.astro`):
  - Fetches all posts once via `getAllPosts()` + `sortMDByDate()` and then filters them into three logical groups by tag:
    - `showcase` → featured work (rendered via `PostPreviewLarge.astro`).
    - `archive` → archived projects.
    - `musings` → writing-focused posts.
  - If you introduce new content groupings, prefer driving them via tags and updating this filtering logic.

### Markdown, MDX & remark plugins

- **Remark admonitions** in `src/plugins/remark-admonitions.ts`:
  - Extends Starlight-style directive syntax (e.g., `:::tip`, `:::note`) to render as `<aside>` blocks with a title and content region.
  - Only supports admonition types listed in `Admonitions` (`tip`, `note`, `important`, `caution`, `warning`); unsupported directives are converted back to plain text to avoid breaking content.
  - Ensures the generated HTML nodes are compatible with downstream rehype/HTML rendering by using `hastscript` and mdast utilities.

- **Reading time** in `src/plugins/remark-reading-time.ts`:
  - Uses `reading-time` to compute an estimated reading duration from the mdast tree.
  - Writes `minutesRead` into `data.astro.frontmatter`, which is later read in `components/blog/Hero.astro` and `components/blog/Masthead.astro`.

- **TOC generation** in `src/utils/generateToc.ts`:
  - Consumes `MarkdownHeading[]` from `post.render()` and builds a nested tree of `TocItem`s.
  - Filters headings by depth (`minHeadingLevel` / `maxHeadingLevel`, defaulting to H2–H4), then recursively nests children based on heading depth.
  - Used by `components/blog/TOC.astro` to render the sidebar table of contents.

### Webmentions, RSS & OG images

- **Webmentions** in `src/utils/webmentions.ts`:
  - Reads `import.meta.env.SITE` as the base domain and `import.meta.env.WEBMENTION_API_KEY` as the API token.
  - Fetches mentions from `https://webmention.io/api/mentions.jf2`, filters them by type (`like-of`, `mention-of`, `in-reply-to`), and ensures `mention-of` / `in-reply-to` entries have non-empty content.
  - Caches responses to `.data/webmentions.json` using Node `fs`, merging new mentions with cached ones by `wm-id`.
  - Exposes `getWebmentionsForUrl(url)` for components (e.g., `components/blog/webmentions`) to retrieve mentions for a specific post URL.
  - When changing URL structures or `import.meta.env.SITE`, be mindful that this affects which mentions are associated with which posts.

- **RSS feed** in `src/pages/rss.xml.ts`:
  - Uses `@astrojs/rss` with `siteConfig.title`/`description` and `import.meta.env.SITE`.
  - Maps each post to an RSS item using `post.slug` for the link (`posts/{slug}`). If you change routing for posts, update this mapping accordingly.

- **OG image generation** in `src/pages/og-image/[...slug].png.ts`:
  - Uses Satori to render an SVG template into a PNG via Resvg.
  - Loads fonts from `src/assets/roboto-mono-*.ttf` (imported as raw buffers using the Vite plugin in `astro.config.ts`).
  - For posts without a custom `ogImage` in frontmatter, `BlogPost.astro` links to this endpoint; it uses `getFormattedDate()` and `siteConfig.title`/`author` to populate text in the card.

### Notable conventions & gotchas

- **Draft handling**: `getAllPosts()` includes drafts only in non-production builds. Any page using this helper automatically respects draft status.
- **Tags as behavior flags**: Several pages (especially the home page) derive layout and grouping from `tags`. When altering tag names, update the relevant filtering logic.
- **Tag routes**: Components link to `/tags/{tag}/`, but only `tags/index.astro` currently exists. If you implement per-tag listing pages, add routes under `src/pages/tags/` and ensure they reuse `getAllPosts()` and the tag helpers from `src/data/post.ts`.
- **Theme integration with Expressive Code**: The code block theme is tied to the light/dark theme via `expressiveCodeOptions.themeCssSelector`. If you change theme names or add additional themes, update both the Expressive Code config and any CSS that depends on `data-theme`.
- **Environment variables**: Features like Webmentions and the RSS feed rely on `import.meta.env.SITE` and optionally `import.meta.env.WEBMENTION_API_KEY`. When running locally without these set, Webmentions gracefully no-op but logging will warn you.
