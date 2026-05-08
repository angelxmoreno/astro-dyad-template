# AI Rules — Astro + Dyad Template

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