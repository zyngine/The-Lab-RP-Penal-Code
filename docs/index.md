# Penal Code

50 charges, in three classes.

- **[Infractions](infractions.md)** — 8 charges. The lowest tier. Mostly traffic and public-order offences; several carry no jail time at all.
- **[Misdemeanors](misdemeanors.md)** — 19 charges. The middle tier. Theft, assault, weapons and driving offences, and anything that interferes with an investigation.
- **[Felonies](felonies.md)** — 23 charges. The most serious offences. Violence, trafficking, robbery, and crimes against public servants and elected officials.

## Reading a charge

Every charge has a code, a jail time in months and a fine. Both are
the starting point, not the ceiling: a Judge sets the sentence, and
the [DOJ Trial Manual](https://zyngine.github.io/The-Lab-RP-DOJ-Docs/trial-manual/)
governs how that happens.

The heaviest charge on the books is **Assassination of an Elected Official** (`PC-3.14`)
at 100 Months and $150,000.

## Changing a charge

Charges live in `charges.json` at the root of this repo, and the three
pages are generated from it. Edit the JSON, run `node build.mjs`, and
commit both — do not edit the tables directly, they are overwritten on
the next build.
