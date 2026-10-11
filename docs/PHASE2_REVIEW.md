# Phase-two review and quality-first decisions

The latest instruction replaces the earlier preference for the easiest approach. Visual quality, reference fidelity, readable composition, and complete behavior now drive technology and asset choices. The original one-page structure and content are retained. Production Portfolio is outside the scope.

## Changes to earlier decisions

| Earlier compromise | Correction |
| --- | --- |
| Wallpaper with rigid repeated fish | New painterly Persian pond plus WebGL surface refraction, animated normals, caustic light, impact waves, separate floating plants, and two distinct fish with articulated body strips |
| One-time intro, discarded letters | Normal refresh at the top always replays. The lock ends after the authored sequence or its independent watchdog; all thirteen letters persist with individual drift and waterlogging |
| Generic pale city | New recognizable Minas Tirith terraces, central rock spur, citadel and mountain setting; skill content moves below the principal architectural view |
| Generic golden tree and central panel | New Erdtree/Tarnished scene, dedicated portrait art, and a project manuscript placed beyond the main focal point |
| Generic fantasy glass | Original Malenia, Ranni, and Maliketh leaded-glass triptych, full architectural windows and readable copy beneath |
| Abstract CSS Wall | Separate illustrated mountain, ice Wall / Castle Black, and snowy weirwood paper planes with independent fold timing and shadows |
| Barely visible NPC | Visible habitat arrival within about a second, regular sneaking, then less frequent ring, word-stealing, and sleep events |
| Single-pose characters | New four-frame pixel-art character strips; the runtime selects consistent poses for walking, waving, and ring scenes |
| Small type and repeated numbers | Main paragraphs generally 16px, controls 14px, text-safe gradients, stronger contrast, removed decorative numbering |
| Visible motion toggle | Removed; system reduced-motion preference remains authoritative |

## Scene and asset preparation

New artwork lives under `public/art/phase2/`. All art was generated with the built-in image generation tool; full prompts are in `public/art/phase2/provenance.json`. Transparent sprites and diorama planes retain alpha. Landscape and mobile compositions are separate assets, encoded at WebP quality 96–98 without reducing their generated dimensions. The source PNGs remain in the working session’s generated-images directory; runtime files are committed to the repository.

The pond renderer uses a painted environment texture plus a dynamic transparent fish plane, followed by water refraction and light. Fish follow separate smooth paths and bend progressively from head to tail. Letters stay as semantic-independent decorative DOM pieces so they can remain tactile while the actual heading remains accessible. Shader or context failure reveals the illustrated fallback and does not lock content.

The generated sprites are authored pose strips, not a claim of a fully hand-animated character rig. The hobbit greeting uses the two consistent waving poses; the crouching character uses walking/crouching/ring poses with movement between them.

## Validation

Eleven automated checks pass against the built HTML and JavaScript, including persistent paper completion, the prior-session replay regression, fish bounds across desktop/mobile dimensions, NPC arrival, English-only markup, absence of theme/motion controls and numeric section labels, project dialogs, keyboard workflows, and reduced motion.

The supported browser preview capability is unavailable in this environment. The new assets were inspected directly, but real-browser visual/device QA and GPU shader rendering are not verified. No browser performance or visual-perfectness claim is made. Both existing Pages publishing routes receive the same generated static site.
