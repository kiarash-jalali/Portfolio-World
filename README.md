# Portfolio-World

Experimental rebuild of Kiarash Jalali's personal portfolio.

## Important

This repository is **not production**.

The current live portfolio remains in:

`kiarash-jalali/Portfolio`

and continues to serve `kiarashjalali.net`.

Do not deploy this repository to the production custom domain unless Kiarash explicitly decides the world redesign is ready.

## North star

This project is not a visual polish pass on the old portfolio.

It is a rebuild around a small illustrated world:

- a hand-painted Persian-turquoise garden pond for the opening / About chapter
- a Middle-earth fan-homage chapter for Skills + Work
- a moonlit pond return for AI + Lab + Contact
- painterly ambient animation instead of generic tech effects
- real portfolio content remains semantic, readable, accessible HTML

The full design and implementation brief lives at:

`docs/ART_DIRECTION_MASTER_PLAN.txt`

Read that document before making major visual or architectural decisions.

## Safety baseline

The branch:

`baseline-production-clone`

is a frozen copy of the source state cloned from the live portfolio before the world redesign begins.

The experimental `main` branch is where the new world is developed.

The new repository intentionally does not contain:

- the production `CNAME`
- `public/CNAME`
- the production GitHub Pages deployment workflow
- generated `dist/` output

## Working order

1. Lock the art direction.
2. Produce the hero pond concept.
3. Produce fish, lotus and Persian tile concept kits.
4. Produce one Middle-earth chapter concept.
5. Build an isolated World / Art Lab.
6. Prove water, fish, ripple, layering and low-FPS painterly motion.
7. Only then migrate the real portfolio sections into the new visual world.

## Technical direction

The intended implementation remains JavaScript-first.

Likely stack after the art prototype is approved:

- semantic HTML
- vanilla JavaScript
- Vite
- PixiJS 8 for the illustrated 2D world layer
- GSAP + ScrollTrigger for chapter / scroll choreography
- optional Rive or Spine only if a particular character or asset genuinely benefits from it

The portfolio is a website with a living art layer, not a game.
