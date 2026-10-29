// Reading the rewriter's output: its improved prompt, what it cites, and the method's rules /ambition bench checks.

// A fenced block; a longer fence may hold shorter ones, as in Markdown.
export const FENCE = /^(`{3,}|~{3,})[^\n]*\n([\s\S]*?)\n\1[`~]*[ \t]*$/m
const FENCES = new RegExp(FENCE.source, 'gm')
// A placeholder in any language: [TO COMPLETE: ...], [À COMPLÉTER : ...]
export const PLACEHOLDER = /\[[^\]\n:]{2,40}:[^\]\n]*\]/g
// A numbered question of the interview: "1. ...?" or "1) ...?"
const QUESTION = /^\s*\d+[.)]\s.*\?/gm
// A recommended answer that is a fact to look up, not a decision
const LOOKUP = /recomm[ae]nd\w* ?:.*\b(cherch|retrouv|dédui|regarde|look (it )?up|find (it|out)|check the code)/i
// The method's fixed words left in English
const ENGLISH = /^## (Improved prompt|Proposals|To provide or decide)$|Recommended ?:|^(None|Nothing)(?:\s*(?:→|->)\s*\S+)?\.?$/gm
// A file the prompt names, with its lines if given: hooks/register.ts:103-125
const CITED = /(?<![\w/.-])((?:[\w.-]+\/)*[\w-]+\.(?:ts|tsx|js|jsx|mjs|cjs|json|md|py|cs|java|go|rs|rb|php|css|scss|html|vue|svelte|sh|ps1|yml|yaml|toml|sql|txt)(?!\w))(?::(\d+)(?:-(\d+))?)?/g
const MAX_PROPOSALS: Record<string, number> = { low: 2, normal: 3, high: 5 }
const LOW_WORDS = 250 // "keep the prompt short" at low

export type Draft = { id: string; case: 'A' | 'B' | 'C' | 'D'; level: string; draft: string; context?: string; forbid?: string[] }
export type Citation = { text: string; path: string; line?: number }
export type Improved = { prompt: string; start: number; end: number; blocks: number }

const words = (text: string) => text.split(/\s+/).filter(Boolean).length
// An accent, or two French function words: one alone ("LA", "des") also turns up in English.
const isFrench = (text: string) => /[àâçéèêëîïôûùü]/i.test(text) || (text.match(/\b(le|la|les|une?|des|pour|avec|que|est|dans|fais|rends)\b/gi) ?? []).length >= 2
// The method's fixed words a model leaves in English under a French draft, and their French
const FRENCH: [RegExp, string][] = [
  [/^## Improved prompt$/gm, '## Prompt amélioré'],
  [/^## Proposals$/gm, '## Propositions'],
  [/^## To provide or decide$/gm, '## À fournir ou décider'],
  // the word alone, or with its translation after an arrow: "Nothing → Rien"
  [/^None(?:\s*(?:→|->)\s*Aucune)?\.?$/gm, 'Aucune'],
  [/^Nothing(?:\s*(?:→|->)\s*Rien)?\.?$/gm, 'Rien'],
  [/\bRecommended ?:/g, 'Recommandé :'],
]

// The answer to a French draft with the method's English fixed words put back in French; other languages are left as written.
// shortcut: French only, the user's language; add a table like FRENCH when another language shows the same slip.
export function localize(text: string, draft: string): string {
  return isFrench(draft) ? FRENCH.reduce((t, [from, to]) => t.replace(from, to), text) : text
}

// The prompt's sentences that send the model to the git history ("git log", "l'historique git"); one saying not to
// ("pas l'historique git") is left out, and so are git diff and git status, which show work not committed yet.
export function historyPointers(prompt: string): string[] {
  return prompt.split(/(?<=[.;!?])\s+|\n/).filter(s => /git log|historique (git|des commits)|diff des commits|(commit|git) history/i.test(s) && !/\b(pas|jamais|ni|sans|not|never|without|instead)\b/i.test(s))
}

// The improved prompt: the fenced blocks of the first section, joined, so a reply that splits it still delivers all of it.
export function improved(text: string): Improved | undefined {
  const blocks: RegExpMatchArray[] = []
  for (const m of text.matchAll(FENCES)) {
    const last = blocks.at(-1)
    // A heading between two blocks ends the prompt's section; a first block past the second heading is not the prompt
    // (a command among the Proposals, say), so an unfenced prompt finds none.
    if (last ? /^## /m.test(text.slice(last.index! + last[0].length, m.index)) : (text.slice(0, m.index).match(/^## /gm) ?? []).length > 1) break
    blocks.push(m)
  }
  const [first] = blocks
  const last = blocks.at(-1)
  if (!first || !last) return undefined
  return { prompt: blocks.map(m => m[2]).join('\n\n'), start: first.index!, end: last.index! + last[0].length, blocks: blocks.length }
}

// Each file the prompt names, once per spelling, with the last line it points at; URLs left out.
export function citations(prompt: string): Citation[] {
  const seen = new Set<string>()
  return [...prompt.replace(/\w+:\/\/\S+/g, '').matchAll(CITED)].flatMap(([text, path, from, to]) => {
    if (seen.has(text) || !path) return []
    seen.add(text)
    return [{ text, path, line: to || from ? Number(to ?? from) : undefined }]
  })
}

// The rules a rewrite can be checked against without a model: the broken ones, the placeholders left and the interview's questions.
export function check(d: Draft, output: string): { failures: string[]; placeholders: number; questions: number } {
  const failures: string[] = []
  const found = improved(output)
  // Headings inside the improved prompt are not sections of the answer.
  const sections = (found ? output.slice(0, found.start) + output.slice(found.end) : output).split(/^## /m).slice(1)
  if (sections.length !== 3) failures.push(`${sections.length} sections, not 3`)
  for (const pattern of d.forbid ?? []) if (new RegExp(pattern, 'i').test(output)) failures.push(`says what it must not: /${pattern}/`)
  if (isFrench(d.draft)) {
    const english = [...new Set(output.match(ENGLISH) ?? [])]
    if (english.length) failures.push(`English in a French answer: ${english.join(', ')}`)
  }
  if (!found) return { failures: [...failures, 'no fenced prompt'], placeholders: 0, questions: 0 }

  const { prompt } = found
  const placeholders = (prompt.match(PLACEHOLDER) ?? []).length
  const questions = (prompt.match(QUESTION) ?? []).length
  if (found.blocks > 1) failures.push(`${found.blocks} fenced blocks for one prompt`)
  if (placeholders) failures.push(`${placeholders} placeholder${placeholders > 1 ? 's' : ''} left`)
  const max = d.case === 'B' ? 3 : 4
  if (questions > max) failures.push(`${questions} interview questions, more than ${max}`)
  if (d.case === 'B' && !questions) failures.push('a vague draft with no interview')
  const lookups = prompt.split('\n').filter(l => LOOKUP.test(l)).length
  if (lookups) failures.push(`${lookups} interview question${lookups > 1 ? 's' : ''} about a fact to look up`)
  if (d.case === 'A' && words(prompt) > 1.3 * words(d.draft)) failures.push(`${words(prompt)} words, over 1.3 times the draft's ${words(d.draft)}`)
  if (d.case === 'B' && words(prompt) >= 120) failures.push(`${words(prompt)} words, not under 120`)
  if (d.level === 'low' && d.case !== 'A' && words(prompt) > LOW_WORDS) failures.push(`${words(prompt)} words at low, over ${LOW_WORDS}`)
  const proposals = (sections[1] ?? '').split('\n').filter(l => /^\s*([-*]|\d+[.)])\s/.test(l)).length
  if (proposals > (MAX_PROPOSALS[d.level] ?? 5)) failures.push(`${proposals} proposals, more than ${MAX_PROPOSALS[d.level]} at ${d.level}`)
  if (d.case === 'A' && proposals) failures.push(`${proposals} proposals for an already ambitious draft`)
  return { failures, placeholders, questions }
}
