# Illustrated world implementation

## Reference interpretation

The full supplied archive was inspected: 69 PNG references, including every goals directory, six layout sketches, and frame samples from all five videos. The visual references inform the compositions; their screenshots and film footage are not shipped as website artwork.

| Chapter | Reference intent | Implementation |
| --- | --- | --- |
| Opening | Persian turquoise howz, lotus, koi, falling paper identity | Original overhead pond, separate mobile portrait painting, three transparent koi on long paths (two on mobile), thirteen independent parchment letters and impact rings |
| About / Education | Shire warmth, round cottage door, handwritten character | Original pastoral panorama, two readable manuscript columns, interactive round door, halfling greeting, integrated education and services |
| Skills / Interests | Monumental white city, structural hierarchy | Pale city environment, restrained serif hierarchy, semantic skill groups without invented scores, tool terrace and interests |
| Rootine | Golden tree, tiny traveler, epic scale | Original twilight painting, separate golden motes and light, one featured-project story with live/source links and details |
| Other projects | Three character-led stained-glass windows | Original triptych, one window per existing project, readable project summaries and accessible detail dialogs |
| Transition | Pop-up atlas / paper-engineering video | Original parchment map with independent mountain, wall and snow planes; reversible scroll-driven unfolding |
| AI / Lab / Contact | Warm archive, experimentation, correspondence | Paper field notes, keyboard-accessible AI tabs, illustrative prompt refinement, two spring experiments, email draft form |

## Architecture and motion

Static English HTML provides the content; Vite bundles local fonts, CSS, and small JavaScript modules. GSAP and ScrollTrigger own temporal animation and reversible scroll progress. CSS handles small continuous loops. There is no rendering canvas or runtime art-generation dependency: layered art and transforms cover the authored scenes without a second render engine.

The intro runs once per tab, only at the top of the document. It has a visible skip control, Escape support, navigation cancellation, and an independent 4.5-second unlock timer. It is skipped for reduced motion and deep links. It does not intercept wheel events after the intro.

Intersection observers stop offscreen ambient loops and bring nearby imagery into readiness. The atlas uses ordinary document scrolling with a sticky stage; reverse scrolling reverses its fold. Motion pause removes scrubbed choreography and reduces the atlas’s travel distance. Visibility changes pause CSS atmosphere and cancel transient character events.

The only environmental click interaction is the cottage door. Gollum-like appearances are infrequent and restricted to About / Skills; a temporarily hidden word remains in the accessibility tree and is restored when the sequence ends, the chapter leaves view, or motion is disabled. Lab controls are separate, explicit experiments.

## Assets and responsive composition

Original generated paintings are encoded as WebP. Portrait pond art is selected with a picture source and matching media preload. Other environments use intentional chapter-specific crops and foreground gradients. The stained-glass painting is split by background positioning. Transparent character crops come from the supplied original generated sheet.

Desktop art and text share a wide composition. Below 820px, About reshapes around the cottage, and the navigation becomes a disclosure menu. Below 600px, content stacks; the city becomes a dedicated visual introduction, project windows become individual full-width pieces, Rootine moves below its landscape focal point, and the paper theatre shortens. Touch does not depend on hover. Dialogs use native modal focus behavior; AI tabs and spring cells use roving keyboard focus.

## Content and behavior

All four existing projects, About content, education, services, tools, skills, interests, AI examples, and contact methods are retained in English. The contact form opens an email draft; it does not claim to send a message or use a backend. The AI prompt exercise uses authored examples and is labeled as illustrative.

There are no theme or language controls. Chapter material changes are part of the scroll journey. Motion pause is an accessibility control.

## Verification

`npm run verify` checks JavaScript syntax, required assets, the absence of production CNAMEs, builds the site, and runs eight functional checks against built HTML and JavaScript: English and semantic structure, nested-path asset resolution, project dialogs and scroll locks, AI keyboard behavior, spring selection, navigation and motion state, reduced-motion intro bypass, and intro skip/unlock.

Browser screenshot/device QA was unavailable in this execution environment. DOM tests do not validate painted layout, real-device frame rate, or the visual result of GSAP/CSS transforms. The koi and characters use single painted sprites with transform-based motion, rather than hand-drawn frame sequences. No browser performance score is claimed.
