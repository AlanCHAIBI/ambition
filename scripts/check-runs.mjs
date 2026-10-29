// Checks saved /ambition answers against the method's rules (check() in hooks/output.ts) and against this repository.
// Run `node scripts/check-runs.mjs <folder>` (Node 22.18+) on answers saved as <draft id>-<level>.md; the drafts come
// from <folder>/prompts.json, else bench/drafts.json. Exits 1 when any answer breaks a rule. Changes nothing.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join } from 'node:path'
import { check, historyPointers, improved } from '../hooks/output.ts'

const folder = process.argv[2]
const list = existsSync(join(folder, 'prompts.json')) ? join(folder, 'prompts.json') : new URL('../bench/drafts.json', import.meta.url)
const drafts = Object.fromEntries(JSON.parse(readFileSync(list, 'utf8')).map(d => [d.id, d]))
const git = (...args) => { try { return execFileSync('git', args, { encoding: 'utf8' }) } catch (e) { return e.stdout ?? '' } }
const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8')
const register = readFileSync(new URL('../hooks/register.ts', import.meta.url), 'utf8')
const files = readdirSync(folder).filter(f => /-(low|normal|high)\.md$/.test(f) && drafts[f.replace(/-(low|normal|high)\.md$/, '')]).sort()
// Work not committed when the answers were saved: changes still pending, or a commit to these folders since the oldest answer,
// so a run scored after that commit keeps its result.
// shortcut: the answers' file dates stand for the run's; copying the files resets them.
const saved = files.length ? new Date(Math.min(...files.map(f => statSync(join(folder, f)).mtimeMs))).toISOString() : ''
const uncommitted = !!(git('status', '--porcelain', '--', 'hooks', 'tests', 'bench').trim() || (saved && git('log', `--since=${saved}`, '--format=%H', '--', 'hooks', 'tests', 'bench').trim()))

// What only this repository can tell: each returns a failure text or ''.
const REPO = {
  // a claim about the README that the README contradicts
  'stale claim': (out) => {
    const claim = out.match(/README(?:\.md)?[^\n.]*?(périmé|ancien fonctionnement|décrit encore|still describes|out of date)/i)
    return claim && !/four sections|rereads the whole session instead/.test(readme) ? `"${claim[0].slice(0, 60)}…", which README.md contradicts` : ''
  },
  // a command to create that the code already has
  'created twice': (out, prompt) => {
    const m = prompt.match(/(conçois|implémente|crée|create|implement)[^\n.]{0,40}commande « ?(\w+)/i)
    return m && new RegExp(`\\b${m[2]}\\b`).test(register) ? `asks to create "${m[2]}", which hooks/register.ts already has` : ''
  },
  // the git history as the record of work that is not committed
  'missing history': (out, prompt) =>
    historyPointers(prompt).length && uncommitted
      ? 'points to the git history for work that is not committed'
      : '',
  // a generated file given as the thing to change (a line naming it to edit, with no word of regenerating it)
  'generated file': (out, prompt) => {
    const lines = prompt.split('\n').filter(l => /\b(prompt\.md|SKILL\.md)\b/.test(l) && /amélior|corrig|modifi|change|edit|fix|improve|update/i.test(l) && !/g[ée]n[éèe]r|generat|build-prompt/i.test(l))
    return lines.length ? `${lines.length} line${lines.length > 1 ? 's' : ''} giving prompt.md or SKILL.md, generated from hooks/v2.ts, as the thing to change` : ''
  },
}

let broken = 0
for (const f of files) {
  const [, id, level] = f.match(/^(.+)-(low|normal|high)\.md$/)
  // The mod's last line (level, time, tokens) is not part of the answer.
  const out = readFileSync(join(folder, f), 'utf8').replace(/\n+\(level [^\n]*\)\s*$/, '')
  const prompt = improved(out)?.prompt ?? ''
  const failures = check({ ...drafts[id], level }, out).failures
  for (const [name, rule] of Object.entries(REPO)) {
    const why = rule(out, prompt)
    if (why) failures.push(`${name}: ${why}`)
  }
  broken += failures.length ? 1 : 0
  console.log(`${failures.length ? '✗' : '✓'} ${f}${failures.map(x => `\n    - ${x}`).join('')}`)
}
console.log(`\n${files.length - broken}/${files.length} answers pass every rule`)
process.exit(broken ? 1 : 0)
