# AI Rules — Astro + Dyad Template

## 0. Onboarding Checklist (Mandatory First Steps)

Before taking any action, you **must** complete the following steps at the beginning of every new chat session:

1. **Analyze Project Structure**: Use the available tools to list the entire file and directory structure of the project. State that you have done this.
2. **Review Configuration Files**: Read the contents of all configuration files (`astro.config.mjs`, `tsconfig.json`, `biome.json`, `.fallowrc.json`, `package.json`). State that you have done this.
3. **Read Full File Content**: When reading a file, you **must** read the entire file to ensure you have the full context. Do not read partial file contents.
4. **Mandatory Research First**: For any package, library, or API that is relevant to the user's request, you **must** look up its current documentation before writing code that uses it. Do not rely on baked-in knowledge. Always verify first.
5. **Summarize Onboarding**: After completing the above, provide a brief summary of the key rules from this document to confirm you have understood them.

## Stack

- **Framework:** Astro 6 with React islands
- **Package manager:** Bun
- **Styling:** Tailwind CSS v4 (via `@tailwindcss/vite` plugin — no PostCSS config needed)
- **TypeScript:** Strict mode (`astro/tsconfigs/strict`), JSX import source set to React

## Commands

| Command            | Purpose                     |
| ------------------ | --------------------------- |
| `bun run dev`      | Start dev server            |
| `bun run build`    | Production build            |
| `bun run preview`  | Preview production build    |
| `bun run check`    | Astro + TypeScript diagnostics |
| `bun run type:check` | TypeScript type check only (`tsc --noEmit`) |
| `bun run lint`     | Biome lint + format check  |
| `bun run lint:fix` | Biome lint + format with auto-fix |

## Dev Server Port

The dev server **must run on port 5173**. This is configured in `astro.config.mjs` under `server.port`. Do not change this — Dyad's preview pane targets `http://localhost:5173` and will break on any other port.

## Server Rendering

The default output mode is `static`. Switch to `hybrid` or `server` in `astro.config.mjs` when the app needs server-side data fetching, dynamic routes with real-time data, or API endpoints.

- **`hybrid`** — most pages are static; individual pages opt into SSR with `export const prerender = false`. Best for apps that are mostly static but need a few dynamic routes or API endpoints.
- **`server`** — all pages are SSR by default; individual pages opt into static with `export const prerender = true`. Best for apps where most pages need server-side data.

When switching to `hybrid` or `server`, add the appropriate adapter (e.g. `@astrojs/node`) and set `output` in `astro.config.mjs`.

## Data Fetching Boundary

This is the most common source of confusion when working with Astro. Where you fetch data depends on context:

- **Astro frontmatter (server only)** — Fetch data that the page needs to render. This is the primary data fetching location. Runs once on the server, sends HTML to the client. Use `fetch`, database queries, or any server-side API here. This data is available in the template but **not** in React islands unless passed as props.
- **React islands (client only)** — Fetch data that changes after page load or needs interactivity. Use `useEffect`, `fetch`, or SWR/TanStack Query here. Islands can also call Astro API endpoints (`src/pages/api/`) to fetch data from the server.
- **API routes** (`src/pages/api/`) — Server endpoints that return JSON. Use these when a React island needs server-side data that wasn't passed as props. Good for lazy-loading additional content (e.g. nested comments, infinite scroll).

**Never** fetch the same data in both frontmatter and a React island. Pick one location and pass data down or up through props/API.

## Middleware

Middleware runs on **every request** before any page renders. Create `src/middleware.ts` with an `onRequest` function when you need:

- Authentication checks and redirects
- Adding response headers (caching, CORS, security)
- Request logging or timing
- A/B testing or feature flags per request

Do **not** add middleware just for data fetching — that belongs in frontmatter or API routes. Middleware adds overhead to every request, so only use it when logic must run before all pages.

## View Transitions

Astro has built-in page transitions via the `<ViewTransitions />` component. Add it to the layout `<head>` to enable smooth navigation without full-page reloads:

```astro
---
import { ViewTransitions } from 'astro:transitions';
---
<head>
  <ViewTransitions />
</head>
```

Use `transition:animate` directives on elements for enter/exit animations. Use `transition:persist` to preserve DOM state across navigations (e.g. keeping a video playing or a form filled).

## Environment Variables

- **In Astro frontmatter and API routes**: use `import.meta.env.PUBLIC_*` for client-exposed vars and `import.meta.env.*` (no prefix) for server-only vars.
- **In React islands**: only `import.meta.env.PUBLIC_*` variables are available (they're inlined at build time). Server-only env vars are **not** accessible in client code.
- **Never** use `process.env` — this is a Node.js convention, not an Astro one. Always use `import.meta.env`.
- Create a `.env` file in the project root for local development. Prefix with `PUBLIC_` for client-side access.

## Architecture

- **Pages** live in `src/pages/` — Astro file-based routing.
- **Layouts** live in `src/layouts/` — wrap pages with shared HTML structure and global CSS.
- **React components** live in `src/components/` — use `client:*` directives to hydrate as islands.
- **Global styles** are in `src/styles/global.css` — imported by the base layout.

## React Islands

React components use Astro's island architecture. Add a `client:*` directive to control hydration:

- `client:load` — hydrate immediately (good for interactive UI above the fold)
- `client:visible` — hydrate when the component enters the viewport
- `client:idle` — hydrate once the browser is idle
- `client:only="react"` — skip SSR, render only on the client

## Import Conventions

- **React components** must use the `.tsx` file extension. Astro components use `.astro`.
- **React imports**: always import from `react` and `react-dom` directly. Do not use legacy `create-react-app` patterns.
- **Astro page imports**: import React components with a `client:*` directive — never render them without one or they will be static HTML only.
- **Astro component imports**: import `.astro` files with relative paths — Astro does not resolve them as packages.
- **CSS imports**: import global styles in layouts only, not in individual pages. Use Tailwind utility classes for page-level styling.
- **Never** import `react-router-dom` — if client-side routing is needed, use Astro's file-based routing or add a proper integration.

## SSR Constraints

Astro renders pages on the server by default. Follow these rules:

- **No browser APIs in frontmatter**: The `---` code fence at the top of `.astro` files runs on the server. Never access `window`, `document`, `localStorage`, `sessionStorage`, or `navigator` there. These objects do not exist during SSR and will cause a crash.
- **Browser APIs in React islands**: Browser APIs are safe inside React components rendered with `client:*` directives — these run in the browser after hydration.
- **Server-only files**: Files ending in `.server.ts` or `.server.js` are restricted to server-only imports. Never import client-side code from them.
- **Client-only files**: Files ending in `.client.ts` or `.client.js` are restricted to client-only imports. Never import server-side code from them.
- **Await promises**: All asynchronous operations in Astro frontmatter (e.g. `fetch`, database calls) **must** be `await`ed. Unresolved promises passed to the template will cause errors.

## Component Placement

- **Shared components** used across multiple pages go in `src/components/`.
- **Page-specific components** used by only one page should be co-located — place them in the same directory as the page or directly in the page file.
- **Layouts** wrap pages with shared structure. Put them in `src/layouts/`. Do not use layouts for one-off page structures.
- **Utility functions** not tied to a component go in `src/lib/`. The `cn()` helper for Tailwind class merging lives in `src/lib/utils.ts`.
- Do not create deep nesting. Flat is better than over-organized.

## Library Usage Guidelines

### Styling
- **Use**: Tailwind CSS utility classes exclusively. Use the `cn()` helper from `src/lib/utils.ts` to merge conditional classes.
- **Avoid**: CSS-in-JS libraries (styled-components, Emotion), CSS modules, or inline `style` props. Tailwind handles all styling.
- **Global styles**: Reserve `src/styles/global.css` for Tailwind directives, CSS variables, and `@theme`/`@utility` definitions only. No component-specific styles here.

### Icons
- **Use**: `lucide-react` for icons. Install if needed (`bun add lucide-react`).
- **Avoid**: Other icon libraries unless lucide doesn't provide what's needed.

### Forms
- **Use**: React Hook Form (`react-hook-form`) for form state and validation.
- **Use**: Zod for schema validation with `@hookform/resolvers`.
- **Avoid**: Hand-rolled form handling or other form libraries.

### State Management
- **Use**: React's built-in `useState` and `useReducer` for component-level state.
- **Use**: React Context API for shared state across islands.
- **Avoid**: External state libraries (Redux, Zustand, Jotai) unless the app complexity clearly justifies them.

### Animations
- **Use**: Tailwind's built-in transition utilities (`transition`, `duration-*`, `ease-*`).
- **Use**: CSS `@keyframes` in `src/styles/global.css` for custom animations.
- **Avoid**: Heavy animation libraries. Prefer CSS-first solutions.

### Utilities
- **Use**: `clsx` + `tailwind-merge` via the `cn()` helper in `src/lib/utils.ts` for class merging.
- **Avoid**: `classnames` (replaced by `clsx`), manual string concatenation for class lists.

## Tailwind CSS v4 Notes

- Configuration is CSS-based — no `tailwind.config.mjs` file.
- Custom themes, utilities, and variants go in `src/styles/global.css` using `@theme` and `@utility` directives.
- The `@tailwindcss/vite` plugin is registered in `astro.config.mjs`, not via a separate PostCSS config.

## Conventions

- Use `protected` over `private` for class members.
- Never use `any` — type everything properly or use `unknown`.
- Run `bun run check` before considering work done.
- Run `bun run lint` before considering work done. Use `bun run lint:fix` to auto-fix issues.
- Run `bun run type:check` to check TypeScript types independently of Astro.
- `test-only-dependencies` rule is off in `.fallowrc.json` — Astro, `@astrojs/react`, and `@tailwindcss/vite` are production deps misclassified as test-only.
- Biome overrides in `biome.json` suppress `noUnusedImports` and `noUnusedVariables` for `.astro` files (frontmatter variables used in templates are not dead code).
- Commit messages follow conventional commits in past tense.

## Communication Style

- **Explain before acting**: Before executing a command, making a file change, or calling a tool, state what you are about to do and why. This provides transparency and allows for course correction.
- **Show your work**: When modifying code, show the relevant before/after so the intent is clear.
- **Flag uncertainty**: If you are unsure about a package API, a config option, or the right approach, say so and suggest looking it up rather than guessing.