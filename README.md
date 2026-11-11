# vishakha/dev

Personal portfolio of Vishakha, full-stack software engineer. React, TypeScript, Vite, Tailwind CSS v4, Three.js (React Three Fiber + custom GLSL), GSAP ScrollTrigger and Lenis.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build
npm run lint
```

## Edit the content

All text lives in `src/content/`. Components never hold copy, so updating the portfolio means editing these files only:

| File | What it holds |
|---|---|
| `profile.ts` | Name, role, email, links, hero statement, about text, portrait path |
| `experience.ts` | The role and its six chapters |
| `projects.ts` | Project case studies (problem, solution, role, architecture, results, colour) |
| `skills.ts` | Skill domains, AI workflow steps, education and certifications |

The portrait is `public/images/vishakha.jpg` (720px) with a 480px copy for phones.

## How it fits together

- `src/three/World.tsx` is one fixed WebGL canvas for the whole page. The glass, its particles and the backdrop travel through every section.
- `src/three/state.ts` holds the shared per-frame state and `readForm()`, which maps scroll position to the particle formation (glass → ring → ribbon → landscape → clusters → glass). Sections opt in with a `data-form` attribute.
- `src/three/shaders.ts` has the GLSL: simplex/FBM noise, the refracting glass, the dissolve and the six particle formations.
- `src/scenes/` holds one component per section. `src/ui/` holds the cursor, nav/menu and small shared pieces.
- The 3D chunk is lazy-loaded once the page is idle. Without WebGL, the page shows plain text versions of the name and contact headline. Reduced-motion users get no smooth scrolling and no idle animation.

## Deploy

`npm run build` outputs a static site in `dist/`. It works on any static host (GitHub Pages, Netlify, Vercel). For GitHub Pages under a sub-path (for example `/PortfolioWebsite/`), set `base` in `vite.config.ts`.
