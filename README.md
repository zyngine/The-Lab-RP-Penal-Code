# The Lab RP — Penal Code

Every charge, its jail time and its fine. Readable by anyone signed in to
the staff dashboard, and published as a public site.

---

## Changing a charge

**`charges.json` is the source. The three tables are generated.**

```
1. edit charges.json
2. node build.mjs
3. commit both the JSON and the regenerated docs/
```

Editing `docs/infractions.md` directly will work right up until the next
build, which overwrites it.

The reason for the indirection: a charge has a code, a description, a
jail time and a fine, and those four have to agree everywhere they
appear. Generating the pages means there is exactly one place to change a
fine, and no way to change it in one table and forget the other.

Each row is `[Class, Code, Name, Description, Jail Time, Fine]`. `Class`
must be `Infraction`, `Misdemeanor` or `Felony` — a row with anything
else is silently dropped from every page, so check the counts the build
prints.

## Adding a class

Add it to `CLASSES` in `build.mjs`, then add the new page to
`docs/SUMMARY.md` (the dashboard's sidebar) and `mkdocs.yml` (the public
site's). All three, or the page exists and nothing links to it.

---

## What the dashboard will not render

HTML is escaped, deliberately. Images are not supported. Tables are —
which is the whole reason this book works as well as it does.
