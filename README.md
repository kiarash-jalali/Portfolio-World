# Portfolio-World

Kiarash Jalali’s English-only illustrated portfolio: a Persian garden pond, pastoral cottage, white city, golden tree, stained-glass project gallery, and unfolding paper atlas.

This is the experimental **kiarash-jalali/Portfolio-World** repository. The production `kiarash-jalali/Portfolio` repository and `kiarashjalali.net` remain separate. This repository has no CNAME and its pages request no indexing.

## Run and build

Use Node 24 (minimum 22.12):

```sh
npm ci
npm run dev
npm run verify
```

`npm run build` renders semantic HTML and builds the production site into `dist/`. Relative asset URLs support a nested GitHub Pages path. The build also refreshes the committed static root (`index.html`, `assets/`, `art/`, `images/`, and `favicon.svg`) because this repository’s existing branch-based Pages publisher remains active. Both publishing routes serve identical output. Run the build before committing changes; do not edit those generated copies directly. The deployment workflow builds and verifies before publishing **only this repository’s** Pages artifact.

## Source map

- `src/world/content.js`: English portfolio content and project records.
- `scripts/render-page.mjs`: accessible, pre-rendered page structure; generates the source `index.html` before each build.
- `src/world/styles.css`: chapter layouts, typography, responsive composition, atmospheric CSS motion.
- `src/world/scenes.js`: visibility, lazy art loading, motion preference, GSAP ScrollTrigger choreography.
- `src/world/opening.js`: thirteen independent parchment letters, session replay guard, skip control, and scroll-lock fail-safe.
- `src/world/characters.js`: cottage-door sequence and infrequent ambient character appearances.
- `src/world/ui.js`: navigation, accessible project dialogs, AI illustrations, email draft flow.
- `src/world/workshop.js`: keyboard/pointer spring experiments.
- `public/art/`: original generated WebP environments and transparent sprites. Asset provenance is included alongside them.
- `tests/site.test.mjs`: built-output and Happy DOM interaction checks.

There is no language or theme switch. Each chapter owns its palette. The motion control pauses atmosphere and scroll choreography; system reduced-motion preferences are respected automatically.

## Design authority

`docs/IMPLEMENTATION_BRIEF.txt` is the supplied master implementation brief. Latest user decisions override its older options: **English only; no theme-change control; implementation authorized**. `docs/ART_DIRECTION_MASTER_PLAN.txt` is an earlier historical plan.

See `docs/IMPLEMENTATION.md` for reference mapping, asset decisions, behavior, and verification limits. The `baseline-production-clone` branch preserves the initial source.
