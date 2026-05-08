# Astro + Dyad Template

Minimal starter for [Dyad](https://www.dyad.sh) with Astro, React islands, and Tailwind CSS v4.

## Stack

- **Astro 6** — static-first framework with island architecture
- **React 19** — hydrated as Astro islands via `client:*` directives
- **Tailwind CSS v4** — via `@tailwindcss/vite` plugin (no PostCSS config)
- **TypeScript** — strict mode
- **Bun** — package manager and runtime

## Project Structure

```
src/
├── components/    # React island components
├── layouts/       # Shared page layouts
├── pages/         # File-based routes
└── styles/         # Global CSS (Tailwind import)
```

## Commands

| Command          | Action                              |
| ---------------- | ------------------------------------ |
| `bun dev`        | Start dev server on `localhost:5173` |
| `bun build`      | Production build                    |
| `bun preview`    | Preview production build            |
| `bun run check`  | TypeScript + Astro diagnostics      |

## Dyad Compatibility

- Dev server runs on **port 5173** (configured in `astro.config.mjs`)
- `AI_RULES.md` provides context for AI-assisted development
- `dyad.config.json` specifies the dev command and port

## React Islands

Use `client:*` directives to control hydration:

- `client:load` — hydrate immediately
- `client:visible` — hydrate on viewport entry
- `client:idle` — hydrate on browser idle
- `client:only="react"` — client-only, skip SSR