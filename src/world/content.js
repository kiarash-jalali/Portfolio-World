// Preserved portfolio content, English edition.
export const data = {
  "aiSteps": [
    {
      "key": "prompt",
      "number": "01",
      "title": "Context",
      "detail": "I give it the existing code, constraints and the actual problem instead of asking for a generic answer."
    },
    {
      "key": "inspect",
      "number": "02",
      "title": "Check",
      "detail": "I read what it produced and compare it with the project before deciding whether any of it is useful."
    },
    {
      "key": "refactor",
      "number": "03",
      "title": "Adapt",
      "detail": "I rename, simplify and reshape the useful parts so they fit the codebase rather than looking pasted in."
    },
    {
      "key": "verify",
      "number": "04",
      "title": "Test",
      "detail": "Then I run it, test the edge cases and keep iterating until the result behaves the way I expect."
    }
  ],
  "contactLinks": [
    {
      "label": "Email",
      "value": "kiarash11.kj@gmail.com",
      "href": "mailto:kiarash11.kj@gmail.com"
    },
    {
      "label": "GitHub",
      "value": "kiarash-jalali",
      "href": "https://github.com/kiarash-jalali"
    },
    {
      "label": "Telegram",
      "value": "@Kiarash_jal",
      "href": "https://t.me/Kiarash_jal"
    }
  ],
  "education": [
    {
      "year": "NOW",
      "title": "Computer Engineering",
      "place": "Currently studying",
      "body": "My current degree, alongside the web projects I build outside class.",
      "tags": [
        "Software",
        "Programming",
        "Systems"
      ],
      "now": true
    },
    {
      "year": "2023–2024",
      "title": "Web Design & Development",
      "place": "Tehran Technical Complex",
      "body": "A one-year course where I learned the web fundamentals and started building interfaces consistently.",
      "tags": [
        "HTML",
        "CSS",
        "JavaScript",
        "UI"
      ]
    },
    {
      "year": "2023",
      "title": "Associate of Science — Chemical Engineering",
      "place": "Amirkabir University of Technology",
      "body": "My first university field. I eventually moved toward software, but I kept the methodical way of approaching problems.",
      "tags": [
        "Engineering",
        "Problem solving"
      ]
    }
  ],
  "facts": [
    {
      "label": "Focus",
      "value": "Front-end / UI"
    },
    {
      "label": "Study",
      "value": "Computer Engineering"
    },
    {
      "label": "Current project",
      "value": "Rootine"
    },
    {
      "label": "Now",
      "value": "Building Rootine"
    }
  ],
  "interests": [
    {
      "emoji": "🎮",
      "title": "Gaming",
      "body": "Mostly RPGs and systems-heavy games. I pay far too much attention to UI, progression systems and world design.",
      "gradient": "linear-gradient(135deg,#7c5cff,#3b82f6)"
    },
    {
      "emoji": "🍳",
      "title": "Cooking",
      "body": "I spent time working professionally in kitchens, and I still enjoy the pace, precision and improvisation of cooking.",
      "gradient": "linear-gradient(135deg,#f5a623,#ff6b6b)"
    },
    {
      "emoji": "✍️",
      "title": "Writing fiction",
      "body": "I like writing characters and worlds when I want a break from building interfaces.",
      "gradient": "linear-gradient(135deg,#22d3ee,#14b8a6)"
    },
    {
      "emoji": "🧪",
      "title": "Experimenting",
      "body": "Small browser experiments, odd interactions and ideas that are worth building just to see what happens.",
      "gradient": "linear-gradient(135deg,#a855f7,#22d3ee)"
    }
  ],
  "profile": {
    "email": "kiarash11.kj@gmail.com",
    "github": "https://github.com/kiarash-jalali",
    "telegram": "https://t.me/Kiarash_jal"
  },
  "projects": [
    {
      "key": "rootine",
      "featured": true,
      "category": "app",
      "skills": [
        "HTML",
        "CSS",
        "JavaScript",
        "React",
        "Next.js",
        "Supabase"
      ],
      "title": "Rootine",
      "subtitle": "Routine-first productivity app",
      "description": "A calm productivity app built around routines, tasks, daily check-ins, reminders and forgiving progress instead of pressure.",
      "modalDescription": "Rootine is where my work moved beyond static pages. It has authentication, database-backed routines and tasks, PWA/offline behaviour, reminders, themes, tests and product rules that have to survive real user state.",
      "tags": [
        "React",
        "Next.js",
        "TypeScript",
        "Supabase",
        "PWA"
      ],
      "features": [
        "Server-first authenticated reads with interactive client components",
        "Routine, task and daily check-in state across the app",
        "Supabase Auth, PostgreSQL and row-level security",
        "PWA/offline workflow with deliberately limited private-data caching",
        "Web Push reminders, testing, linting and build verification"
      ],
      "why": "It forced me to think about states, architecture, privacy, data flow and product trade-offs — not just how a landing page looks.",
      "live": "https://routine-nine.vercel.app/login",
      "preview": "https://routine-nine.vercel.app/portfolio-demo?embed=20261010-1",
      "repo": "https://github.com/kiarash-jalali/routine"
    },
    {
      "key": "digikala",
      "category": "clone",
      "skills": [
        "HTML",
        "CSS",
        "JavaScript"
      ],
      "title": "Digikala Clone",
      "subtitle": "Detailed responsive storefront recreation",
      "description": "A detailed responsive recreation of Digikala's landing experience with mega-menu behaviour, sliders and dense real-world layout work.",
      "modalDescription": "One of my most demanding early builds. The goal wasn't original art direction — it was learning to reproduce a complex production interface accurately, across breakpoints, without hiding behind a framework.",
      "tags": [
        "HTML",
        "CSS",
        "JavaScript",
        "Swiper",
        "Responsive"
      ],
      "features": [
        "Large multi-section responsive layout",
        "Mega menu and navigation states",
        "Slider/carousel integration",
        "Dense card and spacing reproduction"
      ],
      "why": "It trained the unglamorous but important frontend skill of matching an existing design precisely.",
      "image": "/public/images/digikala.webp",
      "live": "https://kiarash-jalali.github.io/digikala/",
      "repo": "https://github.com/kiarash-jalali/digikala"
    },
    {
      "key": "palette",
      "category": "tool",
      "skills": [
        "HTML",
        "CSS",
        "JavaScript"
      ],
      "title": "Color Palette Generator",
      "subtitle": "Small vanilla-JS interaction tool",
      "description": "Generates random palettes and lets you copy HEX values with one click — a small project focused on DOM interaction rather than layout replication.",
      "modalDescription": "A deliberately small JavaScript project: random state, DOM updates and clipboard interaction without a framework. It gave me a clean place to focus on behaviour.",
      "tags": [
        "JavaScript",
        "DOM",
        "Clipboard API"
      ],
      "features": [
        "Random palette generation",
        "Copy-to-clipboard interaction",
        "Simple multi-page structure",
        "Clear separation of behaviour and styling"
      ],
      "why": "Small tools are useful because there is nowhere for weak interaction code to hide.",
      "image": "/public/images/palette.webp",
      "live": "https://kiarash-jalali.github.io/color-pallet/",
      "repo": "https://github.com/kiarash-jalali/color-pallet"
    },
    {
      "key": "golestan",
      "category": "clone",
      "skills": [
        "HTML",
        "CSS"
      ],
      "title": "Golestan Clone",
      "subtitle": "Early responsive layout study",
      "description": "A responsive recreation of the Golestan landing page using HTML, CSS, Flexbox and hover interactions — one of the projects that built my layout fundamentals.",
      "modalDescription": "An earlier project, kept here on purpose. It shows the foundations and makes the progression toward Rootine visible instead of pretending I started at the current level.",
      "tags": [
        "HTML",
        "CSS",
        "Flexbox",
        "Responsive"
      ],
      "features": [
        "Responsive section layout",
        "Flexbox-based composition",
        "Hover states and navigation details",
        "Practice matching a real brand site"
      ],
      "why": "It is useful evidence of progress: solid fundamentals first, more complex application work later.",
      "image": "/public/images/golestan.webp",
      "live": "https://kiarashi-coder.github.io/Golestan/",
      "repo": "https://github.com/kiarash-jalali/golestan"
    }
  ],
  "promptExamples": [
    {
      "before": "make my hero section better",
      "after": "Build a quiet, illustrated pond opening with readable identity and navigation. Give each letter its own short parchment fall, then restore scrolling within four seconds. Preserve a skip control, reduced-motion support, and a clear layout from 360px through desktop."
    },
    {
      "before": "add some skills to my portfolio",
      "after": "Replace unverifiable skill percentages with three honest groups: core frontend, application work and workflow. Keep the animated bar visual, but label each bar with how I actually use the skill (daily driver / project experience / growing). Keep the section compact and evidence-based without inventing scores."
    },
    {
      "before": "help me debug why these particles drift to one side",
      "after": "Inspect the movement loop for directional bias. Check the flow-field math, edge forces and wrap behaviour, explain which term can accumulate drift over time, then propose the smallest change that keeps random wandering without letting the population synchronize at one edge."
    }
  ],
  "services": [
    {
      "icon": "01",
      "title": "Front-end foundations",
      "body": "Layouts, components, styling and browser behaviour — the practical pieces I use to turn a design into a working page."
    },
    {
      "icon": "02",
      "title": "Interaction & motion",
      "body": "Small transitions and interactions when they make the interface clearer, nicer to use, or simply more fun."
    },
    {
      "icon": "03",
      "title": "Product work",
      "body": "Working through state, data, edge cases and longer-lived decisions in projects such as Rootine."
    }
  ],
  "skillGroups": [
    {
      "title": "Core front-end",
      "icon": "</>",
      "items": [
        {
          "name": "HTML / semantic structure",
          "status": "daily driver",
          "level": 95,
          "skills": [
            "HTML"
          ]
        },
        {
          "name": "CSS / responsive UI",
          "status": "daily driver",
          "level": 94,
          "skills": [
            "CSS"
          ]
        },
        {
          "name": "JavaScript / DOM",
          "status": "comfortable",
          "level": 82,
          "skills": [
            "JavaScript"
          ]
        }
      ]
    },
    {
      "title": "Application work",
      "icon": "{}",
      "items": [
        {
          "name": "React / components",
          "status": "growing through Rootine",
          "level": 72,
          "skills": [
            "React"
          ]
        },
        {
          "name": "Next.js / TypeScript",
          "status": "project experience",
          "level": 64,
          "skills": [
            "Next.js",
            "TypeScript"
          ]
        },
        {
          "name": "Supabase / product data",
          "status": "project experience",
          "level": 58,
          "skills": [
            "Supabase"
          ]
        }
      ]
    },
    {
      "title": "Craft & workflow",
      "icon": "✦",
      "warm": true,
      "items": [
        {
          "name": "Responsive layout",
          "status": "regular project work",
          "level": 88,
          "skills": [
            "CSS"
          ]
        },
        {
          "name": "Accessibility",
          "status": "actively improving",
          "level": 67,
          "skills": [
            "Accessibility"
          ]
        },
        {
          "name": "Debugging / DevTools",
          "status": "regular workflow",
          "level": 82,
          "skills": [
            "JavaScript"
          ]
        }
      ]
    }
  ],
  "tools": [
    {
      "name": "HTML5",
      "sub": "markup",
      "color": "#e34f26",
      "glyph": "H"
    },
    {
      "name": "CSS3",
      "sub": "styles",
      "color": "#264de4",
      "glyph": "C"
    },
    {
      "name": "JavaScript",
      "sub": "logic",
      "color": "#f5a623",
      "glyph": "JS"
    },
    {
      "name": "React",
      "sub": "components",
      "color": "#149eca",
      "glyph": "R"
    },
    {
      "name": "Next.js",
      "sub": "app",
      "color": "#2d2d35",
      "glyph": "N"
    },
    {
      "name": "TypeScript",
      "sub": "types",
      "color": "#3178c6",
      "glyph": "TS"
    },
    {
      "name": "Supabase",
      "sub": "data",
      "color": "#3ecf8e",
      "glyph": "S"
    },
    {
      "name": "Tailwind",
      "sub": "utility",
      "color": "#22d3ee",
      "glyph": "TW"
    },
    {
      "name": "Sass",
      "sub": "styles",
      "color": "#cc6699",
      "glyph": "SC"
    },
    {
      "name": "Git",
      "sub": "version",
      "color": "#f05033",
      "glyph": "G"
    },
    {
      "name": "Vite",
      "sub": "tooling",
      "color": "#8b5cf6",
      "glyph": "V"
    },
    {
      "name": "DevTools",
      "sub": "debug",
      "color": "#3b82f6",
      "glyph": "{}"
    }
  ],
  "copy": {
    "a11y": {
      "skip": "Skip to content"
    },
    "nav": {
      "about": "About",
      "education": "Education",
      "skills": "Skills",
      "work": "Work",
      "ai": "AI",
      "lab": "Lab",
      "contact": "Contact"
    },
    "hero": {
      "status": "Open to interesting work & projects",
      "hello": "Hi, I'm",
      "lead": "Front-end developer and Computer Engineering student. I like turning small ideas into usable interfaces, then refining them until they feel right.",
      "work": "See my work",
      "contact": "Let's talk",
      "copyEmail": "Copy email",
      "statProjects": "Projects",
      "statTechnologies": "Technologies",
      "statProduct": "Active product",
      "statCuriosity": "Curiosity",
      "scroll": "SCROLL",
      "roles": [
        "Front-End Developer",
        "Computer Engineering Student",
        "Building Rootine",
        "UI tinkerer",
        "Cat lover",
        "Occasional game-dev daydreamer"
      ]
    },
    "about": {
      "kicker": "ABOUT",
      "title": "Hi, I'm Kiarash.",
      "subtitle": "I'm studying Computer Engineering, building front-end projects, and learning mostly by making things I actually want to use.",
      "role": "Front-end developer / student",
      "p1": "I started learning web development with <strong>HTML and CSS</strong>, then moved into JavaScript and React by building projects. I still enjoy working close to the browser because the feedback is immediate: change something, test it, and see what actually feels better.",
      "p2": "Before Computer Engineering, I studied <strong>Chemical Engineering</strong> at Amirkabir University. The subjects changed, but the way I approach problems did not: break things down, test an idea, keep what works, and adjust what does not.",
      "p3": "Outside coursework, I keep a few projects moving, rebuild interfaces I want to understand, and make small experiments just because they seem interesting. This portfolio is mainly a place to introduce myself and keep that work together."
    },
    "education": {
      "kicker": "PATH",
      "title": "Found the chemistry in computers.",
      "subtitle": "I started in Chemical Engineering, moved through web development, and now study Computer Engineering. Different subjects, same habit of taking things apart to understand how they work."
    },
    "interests": {
      "kicker": "OFF-SCREEN",
      "title": "Away from the keyboard.",
      "subtitle": "A few things I spend time on when I'm not studying or building something."
    },
    "skills": {
      "kicker": "TOOLBOX",
      "title": "What I work with.",
      "subtitle": "A practical snapshot of the tools I've used in projects, the ones I reach for often, and the ones I'm still getting better at.",
      "daily": "Tools I use across projects",
      "currently": "LEARNING NEXT",
      "learning": "React patterns · TypeScript · Next.js architecture · Supabase · accessibility · interaction design.",
      "evidenceKicker": "EVIDENCE MODE",
      "evidenceTitle": "Hover a skill. See where I used it."
    },
    "projects": {
      "kicker": "SELECTED WORK",
      "title": "Things I've built.",
      "subtitle": "Some started as practice, some became longer projects. I keep both here because they show what I've learned along the way.",
      "note": "Open a project for the details.",
      "filters": {
        "all": "All projects",
        "app": "Apps",
        "clone": "Clones",
        "tool": "Tools"
      },
      "viewCase": "View case study",
      "live": "Live demo",
      "details": "Details",
      "repo": "Repository",
      "openProject": "Open project",
      "interactive": "Live interactive demo",
      "rootineStatus": "PRIVATE ALPHA · IN PROGRESS",
      "rootineTagline": "A routine app I'm still shaping.",
      "rootineDemoTitle": "Today",
      "rootineDemoCopy": "Tap the routines. The preview is fake data; the product thinking isn't.",
      "rootineCheckin": "Finish check-in",
      "rootineReset": "Reset day",
      "whatBuilt": "What I built / learned",
      "whyMatters": "Why it matters"
    },
    "ai": {
      "kicker": "AI, OPENLY",
      "title": "Yes, I use AI.",
      "titleMain": "Yes, I use AI.",
      "titleAside": "and I'm good at it",
      "subtitle": "It is part of my workflow for research, debugging, implementation help and review — useful when the context is good and the output is checked.",
      "body": "I use AI when it can save time or help me look at a problem from another angle: learning an unfamiliar API, comparing approaches, debugging, reviewing code, or getting a first implementation on the screen. I still read the result, test it, change it when needed, and stay responsible for the final code.",
      "demoKicker": "PROMPT REFINER",
      "demoNote": "illustrative · no API call",
      "before": "Rough prompt",
      "after": "Refined prompt",
      "refine": "Refine it",
      "next": "Try another"
    },
    "lab": {
      "kicker": "THE LAB",
      "title": "My little garden of code.",
      "subtitle": "Small experiments I keep around because trying things is half the fun: motion, physics, interactions, and whatever I feel like testing next.",
      "magnetTitle": "Soft-body physics",
      "magnetBody": "Grab the blob itself. Its perimeter is physically simulated, so it stretches, squashes, wobbles and rebounds continuously instead of swapping between canned shapes.",
      "trailTitle": "Springy switches",
      "trailBody": "Choose one of 100 cells. The active state flows to the new cell while the grid ripples around it."
    },
    "contact": {
      "kicker": "CONTACT",
      "title": "Want to talk?",
      "body": "If you have a front-end role, a project, or just want to ask about something on this site, feel free to reach out.",
      "name": "Your name",
      "email": "Your email",
      "message": "What are we talking about?",
      "send": "Open email draft",
      "formNote": "This opens your email client with the message already filled in."
    },
    "footer": {
      "note": "Built with HTML, CSS & JavaScript.",
      "top": "Back to top ↑"
    },
    "toast": {
      "copied": "Email copied ✓",
      "copyFailed": "Copy failed — email selected",
      "reset": "Preview reset",
      "done": "Check-in complete ✓"
    }
  }
};
