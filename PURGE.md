# PURGE

ctrl+love makes quickly. PURGE makes sure the leftovers do not quietly become infrastructure.

## The rule

**Not chosen = gone.**

Every experiment, route, component, asset, deployment, draft, prototype, script, and integration must end in exactly one state:

1. **KEEPER** — live, intentional, maintained.
2. **ARCHIVE** — deliberately retained for reference, clearly separated from production.
3. **TRASH** — delete it.

There is no fourth state called "leave it there."

## When PURGE runs

Run PURGE:

- before every production release
- after choosing between multiple versions
- after abandoning an experiment
- when a temporary route or deployment has served its purpose
- whenever duplicate infrastructure appears
- whenever someone says "we might need it later" without a concrete reason

## PURGE test

For every candidate, ask:

**Would we deliberately create this again today?**

- Yes -> KEEPER
- No, but it contains useful evidence/history -> ARCHIVE
- No -> TRASH

## Production rule

Only KEEPERS may:

- appear in live navigation
- own production domains
- be linked from the homepage
- be part of the public sitemap
- receive production deployments
- remain as active production infrastructure

## Archive rule

ARCHIVE is not a softer word for clutter.

Archived material must be:

- intentionally named
- removed from live navigation
- removed from production routing
- excluded from the public sitemap
- clearly separated from active work

## Vercel rule

For ctrlpluslove.com there is one production path:

`poppevanpelt/ctrlpluslove-site`
-> Vercel `ctrlpluslove-site`
-> `ctrlpluslove.com`

Duplicate Vercel projects, temporary deployments, abandoned app shells, and obsolete routes are candidates for TRASH unless they have an explicit current purpose.

## Release gate

A release is not clean until:

- new work is classified
- rejected versions are removed
- dead routes are removed or redirected intentionally
- duplicate deployments are removed or disabled
- obsolete assets are deleted
- the sitemap contains only intentional public routes
- every homepage link resolves to a KEEPER

## Default

When in doubt, trash it.

Git remembers.
