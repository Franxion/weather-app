# Weather Safety Quiz

A short interactive quiz that teaches students in Switzerland what to do during extreme weather. The user picks one of three scenarios, answers three multiple-choice questions and gets immediate feedback with a link to an official Swiss source.

Student project · UZH Information Management · Group 17

- **Live version:** _<add the deployment URL here>_
- **Repository:** https://github.com/MicheleDellaquila/weather-app

## What the app does

1. **Home page** (`index.html`): three scenario cards: Flooding, Heatwaves, Severe thunderstorms.
2. **Quiz page** (one per scenario): 3 questions, one at a time.
   - Pick an answer, then press *Check answer*.
   - A popup says whether the answer was correct, explains why, and links to an official source (e.g. natural-hazards.ch).
   - The score and a progress bar update after every question.
3. **Results**: final score (x/3), a summary of what to remember for each question, and the Swiss emergency numbers (112, 117, 118, 144). From here the user can restart the scenario or choose another one.

## Run it locally

The app is **static** (HTML, CSS, JavaScript). There is nothing to install and no build step. It does need a local web server, though: the quiz loads `data/questions.json` with `fetch` and uses a JavaScript module, and browsers block both when a page is opened by double-clicking the file (`file://`).

Pick **one** of the two options. Run the command from the project folder, the one that contains `index.html`.

**Option A: Python** (already installed on macOS and most Linux systems; any Python 3 works)

```bash
python3 -m http.server 8000
```

**Option B: Node.js**

```bash
npx serve -l 8000
```

Then open this address in a browser:

```
http://localhost:8000/
```

To stop the server, press `Ctrl + C` in the terminal.

If port 8000 is already in use, change the number in both the command and the address (for example `8080`).

### Requirements

- A recent browser (Chrome, Edge, Firefox or Safari). The quiz uses `<dialog>`, JavaScript modules and top-level `await`.
- An internet connection, for two reasons: the fonts (Inter, Space Grotesk, IBM Plex Mono) are loaded from Google Fonts, and the "official source" links open external websites. Without a connection the quiz still works, but with fallback fonts.
- Python 3 **or** Node.js, only to start the local server.

## Project structure

```
.
├── index.html              Start page with the three scenario cards
├── scenario-1.html         Quiz: Flooding
├── scenario-2.html         Quiz: Heatwaves
├── scenario-3.html         Quiz: Severe thunderstorms
├── js/
│   └── quiz.js             All quiz logic (shared by the three scenario pages)
├── data/
│   └── questions.json      Questions, answers, explanations, sources, result texts
├── style/
│   ├── reusable.css        Shared styles (colors, buttons, fonts)
│   ├── home.css            Styles for the home page
│   └── scenario.css        Styles for quiz and results pages
└── assets/                 Logo and scenario illustrations (SVG)
```

## How it works

- The three scenario pages are identical except for the `data-scenario-id` attribute on `<body>` (`flooding`, `heatwave`, `thunderstorm`), the title and the illustration.
- `js/quiz.js` reads that attribute, loads `data/questions.json`, picks the matching scenario and builds the questions on the page from HTML `<template>` elements.
- Flow of one question: choose an option → *Check answer* (the answer is locked, feedback popup opens) → *Next question* → after the last one, *See your results*.
- The score is kept in memory only. Reloading a page restarts the scenario. Nothing is saved and no data is sent anywhere.
- Accessibility: keyboard navigation, focus moves to each new question, screen-reader labels for correct/wrong marks and the progress bar.

## Editing the content

All text lives in `data/questions.json`; no code change is needed to edit questions. Each question has an `id`, the `text`, a list of `options` (ids `a`, `b`, `c`), the `correctOptionId`, an `explanation` (shown in the popup), a `summary` (shown in the results) and a `source` (`label` and `url`). The file also holds the emergency numbers and the texts of the results screen.

## Deployment

Because the project is fully static, it can be hosted on any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages). No build command is needed, and the publish directory is the repository root.

The start page is `index.html`, so the bare domain opens the app on any of these hosts.

## Disclaimer

This quiz is for learning only and is not an official warning service. For current warnings see [natural-hazards.ch](https://www.natural-hazards.ch/#hazards-tab=all) and the MeteoSwiss app. In an emergency, call 112.
