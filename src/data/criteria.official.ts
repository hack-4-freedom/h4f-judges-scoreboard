// Official Hack4Freedom rubric, from H4FJudgingSheet.xlsx → "Scoring Rubrics".
// Six criteria, each scored 1–5 with weights that sum to 100%, so the weighted
// total lands on a 1–5 scale.
//
// The rubric meaning is taken from the sheet; the wording is rewritten in the
// same terse, plain style as the original A/B/C rubric (criteria.abc.ts).
// `levels` is ordered 1 → 5 (the sheet lists them 5 → 1).

import type { Criterion } from './criteria'

export const OFFICIAL_CRITERIA: Criterion[] = [
  {
    id: 'need',
    key: 'A',
    title: 'Need / Problem',
    weight: 0.2,
    sub: 'The problem. Is it real, specific, and relevant to the community?',
    levels: [
      'No real problem stated, or one nobody actually has.',
      'Vague and shallow, or not really a societal need.',
      'A recognizable problem, but thin on detail or relevance.',
      'Clear and relevant, missing only a little depth.',
      'Sharp, specific, and clearly matters to the community. This needs solving.',
    ],
  },
  {
    id: 'solving',
    key: 'B',
    title: 'Problem Solving Factor',
    weight: 0.25,
    sub: 'The fix. Does it actually solve the problem?',
    levels: [
      "Doesn't solve the problem, or makes no sense.",
      'Weak. Big gaps between the problem and the fix.',
      'Loosely connected. Short on depth or clear logic.',
      'Solves it well, give or take some clarity.',
      'Hits the problem head on, logic airtight. Exactly what was needed.',
    ],
  },
  {
    id: 'innovation',
    key: 'C',
    title: 'Innovation and Originality',
    weight: 0.1,
    sub: 'The twist. A fresh idea, or the same old thing?',
    levels: [
      'Seen it before. A straight copy.',
      'Barely original. Generic and undifferentiated.',
      'A little creative, but mostly a conventional take.',
      'Genuinely creative, even if built on existing ideas.',
      'A bold, original take that rewrites how this gets solved.',
    ],
  },
  {
    id: 'impact',
    key: 'D',
    title: 'Societal Impact and Relevance',
    weight: 0.25,
    sub: 'The payoff. Who does this help, and how much?',
    levels: [
      'Helps no one. No real benefit.',
      'Barely any impact, and the benefits are fuzzy.',
      'Some benefit, but limited or unclear in scale.',
      'Strong potential to help people, with room to sharpen.',
      'A clear, compelling win for the community. Real good, at scale.',
    ],
  },
  {
    id: 'team',
    key: 'E',
    title: 'Team Capacity to Execute',
    weight: 0.1,
    sub: 'The team. Can they actually pull this off?',
    levels: [
      'Not equipped. Missing the skills to build it.',
      'Short on expertise, with gaps that block progress.',
      'Some of the right skills, but key gaps remain.',
      'Skilled and ready, bar a few small gaps.',
      "Sharp, complementary skills and ready to ship. They've got this.",
    ],
  },
  {
    id: 'feasibility',
    key: 'F',
    title: 'Feasibility and Scalability',
    weight: 0.1,
    sub: 'The road ahead. Can it be built, and can it grow?',
    levels: [
      "Can't be built or grown. No plan.",
      'Shaky feasibility, with big holes in the plan.',
      'Doable, but the scaling plan is thin.',
      'Practical and scalable, give or take some tweaks.',
      'Clearly buildable, market-ready, and set to scale.',
    ],
  },
]
