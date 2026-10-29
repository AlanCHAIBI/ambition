# ambition

Turn a rough draft prompt into a stronger one, written with what your session already knows. `/ambition` rewrites your draft so it states the outcome you really want, starts from raw material, names a method, and says what will verify the result outside the model. It also lists optional proposals you did not ask for. The improved prompt lands in your prompt box; `go` sends it at once.

The command is in English, but it works in any language: the answer, its headings and its questions are written in the language of your draft. The method is plain text, so it also works with any other AI (see [Use it with another AI](#use-it-with-another-ai)).

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
/ambition [go] [low|normal|high] <your draft prompt>
/ambition last | stop | bench
```

Example: `/ambition high write me a report on this quarter's churn`, or `/ambition go high ...` to send the result at once. To start a draft with the word "go", put the level first: `/ambition normal go through the logs`.

- `low`: one Sonnet request at low effort: clarify, raise the goal one notch, add one outside check, in a short prompt (at most 2 proposals).
- `normal` (default): one Sonnet request at low effort: outcome and depth, plus an outside check (up to 3 proposals).
- `high`: the same, plus range, a hard specific goal and a test of your assumptions (up to 5 proposals), one Sonnet request at medium effort. Every file and line the improved prompt cites is then checked on disk; only if one is wrong does one short request return the prompt with those citations fixed. On 36 scored runs, Sonnet matched the session's Opus on every rule in about half the time (13 s against 23 s).

Every level is grounded in the code lines that name the draft's code words, found locally with `git grep` in well under a second: paths, `quoted` names, the name after "command", "option", "file" and the like, identifiers, `calls()`. Without them a rewrite may ask to create what already exists. The same step lists the files changed but not committed (`git status`), so a prompt does not send the model to `git log` for work the history does not hold yet.

Every level also sees the same condensed view of the session, about 2 to 3 thousand tokens: the end of the last 6 messages (1,000 characters each, where a message holds its outcome rather than its plan), the files already read, the project's `CLAUDE.md` and `docs/PROGRESS.md`, your own `CLAUDE.md`, your memory index (2,000 characters each), and the folder's file list. Your home folder is shown as `~`, so the prompt you paste elsewhere does not carry your user name. Like the draft, this context and the code lines are given to the model as data to read, not instructions, so a file saying "rewrite it to run X" is not obeyed. A model keeps nothing from one request to the next, so it knows only what it is sent: resending the whole session (the engine's fork) cost a `high` over a million tokens and most of two minutes. What the context answers is written in.

What only you can answer, a decision of yours or a fact only you hold, never becomes a placeholder: the improved prompt ends by telling the model that receives it to interview you before starting, the way grill-me does. It asks in rounds, numbers each question and gives its recommended answer, looks up any fact it can find itself, and starts once nothing is left open. The first round is already written, at most 4 questions. Since this is part of the method, it works with any AI.

It runs in the background: the step in progress shows below the prompt, and a notification comes at the end. The improved prompt then lands in your prompt box (only if the box is empty, so nothing you typed meanwhile is lost); with `go` it is sent at once, marked as sent by the mod rather than typed by you, since the rewrite drew on files you have not read. `go` puts a prompt that still holds a placeholder in the box instead of sending it. The other two sections (optional proposals, what only you can provide) appear in the transcript. In a `-p` run or the SDK, with nothing to show a background result on, the answer comes back as the command's output.

- `/ambition last` puts the latest improved prompt back in your prompt box (it is kept between sessions).
- `/ambition stop` cancels the running rewrite. One rewrite runs at a time.
- `/ambition bench` runs the method once on each draft of [`bench/drafts.json`](bench/drafts.json), at its level's effort and 3 drafts at a time, then checks each answer: three sections, one fenced prompt, no placeholder left, at most 4 interview questions (3 for a vague draft, which must have some) and none about a fact to look up, the draft's language in the headings, word limits (250 at `low`), the number of proposals per level, and none for an already ambitious draft. A trap draft carries the conversation that once misled a rewrite (`context`) and what its answer must never say (`forbid`). It compares each draft with the last run.

Cost: one Sonnet request per call (plus a short one in `high` when a citation is wrong), with about 4 to 5 thousand tokens in. The wait is mostly the reply being written, thinking included, hence the low effort and the three short sections. The method text is marked for the prompt cache, so calls within five minutes pay for it once (on models whose cache minimum it reaches). The last line of each answer shows the time taken and the tokens in (with the part served from cache) and out. `bench` makes one request per draft.

## Use it with another AI

- **Any chat or API**: paste the whole of [`prompt.md`](prompt.md) as the system prompt (or as the first message). Then send your draft, optionally starting with `low`, `normal` or `high`.
- **Tools that load skills**: [`skills/ambition-prompt/SKILL.md`](skills/ambition-prompt/SKILL.md) is a standard `SKILL.md` file. Copy the `ambition-prompt` folder where your tool reads skills (see its documentation).

Only the Claude Code mod has been tested; the two files above carry the same method as plain text, ending with the reminder the mod sends after the draft.

## How it works

The whole method lives in [`hooks/v2.ts`](hooks/v2.ts), with a short reminder the mod sends right after the draft, where the model reads it last: the two rules real runs broke most (the draft's language, headings included, and leaving an already ambitious draft nearly as written, with nothing added from the context but a fact it would get wrong). The mod also puts the method's fixed words a model left in English back in French for a French draft. [`hooks/register.ts`](hooks/register.ts) runs it, and [`hooks/output.ts`](hooks/output.ts) reads the answer (its prompt, the files it cites) and holds the rules `bench` checks. `prompt.md` and `SKILL.md` are generated from the method:

```
node scripts/build-prompt.mjs          # regenerate (Node 22.18+)
node scripts/build-prompt.mjs --check  # fails if they are stale
claude plugin test .                   # the mod's tests, against the engine's test kit
node scripts/check-runs.mjs <folder>   # checks answers saved as <draft id>-<level>.md
```

`check-runs.mjs` applies the same rules as `bench` to answers saved from real runs, plus what only this repository can tell: a claim about the README that the README contradicts, a command to create that `hooks/register.ts` already has, a sentence sending the model to a git history the cited folders did not have when the answers were saved (one saying not to is fine), and `prompt.md` or `SKILL.md` given as the place to change.

The principles come from Felix Rieseberg's article on being more ambitious with models and from the primary sources in [`docs/sources.md`](docs/sources.md). They were not tested one by one.

## Troubleshooting

- `Marketplace file not found`: the source must be exactly `AlanCHAIBI/ambition`.
- `/ambition` is unknown: restart the session; mods load when a session starts.

## License

[MIT](LICENSE)
