// Active judging rubric.
//
// Each criterion is scored 1–5 and has a `weight`. The running total is the
// weighted sum: Σ (score × weight), and the maximum is Σ (5 × weight).
//
// Rubric sets live in sibling files. To swap the active set, change which one
// CRITERIA points at below:
//   - criteria.official.ts — six weighted criteria (H4FJudgingSheet.xlsx)
//   - criteria.abc.ts       — original A/B/C rubric (Judging.xlsx), weight 1 each

import { OFFICIAL_CRITERIA } from './criteria.official'
// import { ABC_CRITERIA } from './criteria.abc'

/** A judge's score for one criterion: 1–5, or null when not yet scored. */
export type Score = number | null

export interface Criterion {
  /** Stable key used for the score field and DOM ids. */
  id: string
  /** Short display label, e.g. "A". */
  key: string
  title: string
  /** Multiplier applied to this criterion's score in the total. */
  weight: number
  /** One-line description shown under the title. */
  sub: string
  /** Descriptions for scores 1–5, in order. */
  levels: string[]
}

export interface Project {
  name: string
  notes: string
  /** Score per criterion id. */
  scores: Record<string, Score>
}

export const HINT_DEFAULT = 'Tap a score to see what it means.'

/** The rubric currently in use. */
export const CRITERIA: Criterion[] = OFFICIAL_CRITERIA

/** Trim floating-point noise from weighted sums (e.g. 4.2500001 → 4.25). */
export function formatScore(value: number): number {
  return Number(value.toFixed(2))
}

/** Weighted maximum for a project (all criteria at 5). */
export const MAX_TOTAL: number = formatScore(CRITERIA.reduce((sum, c) => sum + 5 * c.weight, 0))

/** Weighted total for one project. Unscored criteria count as 0. */
export function scoreTotal(project: Project): number {
  return CRITERIA.reduce((sum, c) => sum + (project.scores[c.id] ?? 0) * c.weight, 0)
}
