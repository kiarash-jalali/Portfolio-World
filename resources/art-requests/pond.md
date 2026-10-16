# Pond art requests (for Kiarash to generate)

The hero pond now works with the existing art: the shader paints the floor
(Kuwahara brush filter, cel-shaded light web on a 12 fps cadence), the tancho koi
is recolored from the kohaku in code, and the parchment pieces are painted in
canvas. These rasters would push it further. All optional, in priority order.
Export as WebP quality 96–98 at the generated size, and add the prompt to
`public/art/phase2/provenance.json`.

## 1. Koi in the same painted style (transparent, 1536×512 each)

The current koi are close to scientific illustration (every scale drawn), which is
more detailed than the painted floor. Three new ones would match it:

> Use case: production asset, transparent background. A single koi seen exactly
> from above, head pointing right, body straight, centered, filling the width of a
> 1536×512 sheet with even transparent margin. Hand-painted anime background style
> (gouache, a few confident value steps, soft edges, no individual scales drawn),
> like the fish in a Ghibli pond scene. Translucent, veined pectoral and tail fins
> that let the background show through. **[A]** Kohaku: warm cream body, three
> large coral-red patches along the back, red on the head. No shadow, no water, no
> ripples, no text.

Repeat with **[B]** Yamabuki-showa: buttery gold body with soft charcoal patches,
cream fin edges; and **[C]** Tancho: pure cream body, one round coral crown on the
head only, faint gold sheen along the spine. Same pose, size and lighting in all
three so they can share `koi.js`'s loop and bend code. File names:
`koi-kohaku-painted.webp`, `koi-yamabuki-painted.webp`, `koi-tancho-painted.webp`.

## 2. Pond floor with flatter light (landscape 1792×1024 and portrait 1024×1536)

The painted floor already carries its own photographic caustic net, which the
shader's drawn light now doubles. A version with calmer light would let the shader
own the caustics:

> Same composition as the current `pond-bottom.webp` (overhead Persian courtyard
> howz, turquoise firoozeh mosaic star tiles on the floor, ivory stone steps and
> lily leaves with pink lotus along the right edge, calm deep teal water across the
> left 42% for text). Hand-painted anime background, flat gouache value steps, soft
> leaf-shadow dapples from above. **No caustic light net and no sun glints on the
> floor**: even, slightly cool daylight only. No fish, no paper, no text, no UI.

Portrait version: same elements recomposed to 1024×1536, stone steps and lilies
down the right edge, open teal water in the upper two thirds for text.
