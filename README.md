# Weather Safety Quiz

A short interactive quiz that teaches students in Switzerland what to do during extreme weather. The user picks one of three scenarios, answers three multiple-choice questions and gets immediate feedback with a link to an official Swiss source.

Student project · UZH Information Management · Group 17

- **Live version:** https://franxion.github.io/weather-app
- **Repository:** https://github.com/Franxion/weather-app

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

**Option A: Python 3**

```bash
python3 -m http.server 8000
```

On Windows, type `python` (or `py`) instead of `python3`. On macOS, `python3` comes with the Xcode Command Line Tools: if they are missing, macOS offers to install them the first time you run the command.

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

The questions are loaded from `data/questions.json`, so they can be changed without touching the code. The other interface texts are written in the HTML pages and in `js/quiz.js`.

**Read from `data/questions.json`**

- `scenarios`: each page finds its scenario through the `id` (`flooding`, `heatwave`, `thunderstorm`) and shows every entry of its `questions`: the `text`, the `options` (each with an `id` and a `text`), the `correctOptionId`, the `explanation` (shown in the popup), the `summary` (shown under "What to remember") and the `source` (`label` and `url`).
- `ui.results`: the result `headings` (chosen by the score in percent, through `minPercent`), the `message` (`{score}` and `{total}` are filled in) and `markCorrect` / `markIncorrect` (screen-reader labels for the ticks and crosses in the summary).

**Written in the code**

- `index.html`: all the texts of the home page, including the scenario cards and the disclaimer.
- `scenario-1.html` to `scenario-3.html`: the page title and texts such as the scenario tag ("01 · FLOODING"), "QUESTION 01 / 03", "SCORE 0", "Check answer", "WHAT TO REMEMBER", "IN AN EMERGENCY", the emergency numbers (112, 117, 118, 144) and the buttons on the results screen.
- `js/quiz.js`: "Check answer", "Next question", "See your results", "SCORE" and "OFFICIAL SOURCE".

The JSON also contains the rest of `ui` (for example `ui.home` and `ui.quiz`), `emergencyNumbers`, and a `title`, `intro`, `icon` and `color` for each scenario. This version of the app does not read them, so changing them has no effect.

When you edit the questions:

- keep the scenario `id`s as they are, because they must match the `data-scenario-id` of each page;
- make sure every `correctOptionId` matches one of the option `id`s, otherwise every answer is marked wrong;
- keep three questions per scenario: the counter shown when the page opens ("QUESTION 01 / 03") and the progress bar are fixed at three in the HTML.

## Deployment

The live version is published with **GitHub Pages**, directly from the repository and with no build step:

1. On GitHub, open the repository and go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Choose the branch **main** and the folder **/ (root)**, then click **Save**.
4. After a minute or two the site is online at https://franxion.github.io/weather-app/. Every push to `main` publishes the new version.

Good to know:

- Only the owner of the repository can change these settings.
- With a free GitHub plan, Pages works only for public repositories. This repository is private, which needs a paid plan such as GitHub Pro (included in the GitHub Student Developer Pack). Either way the published site is public, including Markdown files such as this README.
- GitHub Pages is case-sensitive: every link must match the exact spelling of the file name.

Because the project is fully static, it can also be hosted on any other static host (Netlify, Vercel, Cloudflare Pages). No build command is needed, and the publish directory is the repository root. The start page is `index.html`, so the bare domain opens the app.

## Credits and licences

- **Code:** written by the supplier, a freelance developer hired by Group 17 on Freelancer.com. It uses no external libraries or frameworks.
- **Quiz content** (`data/questions.json`): written by Group 17 from the official Swiss sources linked in each question.
- **Logo and scenario illustrations** (`assets/`): taken from Group 17's design mock-ups, which were made with generative AI.
- **Fonts:** Inter, Space Grotesk and IBM Plex Mono, served by Google Fonts and licensed under the [SIL Open Font License 1.1](https://openfontlicense.org).

[`AI_USAGE.md`](AI_USAGE.md) describes how AI was used, by the supplier and by Group 17.

## Disclaimer

This quiz is for learning only and is not an official warning service. For current warnings see [natural-hazards.ch](https://www.natural-hazards.ch/#hazards-tab=all) and the MeteoSwiss app. In an emergency, call 112.
