# Hack4Freedom Judge's Scorecard

A mobile-first scoring app for judging hackathon presentations. Built with Vue 3
+ Vite + TypeScript.

Judges score each project 1–5 on a set of weighted criteria, jot notes, and see
a live running total. The Board view ranks all projects, flags the current
leader, and can download the current board as CSV.

## Run it

Requires **Node 22 LTS** (`^22.22.2`).

```sh
npm install
npm run dev         # dev server with hot reload
npm run type-check  # vue-tsc type check
npm run build       # type-check + production build to dist/
npm run preview     # preview the production build
```

## Structure

```
src/
  main.ts                    app entry (mounts App, loads global styles)
  style.css                  global stylesheet (design system)
  store.ts                   reactive state + localStorage persistence, reset/undo
  data/
    criteria.ts              types, weighted-total helpers, active rubric selector
    criteria.official.ts     six weighted criteria (H4FJudgingSheet.xlsx) — active
    criteria.abc.ts          original A/B/C rubric (Judging.xlsx), weight 1 each
  App.vue                    header, view tabs, layout
  components/
    ScoreView.vue            one project at a time: name, criteria, notes
    CriterionBlock.vue       a single 1–5 criterion with rubric hint
    TotalBar.vue             fixed bar: current project + running total paddle
    BoardView.vue            all projects, totals, leader, CSV download
    UndoToast.vue            snackbar to undo the last reset
```

## Saving, reset, and undo

All edits (names, scores, notes) are saved to `localStorage` under
`h4f-judging:v1` and restored on reload. Stored data is normalized against the
active rubric on load, so switching rubrics never breaks an old save — unknown
score keys are dropped and missing ones default to blank.

- **Reset project** (bottom of the scorecard) clears the current project.
- **Reset all** (board header) clears every project.

Both are undoable: a reset snapshots the previous state and shows an Undo
snackbar. Undo restores it (and re-saves). The snackbar stays until you undo or
dismiss it. Undo is per-session — it does not survive a page reload.

## Criteria and weights

Each criterion has a `weight`, and the total is the weighted sum
`Σ (score × weight)` (max `Σ (5 × weight)`). The score view, total bar, and
board all derive their columns and totals from the active rubric, so changing
the criteria flows through the whole UI.

Two rubric sets ship in `src/data/`:

- **`criteria.official.ts`** — the six official criteria from
  `H4FJudgingSheet.xlsx` (Need/Problem 20%, Problem Solving 25%, Innovation 10%,
  Societal Impact 25%, Team Capacity 10%, Feasibility 10%). Their weights sum to
  100%, so the total is on a 1–5 scale (e.g. 4.15 / 5). **This is the active set.**
- **`criteria.abc.ts`** — the original three-criterion rubric (A: Difficulty,
  B: Execution, C: Effect), all weight 1, total out of 15.

`src/data/criteria.ts` selects the active set via its `CRITERIA` export — swap
the import there to change rubrics.

State is held in memory only. Persistence (localStorage, multiple judges) is not
wired up yet.
