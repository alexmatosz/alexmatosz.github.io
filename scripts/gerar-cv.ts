// Gera os currículos em PDF (PT e EN) a partir de src/content.ts.
// Uso: npm run cv   (precisa do Google Chrome instalado)
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { contact, content, type Lang } from '../src/content.ts'

const CHROME_PATHS = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean) as string[]

const chrome = CHROME_PATHS.find((p) => existsSync(p))
if (!chrome) throw new Error('Chrome não encontrado. Defina CHROME_PATH.')

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const labels = {
  pt: { summary: 'Resumo', experience: 'Experiência', projects: 'Projetos', skills: 'Competências', education: 'Formação', wip: 'em desenvolvimento', groups: ['Desenvolvimento', 'IA e automação', 'E-commerce', 'Ferramentas', 'Processos'] },
  en: { summary: 'Summary', experience: 'Experience', projects: 'Projects', skills: 'Skills', education: 'Education', wip: 'in development', groups: ['Development', 'AI and automation', 'E-commerce', 'Tools', 'Processes'] },
}

function html(lang: Lang) {
  const t = content[lang]
  const l = labels[lang]
  const projects = [{ ...t.projects.featured, wip: true }, ...t.projects.others.map((o) => ({ ...o, wip: false, bullets: [] as string[] }))]

  return `<!doctype html><html lang="${lang === 'pt' ? 'pt-BR' : 'en'}"><head><meta charset="utf-8">
<style>
  @page { size: A4; margin: 11mm 14mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #121a33; font-size: 8.9pt; line-height: 1.36; }
  header { border-bottom: 3px solid #2f6bff; padding-bottom: 10px; margin-bottom: 12px; }
  h1 { font-size: 20pt; letter-spacing: -0.02em; line-height: 1.1; }
  .role { color: #2f6bff; font-weight: 600; font-size: 11pt; margin-top: 2px; }
  .sub { color: #56607d; }
  .contacts { margin-top: 6px; color: #3a4466; font-size: 8.8pt; }
  .contacts a { color: inherit; text-decoration: none; margin-right: 12px; }
  h2 { font-size: 10.5pt; color: #2f6bff; margin: 11px 0 5px; border-bottom: 1px solid #d8def0; padding-bottom: 2px; }
  .item { margin-bottom: 7px; break-inside: avoid; }
  .row { display: flex; justify-content: space-between; gap: 12px; }
  .row strong { font-size: 10.2pt; }
  .meta { color: #56607d; font-size: 8.8pt; white-space: nowrap; }
  .ctx { color: #3a4466; }
  ul { margin: 3px 0 0 15px; }
  li { margin-bottom: 1px; }
  .stack { color: #56607d; font-size: 8.6pt; margin-top: 2px; }
  .tag { color: #b06d00; font-size: 8pt; font-weight: 600; margin-left: 6px; }
  .skills p { margin-bottom: 2px; }
</style></head><body>
<header>
  <h1>Alexsandro Joaquim De Matos</h1>
  <p class="role">${esc(t.hero.role)}</p>
  <p class="sub">${esc(t.hero.subrole)} · ${esc(t.hero.location)}</p>
  <p class="contacts">
    <a href="mailto:${contact.email}">${contact.email}</a>
    <a href="${contact.whatsapp}">${contact.whatsappLabel}</a>
    <a href="${contact.linkedin}">linkedin.com/in/alexsandrojoaquim</a>
    <a href="${contact.github}">github.com/alexmatosz</a>
  </p>
</header>

<h2>${l.summary}</h2>
<p>${esc(t.hero.tagline)} ${esc(t.about.paragraphs[1].replace(/^(Hoje junto as duas coisas|Today I combine both)\. /, ''))}</p>

<h2>${l.experience}</h2>
${t.experience.items
  .map(
    (j) => `<div class="item"><div class="row"><strong>${esc(j.role)}, ${esc(j.company)}</strong><span class="meta">${esc(j.period)}</span></div>
<p class="ctx">${esc(j.context)}</p><ul>${j.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul></div>`,
  )
  .join('')}

<h2>${l.projects}</h2>
${projects
  .map(
    (p) => `<div class="item"><div class="row"><strong>${esc(p.name)}: ${esc(p.kicker)}${p.wip ? `<span class="tag">${l.wip}</span>` : ''}</strong></div>
<p>${esc(p.description)}</p>${p.bullets.length ? `<ul>${p.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
<p class="stack">Stack: ${p.stack.map(esc).join(', ')}</p></div>`,
  )
  .join('')}

<h2>${l.skills}</h2>
<div class="skills">${t.stack.groups.map((g, gi) => `<p><strong>${esc(l.groups[gi])}:</strong> ${g.items.map(esc).join(', ')}</p>`).join('')}</div>

<h2>${l.education}</h2>
${t.education.items
  .map((e) => `<div class="item"><div class="row"><strong>${esc(e.course)}, ${esc(e.school)}</strong><span class="meta">${esc(e.status)}</span></div></div>`)
  .join('')}
<p>${t.education.languageItems.map((x) => `${esc(x.name)} (${esc(x.level)})`).join(' · ')}</p>
</body></html>`
}

const outDir = path.resolve('public/cv')
mkdirSync(outDir, { recursive: true })
const tmp = path.join(tmpdir(), 'cv-alexsandro')
mkdirSync(tmp, { recursive: true })

for (const lang of ['pt', 'en'] as const) {
  const src = path.join(tmp, `cv-${lang}.html`)
  writeFileSync(src, html(lang), 'utf8')
  const pdf = path.join(outDir, `Alexsandro-Matos-CV-${lang.toUpperCase()}.pdf`)
  execFileSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    `--user-data-dir=${path.join(tmp, 'profile')}`,
    `--print-to-pdf=${pdf}`,
    pathToFileURL(src).href,
  ])
  console.log('✓', path.relative(process.cwd(), pdf))
}
rmSync(tmp, { recursive: true, force: true })
