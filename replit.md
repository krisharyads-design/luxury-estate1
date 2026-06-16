# Cinematic Villa Experience

A cinematic WebGL luxury real estate experience showcasing India's finest properties with 3D scroll-driven animations.

## Run & Operate

- `pnpm --filter @workspace/cinematic-villa run dev` — run the frontend (port assigned by workflow)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- Required env: `DATABASE_URL` — Postgres connection string (not actively used; no API backend required)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite (`artifacts/cinematic-villa`)
- 3D: Three.js via `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`
- Animations: GSAP + ScrollTrigger, Framer Motion
- Smooth scroll: Lenis
- Styling: Tailwind CSS v4 with custom gold color theme
- Build: Vite

## Where things live

- `artifacts/cinematic-villa/src/` — all frontend source code
- `artifacts/cinematic-villa/src/components/sections/` — page sections (Hero, Story, Gallery, Properties, etc.)
- `artifacts/cinematic-villa/src/components/three/` — Three.js 3D scene components (Scene, Villa, CameraRig, etc.)
- `artifacts/cinematic-villa/src/lib/animation-store.ts` — shared scroll/animation state (progress, velocity, etc.)
- `artifacts/cinematic-villa/public/images/` — luxury gallery sprite image

## Architecture decisions

- Single-page app with no backend — all content is static/inline data.
- Three.js 3D scene is lazy-loaded and gracefully falls back to black background if WebGL is unavailable (e.g. in preview sandboxes).
- GSAP ScrollTrigger + Lenis power all scroll-driven camera and section animations.
- Gold color theme defined in Tailwind v4 `@theme` block in `index.css`.
- All Next.js-specific patterns removed: `"use client"` directives, `next/dynamic`, `next/image`, `next/link` replaced with React equivalents.

## Product

A single-page luxury real estate experience with:
- Scroll-driven 3D WebGL villa visualization
- Kinetic typography and parallax section animations
- Property cards for 6 Indian luxury estates
- Services grid with 3D tilt effects
- Animated testimonials marquee
- Consultation booking modal with form

## Gotchas

- WebGL won't render in the Replit preview iframe (no GPU access) — the 3D scene shows a black background there. It works in a real browser.
- The gallery uses a single sprite image (`/images/luxury-gallery-sprite.png`) with `background-position` to simulate multiple property images.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
