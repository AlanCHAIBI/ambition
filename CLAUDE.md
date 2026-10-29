# ambition

- The rewrite method lives in `hooks/v2.ts`. `prompt.md` and `skills/ambition-prompt/SKILL.md` are generated from it by `node scripts/build-prompt.mjs`: never edit them by hand, change `hooks/v2.ts` and regenerate (`--check` fails when they are stale).
- `hooks/register.ts` runs the mod; `hooks/output.ts` reads its answers and holds the rules `/ambition bench` and `scripts/check-runs.mjs` check.
- Tests: `claude plugin test .` (the engine's test kit, `tests/ambition.test.ts`).
