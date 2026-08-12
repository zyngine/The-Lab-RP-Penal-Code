#!/usr/bin/env node
/* charges.json -> the three class pages.

   The charge list is data, so it is kept as data and the pages are
   generated from it. Editing a fine in three places by hand is how a
   penal code ends up disagreeing with itself in the middle of a trial.

       node build.mjs

   Edit charges.json, run this, commit both. */

import { readFileSync, writeFileSync } from 'node:fs';

const rows = JSON.parse(readFileSync(new URL('./charges.json', import.meta.url), 'utf8'));

const CLASSES = [
  { key: 'Infraction', file: 'infractions.md', title: 'Infractions',
    blurb: 'The lowest tier. Mostly traffic and public-order offences; several carry no jail time at all.' },
  { key: 'Misdemeanor', file: 'misdemeanors.md', title: 'Misdemeanors',
    blurb: 'The middle tier. Theft, assault, weapons and driving offences, and anything that interferes with an investigation.' },
  { key: 'Felony', file: 'felonies.md', title: 'Felonies',
    blurb: 'The most serious offences. Violence, trafficking, robbery, and crimes against public servants and elected officials.' },
];

/* A pipe inside a cell would end the cell. Nothing in the list has one
   today, which is exactly when it is worth handling — the first charge
   that does would otherwise silently shift every column after it. */
const cell = s => String(s).replace(/\|/g, '\\|').trim();

const months = s => parseInt(String(s), 10) || 0;

let total = 0;
const counts = {};

for (const cls of CLASSES) {
  const mine = rows.filter(r => r[0] === cls.key);
  counts[cls.title] = mine.length;
  total += mine.length;

  const body = [
    `# ${cls.title}`,
    '',
    cls.blurb,
    '',
    `${mine.length} charges.`,
    '',
    '| Code | Charge | Description | Jail | Fine |',
    '|---|---|---|---|---|',
    ...mine.map(r =>
      `| \`${cell(r[1])}\` | **${cell(r[2])}** | ${cell(r[3])} | ${cell(r[4])} | ${cell(r[5])} |`),
    '',
  ].join('\n');

  writeFileSync(new URL(`./docs/${cls.file}`, import.meta.url), body);
}

/* The landing page. Deliberately does not restate any charge — a second
   copy of a fine is a second thing to forget to update. */
const money = s => parseInt(String(s).replace(/[^0-9]/g, ''), 10) || 0;

/* Sorted by jail time, then by fine. Without the second key this picked
   Terrorism over Assassination of an Elected Official — both 100 months,
   but the fine differs by $50,000, and "heaviest" reading as whichever
   happened to be listed first is worse than not saying it at all. */
const heaviest = [...rows].sort((a, b) =>
  months(b[4]) - months(a[4]) || money(b[5]) - money(a[5]))[0];

writeFileSync(new URL('./docs/index.md', import.meta.url), [
  '# Penal Code',
  '',
  `${total} charges, in three classes.`,
  '',
  ...CLASSES.map(c => `- **[${c.title}](${c.file})** — ${counts[c.title]} charges. ${c.blurb}`),
  '',
  '## Reading a charge',
  '',
  'Every charge has a code, a jail time in months and a fine. Both are',
  'the starting point, not the ceiling: a Judge sets the sentence, and',
  'the [DOJ Trial Manual](https://zyngine.github.io/The-Lab-RP-DOJ-Docs/trial-manual/)',
  'governs how that happens.',
  '',
  `The heaviest charge on the books is **${heaviest[2]}** (\`${heaviest[1]}\`)`,
  `at ${heaviest[4]} and ${heaviest[5]}.`,
  '',
  '## Changing a charge',
  '',
  'Charges live in `charges.json` at the root of this repo, and the three',
  'pages are generated from it. Edit the JSON, run `node build.mjs`, and',
  'commit both — do not edit the tables directly, they are overwritten on',
  'the next build.',
  '',
].join('\n'));

console.log(`${total} charges -> ${CLASSES.length} pages`);
for (const [k, v] of Object.entries(counts)) console.log(`  ${v}\t${k}`);
