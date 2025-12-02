# FE-CODEBASE-NEXT Frontend Project

A sample application built with Next.js 16 and React 19, featuring two pages: "Online Quiz Test" and "Hotel Room List", demonstrating client-side interactions, animations, and Server-Side Rendering (SSR).

## Tech Stack

- `Next.js 16`, `React 19`, `TypeScript 5`
- Styling: `Tailwind CSS 4`
- State Management: `zustand`
- Animations: `framer-motion`
- Icons: `lucide-react`
- Code Quality: `eslint` (Next Core Web Vitals rules), path alias `@/*` (configured in `tsconfig.json`, see `tsconfig.json:21`)

## Directory Structure (Excerpt)

```
app/
  page.tsx              # Home page: quiz introduction and start button
  globals.css           # Global styles (Tailwind imports)
  quiz/
    page.tsx           # Quiz test (client-side interaction and animations)
    layout.tsx         # Quiz sub-layout and metadata
  hotel/
    page.tsx           # Hotel room list (SSR)
components/
  RoomCard.tsx         # Room card component
store/
  useQuizStore.ts      # zustand Store (quiz data and loading)
lib/
  mock-api.ts          # Mock API (room list and pricing)
```

## Local Development

```bash
npm install
npm run dev
# or: yarn dev / pnpm dev / bun dev
```

- Visit `http://localhost:3000`
- Build: `npm run build`
- Production start: `npm run start`
- Linting: `npm run lint`

## Routes and Features

- `/` Home page (`app/page.tsx`): Preloads quiz data and provides a "Start Test" button. Preloading logic and button handling can be found at `app/page.tsx:18`, `app/page.tsx:20`.
- `/quiz` Quiz test (`app/quiz/page.tsx`):
  - Question progress and navigation, animations implemented in `const variants` configuration (at the end of `app/quiz/page.tsx`).
  - Interaction functions: option click `app/quiz/page.tsx:33`, previous question `app/quiz/page.tsx:47`.
- `/hotel` Hotel rooms (`app/hotel/page.tsx`): Server-side rendering to fetch room list, see `app/hotel/page.tsx:12`; room card component `components/RoomCard.tsx`.
- Quiz sub-layout and page metadata: `app/quiz/layout.tsx:3`.

## Data and State

- Quiz data is managed using `zustand`, created at `store/useQuizStore.ts:18`.
- Preventing duplicate requests and large data simulation: 5000 questions are generated at `store/useQuizStore.ts:32`, and `fetchPromise` prevents concurrent duplicate requests.
- Home page preloads questions on mount, see `app/page.tsx:18`; button click ensures data is ready before navigation, see `app/page.tsx:20`.

## Styling and Animations

- Tailwind configuration: `tailwind.config.ts:1`, scans components in `src` and `app` directories.
- Global styles and dark mode variables: `app/globals.css:1`.
- Page animations: `framer-motion` implements slide-in/slide-out animations for question transitions, configured in `variants` at the bottom of `app/quiz/page.tsx`.

## Code Quality and Conventions

- ESLint configuration: `eslint.config.mjs:1`, enables Next official rules with custom ignores.
- TypeScript strict mode and aliases: `tsconfig.json` has `strict` enabled and `@/*` path alias configured (`tsconfig.json:21`).
- Project conventions:
  - All output and documentation in Chinese, code comments in English.
  - Avoid over-engineering, keep code concise, understandable, and practical.
  - Pay attention to cyclomatic complexity, reuse code as much as possible.
  - Modular design, apply appropriate design patterns.
  - Minimize changes to avoid affecting other modules.

## Deployment Recommendations

- Production build: Run `npm run build` then use `npm run start` to launch.
- Hosting platforms: Can be deployed to Vercel (officially recommended by Next.js).

## Common Issues

- This project uses React 19 and Next 16, please ensure your Node version meets Next requirements.
- If local styles are not working, check Tailwind scan paths and whether `globals.css` has been imported.
