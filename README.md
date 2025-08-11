# loslcon

A fast, localized website built with Next.js 15, React 19, and Tailwind CSS 4. English and French translations are included.

## About
LOSL-CON is an annual African tech conference that brings together developers, cybersecurity specialists, creators, and tech enthusiasts for a day (or more) of learning, collaboration, and innovation.

It’s hosted by LOSL-C, a growing African open-source and Linux community, and features expert talks, practical workshops, live demos, and networking opportunities. The event’s goal is to showcase local talent, connect people across industries, and inspire the next generation of tech builders in Africa.

## Tech stack
- Next.js (App Router, Turbopack)
- React 19
- Tailwind CSS v4
- i18n with i18next / next-i18next

## Quick start
Requirements: Node.js 18.18+ (or 20+)

Install dependencies (choose one):

```sh
# bun
bun install

# pnpm
pnpm install

# npm
npm install
```

Run the dev server:

```sh
bun dev
# or: pnpm dev / npm run dev
```

Build and start:

```sh
pnpm build && pnpm start
# or: bun run build && bun run start / npm run build && npm start
```

Lint:

```sh
pnpm lint
```

## Localization
- Locale files: `src/i18n/locales/{en,fr}/common.json`
- Language switcher: `src/components/language-switcher.tsx`
- i18n config: `src/i18n/settings.ts` and `src/i18n/config.ts`

## Project structure
```
src/
	app/              # App Router pages and layout
	components/       # UI, sections, i18n helpers, site header/footer
	i18n/             # i18next + next-i18next setup and locales
	lib/              # links, utils
public/             # static assets
```

## Deployment
Any Next.js-compatible platform (e.g., Vercel). Build with `next build` and start with `next start`.
