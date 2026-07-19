// Original Hack4Freedom rubric (A / B / C), from Judging.xlsx → CRITERIA sheet.
// Preserved here for reference. All three criteria carry equal weight (1).
//
// To use this set again, import it in criteria.ts and assign it to CRITERIA:
//   import { ABC_CRITERIA } from './criteria.abc'
//   export const CRITERIA = ABC_CRITERIA

import type { Criterion } from './criteria'

export const ABC_CRITERIA: Criterion[] = [
  {
    id: 'a',
    key: 'A',
    title: 'Difficulty',
    weight: 1,
    sub: 'The idea. How ambitious is what they set out to build?',
    levels: [
      'An unmodified idea that already exists.',
      'A slight change to an existing or simple idea. A beginner project.',
      'An incremental improvement to an existing solution. An intermediate idea.',
      'A major improvement to an existing solution. A solid project idea.',
      'Highly ambitious: a novel solution to a challenging problem. This is going to change the world.',
    ],
  },
  {
    id: 'b',
    key: 'B',
    title: 'Execution',
    weight: 1,
    sub: 'What they actually built. Does it work?',
    levels: [
      'No technical ability demonstrated. The demo shows no evidence of a prototype.',
      "Limited technical achievement. The prototype's core functionality is broken.",
      'Some working components. A partially working prototype with noticeable bugs.',
      'Solid core functionality. A working prototype with minor issues.',
      'A fully functional, seemingly flawless prototype. Mountains were moved.',
    ],
  },
  {
    id: 'c',
    key: 'C',
    title: 'Effect',
    weight: 1,
    sub: 'Swag factor, and how well it fits the theme.',
    levels: [
      'Crickets…',
      'Some good elements, but lackluster or off topic.',
      'Good, but lacks direction or drifts off topic.',
      'Impressive and polished. Inventive throughout.',
      'The coolest thing ever. Shut up and give the team their money. Standing ovation.',
    ],
  },
]
