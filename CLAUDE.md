# Portfolio-World — working notes for Claude

Kiarash Jalali's personal portfolio, rebuilt as an illustrated, one-page fantasy journey.
Live (experimental): https://kiarash-jalali.github.io/Portfolio-World/

Read this file first. The full history lives in `resources/` (see "Deep context" at the end); you rarely need it.

## Boundaries

- Work **only** in this repo (`kiarash-jalali/Portfolio-World`). Never modify `kiarash-jalali/Portfolio` or https://kiarashjalali.net/ (production) unless Kiarash explicitly says so.
- Don't attach the production domain here. The site stays `noindex` and has no CNAME.
- Owner: Kiarash Jalali, frontend developer and Computer Engineering student. Don't import unrelated profile details into site content, and don't invent facts (university name, LinkedIn, dates).

## Non-negotiable rules (latest decisions, they override older briefs)

- One continuous vertical page. Keep the section order and all real content.
- **English only.** No Persian/RTL mode and no language switch.
- **No theme button. No visible motion/pause toggle.** Respect `prefers-reduced-motion` internally. A skip button for the intro is fine.
- **No decorative numbering** (01 / 02 / 03) anywhere: sections, cards, steps, services. Real dates are fine.
- The **Hobbit door is the only environmental click/tap interaction.** No clickable or hoverable fish or water, no cursor toys, no dragging letters. Normal UI (nav, CTAs, project dialogs, AI demo, Lab experiments, contact form) stays interactive.
- **Quality, craft and fidelity to the references beat the easiest implementation and beat download size.** Still required: readable text, keyboard access, visible focus, sensible contrast, working mobile layouts, no scroll traps beyond the short intro.
- Each chapter has its **own art style and display font**. Coherence comes from layout rhythm, nav behavior, typography hierarchy and transitions, not one shared look. Transitions between chapters are part of the art: no hard cuts between unrelated full-screen images.
- Desktop-first art direction. Mobile gets **recomposed** (portrait crops, stacked content, fewer layers), not just shrunk.
- Original artwork only, inspired by the references. No ripped game/movie frames, logos, sprites or soundtrack. Recognizable LOTR / Elden Ring / GoT homage **is wanted**; don't water it down into generic fantasy.

## The journey (section → world → what it must do)

| Section id | World | Must have |
| --- | --- | --- |
| `#home` | Persian courtyard pond (howz), turquoise/firoozeh, painterly / anime-background style | Near top-down water with tile floor, lotus and lily pads, depth, caustics. **2–3 distinct top-down koi** (cream body with coral/gold markings, translucent fins), ambient only. Hero content: name, role, intro, CTAs, links. |
| intro | — | ~2.5–4.5 s. **KIARASH JALALI: each of the 13 letters on its own irregular aged-parchment piece** (the space is a gap, not a paper). Pieces separate, fall staggered, touch the water, wobble, drift, get wet. **They stay in the pond afterwards** (they can sink partly or overlap, but never vanish). Scroll is locked only during the sequence. **Replays on every normal refresh at the top.** Deep links and reduced motion skip it. Skip button / Escape and a watchdog unlock. |
| `#about` | The Shire: warm storybook pastoral | About on one side, hobbit hole in the centre, education on the other side (sketch `about.png`). Door: closed → click → opens → pixel-art hobbit appears, waves, retreats → closes, ~3–4 s. A real `<button>`, no overlapping activations. Subtle cloud/grass/smoke life. |
| `#about` + `#skills` | — | **Gollum**: small ambient **pixel-art** NPC living only in these two sections. Visibly present soon after the area enters view, mostly idles/sneaks, with rare events: ring find/delight/loss, sleep, **word stealing**. Word stealing is visual only (clone plus mask; never mutate the DOM text, never cause reflow, avoid links/buttons/labels). |
| `#skills` | Minas Tirith: monumental white city matte painting | Unmistakable tiers, rock spur and citadel. Content must not fight the architecture. Honest skill descriptors, **no numeric levels or bars**. Interests live here too. |
| `#projects` | Elden Ring: tiny Tarnished seen from behind facing a huge glowing Erdtree (Rückenfigur) | **Rootine** is the featured project, with live / source / detail actions and an honest "private alpha, in progress" label. No iframe preview. Quiet gold motes and haze. |
| `#collected-work` | Stained-glass triptych: medieval leaded glass with Elden Ring boss figures (current art: Malenia, Ranni, Maliketh) | Three tall windows for **Digikala Clone, Color Palette Generator, Golestan Clone**. An authored triptych, not a card grid. On mobile, stacked or one window at a time. |
| `#atlas` | GoT: Wall, fantasy map, pop-up paper diorama | Scroll-driven assembly: parchment map → terrain rises → icy Wall / Castle Black → snow foreground. **Reverses on scroll up.** Sticky staging, shallower on mobile. |
| `#ai` | Archive / paper / cartography | Openly shows deliberate AI use: context → check → adapt → test. The example is labeled illustrative; never imply a live API. |
| `#lab` | Illustrated workshop | Elastic inkstone, plus the 10×10 grid with exactly one selected cell and a fluid spring transition. Don't reintroduce the rejected goo ball / Matter.js gravity toys. |
| `#contact` | Natural closing chapter | The form opens an email draft (be honest about that). Channels: kiarash11.kj@gmail.com, https://github.com/kiarash-jalali, https://t.me/Kiarash_jal. No invented LinkedIn, no phone number. |

Nav: same position and behavior throughout. Its colors and materials shift gradually per chapter (pond turquoise/cream → Shire parchment/moss → Elden charcoal/gold → GoT frost/iron), never as a sudden snap. On mobile it becomes a disclosure menu.

Motion: restrained and authored. Stepped art cadence (8/12/18/24 fps) is welcome. Pause offscreen work and hidden tabs. No permanent spectacle that gets in the way of reading.

## Content facts (source of truth: `src/world/content.js`)

- Positioning: frontend developer and Computer Engineering student, building Rootine, open to interesting work. Human, confident, honest copy; no corporate clichés and no fake seniority.
- Education: Computer Engineering (current; no institution named). Web Design & Development, Tehran Technical Complex, 2023–2024. Associate of Science in Chemical Engineering, Amirkabir University of Technology, 2023. Keep the "chemistry → software" story.
- Projects and links:
  - Rootine — https://github.com/kiarash-jalali/routine · https://routine-nine.vercel.app/login
  - Digikala Clone — https://github.com/kiarash-jalali/digikala · https://kiarash-jalali.github.io/digikala/
  - Color Palette Generator — https://github.com/kiarash-jalali/color-pallet · https://kiarash-jalali.github.io/color-pallet/ (the repo name keeps its original spelling)
  - Golestan Clone — https://github.com/kiarash-jalali/golestan · https://kiarashi-coder.github.io/Golestan/
- `content.js` still contains legacy fields (`number`, skill levels, preview URL, goo-ball text). Their presence doesn't mean they should render.

## Code style

Kiarash wants the code to read like **his own handwriting**: plain, readable HTML/CSS/JS, small focused modules, named values in config objects, comments where intent isn't obvious. Use libraries where they clearly improve the result (GSAP/ScrollTrigger is in use; PixiJS or Three.js are fine if justified). No React rewrite, no giant single files, **no hand-minified one-liners**.

## Repository layout and build

- Active app: `src/world/` (`main.js` wires modules; `pond.js` WebGL water and koi; `opening.js` parchment intro; `scenes.js` scene visibility and ScrollTrigger; `characters.js` door and Gollum; `ui.js` nav, dialogs, AI demo, contact; `workshop.js` Lab; `styles.css` and `phase2.css`).
- `scripts/render-page.mjs` generates `index.html` from `content.js`. Edit the template there, not the HTML file.
- Legacy and experiments: `src/js/`, `src/styles/`, `src/world-lab/`, `world-lab/`, `public/vendor/`. These don't drive the current page.
- Art lives in `public/art/` (first pass) and `public/art/phase2/` (current), with generation prompts in `provenance.json`.
- Commands: `npm ci`, `npm run dev` (port 4173), `npm run build`, `npm test`, `npm run verify`. Node ≥ 22.12.
- Deploy: pushing to `main` runs `.github/workflows/deploy-world-lab.yml`, which builds and publishes `dist/` to Pages. `build` also mirrors `dist/` into the repo root (`prepare-static-root.mjs`) for a legacy branch publisher. The root `index.html`, `assets/`, `art/` and `images/` are **generated copies**: never hand-edit them. The currently committed root `index.html` is source HTML, so it's out of sync.
- Vite `base` is `./` (the site lives under `/Portfolio-World/`). **Watch relative URLs inside CSS custom properties**: Chrome resolves them against the stylesheet in `assets/`, not the page.

## Known problems (audit of 16 Oct 2026, rendered in a browser at 1440×900 and 390×844)

1. **Live bug:** the stained-glass windows never load. `scenes.js` sets `--glass-image: url("./art/phase2/glass-triptych.webp")`, which resolves to `assets/art/...` and 404s, so Work 2 shows empty dark panels.
2. The code is unmaintainable: `styles.css` is 42 KB in 40 lines, the shader is one line, the modules are dense one-liners.
3. Hero: the `pond-botanics` overlay is blown up and smeared down the right edge, and covers the text on mobile. The water reads photographic, not painterly like the goals references. The koi are barely visible. The intro letters look like identical Scrabble tiles in a row.
4. Shire: a big empty band above the scene; the subtitle is unreadable over the art; a CSS door circle sits on top of the painted door; the content cards cover the house.
5. Gollum and Hobbit sprites are smooth painted figures, **not pixel art** as the brief and references ask.
6. Rootine: the scene art is cropped and the project content floats in an empty dark area below it.
7. Atlas: the Wall reads as a cut-out sticker pasted over the map, not a pop-up assembly.
8. Real-GPU, real-device QA has never been done. The previous "11 tests pass" checks DOM behavior, not visuals.

## Agreed direction (16 Oct 2026; confirm details with Kiarash as you go)

- **Keep:** the section order, content, overall concepts (door, fold/unfold atlas, persistent parchment) and the strong existing paintings (Minas Tirith, Erdtree, glass triptych, the Wall/terrain/snow planes as a starting point).
- **Proposed:** rewrite the front-end source into readable modules, one CSS and JS module per chapter, keeping structure, content and assets. Kiarash was leaning yes but hadn't explicitly confirmed when this was written.
- **Art pipeline is hybrid:** Claude builds what it can in code (SVG, canvas, WebGL, hand-made pixel art for Gollum and the Hobbit, reworking existing assets). For new painted rasters, Claude writes precise prompts and Kiarash generates the images; Claude has no image generator.
- **First targets:** fix the stained-glass URL bug, then the hero pond (painterly water, botanics composition, distinct koi, real parchment letters).
- Verify visually in a real browser after every meaningful change, desktop and mobile. Report what was actually tested.

## Deep context (only when needed)

`resources/` holds the full migration archive in four parts. Run `python3 resources/restore_archive.py`, then unzip `resources/Portfolio-World_Complete_Migration_2026-10-16.zip`. Inside `Portfolio-World_Migration/`:
- `01_COMPLETE_HANDOFF.md` (full context) and `03_DECISION_HISTORY.md` (what superseded what)
- `original_briefs/` (the master implementation brief and the phase-two correction prompt are the operative ones)
- `visual_references/resources portfolio.zip` (layout sketches `hero/about/skills/work1/work2/others.png`, plus `*/goals/` folders, which are the **highest-priority visual targets**, and five motion videos)

Priority when sources disagree: Kiarash's latest direct instructions → this file → the phase-two correction prompt → the master implementation brief → goals images → everything else (historical).
