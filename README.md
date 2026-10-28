# ambition

Turn a rough draft prompt into a stronger one, without sending it. `/ambition` rewrites your draft so it states the outcome you really want, starts from raw material, names a method, and says what will verify the result outside the model. It also lists optional proposals you did not ask for.

The command is in English, but it works in any language: the answer, its headings and the placeholders are written in the language of your draft. The method is plain text, so it also works with any other AI (see [Use it with another AI](#use-it-with-another-ai)).

## Install in Claude Code

Needs a Claude Code build that supports mods (hooks modules). In a terminal session:

```
/plugin install ambition-mod --marketplace AlanCHAIBI/ambition
```

From a shell:

```
claude plugin install ambition-mod --marketplace AlanCHAIBI/ambition
```

Answer `y` to add the marketplace, then pick a scope. In the desktop app, where `/plugin` does not run: click **+** next to the prompt box, then **Plugins**, **Add marketplace** with `AlanCHAIBI/ambition`, then **Add plugin**.

## Use it

```
/ambition [low|normal|high] <your draft prompt>
```

Example: `/ambition high write me a report on this quarter's churn`

- `low`: clarify, raise the goal one notch, add one outside check (at most 2 proposals).
- `normal` (default): outcome and depth, plus an outside check (up to 3 proposals).
- `high`: also range, a hard specific goal and a test of your assumptions (up to 5 proposals).

The answer has four sections: the improved prompt (ready to paste), what changed, optional proposals, and what only you can provide. Nothing is sent: copy the prompt if you want it. Each call uses one model request from your session.

## Use it with another AI

- **Any chat or API**: paste the whole of [`prompt.md`](prompt.md) as the system prompt (or as the first message). Then send your draft, optionally starting with `low`, `normal` or `high`.
- **Tools that load skills**: [`skills/ambition-prompt/SKILL.md`](skills/ambition-prompt/SKILL.md) is a standard `SKILL.md` file. Copy the `ambition-prompt` folder where your tool reads skills (see its documentation).

Only the Claude Code mod has been tested; the two files above carry the same method as plain text.

## How it works

The whole method lives in [`hooks/v2.ts`](hooks/v2.ts). `prompt.md` and `SKILL.md` are generated from it:

```
node scripts/build-prompt.mjs          # regenerate (Node 22.18+)
node scripts/build-prompt.mjs --check  # fails if they are stale
```

The principles come from Felix Rieseberg's article on being more ambitious with models and from the primary sources in [`docs/sources.md`](docs/sources.md). They were not tested one by one.

## Troubleshooting

- `Marketplace file not found`: the source must be exactly `AlanCHAIBI/ambition`.
- `/ambition` is unknown: restart the session; mods load when a session starts.

## License

[MIT](LICENSE)
