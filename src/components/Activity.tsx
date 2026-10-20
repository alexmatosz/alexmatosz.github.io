import { AnimatePresence, motion, useInView } from 'motion/react'
import { ExternalLink, GitFork, Star } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { GithubIcon, LinkedinIcon } from '@/components/icons'
import { Reveal } from '@/components/Reveal'
import { SectionTitle } from '@/components/SectionTitle'
import github from '@/data/github.json'
import { useLang } from '@/i18n'
import { useDiario, type Entrada } from '@/lib/diario'
import { cn } from '@/lib/utils'

type Day = [string, number, number]
const weeks = github.weeks as Day[][]

const LEVEL_BG = ['bg-line/70', 'bg-volt/30', 'bg-volt/55', 'bg-volt/80', 'bg-glow']
const DIARY_PAGE = 4

export function Activity() {
  const { t } = useLang()
  const a = t.activity

  return (
    <section id="activity" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle command={a.title} intro={a.intro} />

        <Reveal>
          <ContributionCard />
        </Reveal>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.45fr_1fr] [&>*]:min-w-0">
          <Reveal>
            <Diary />
          </Reveal>
          <Reveal delay={0.1}>
            <RecentRepos />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function ContributionCard() {
  const { t, lang } = useLang()
  const g = t.activity.github
  const locale = lang === 'pt' ? 'pt-BR' : 'en-US'
  const gridRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inView = useInView(gridRef, { once: true, margin: '-10% 0px' })
  const [hover, setHover] = useState<Day | null>(null)

  // no celular o calendário rola na horizontal; começa mostrando as semanas mais recentes
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollLeft = el.scrollWidth
  }, [])

  const months = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale, { month: 'short' })
    let last = -1
    return weeks.map((w) => {
      const m = new Date(`${w[0][0]}T12:00:00`).getMonth()
      if (m === last) return ''
      last = m
      return fmt.format(new Date(`${w[0][0]}T12:00:00`)).replace('.', '')
    })
  }, [locale])

  const dayLabel = (d: Day) =>
    g.dayCount
      .replace('{n}', String(d[1]))
      .replace('{d}', new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${d[0]}T12:00:00`)))

  const updated = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(
    new Date(github.updatedAt),
  )

  return (
    <div className="rounded-3xl border border-line bg-deep/50 p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src={github.avatarUrl} alt="" width={40} height={40} className="size-10 rounded-full border border-line" />
          <div>
            <h3 className="text-lg font-semibold text-paper">{g.heading}</h3>
            <a href={`https://github.com/${github.login}`} target="_blank" rel="noreferrer" className="font-mono text-xs text-dim hover:text-paper">
              @{github.login}
            </a>
          </div>
        </div>
        <dl className="flex gap-6 sm:gap-10">
          <Stat value={github.totalContributions} label={g.contributions} />
          <Stat value={github.publicRepos} label={g.repos} />
        </dl>
      </div>

      <div ref={scrollRef} className="mt-6 overflow-x-auto pb-2">
        <div ref={gridRef} className="min-w-[680px]" onPointerLeave={() => setHover(null)}>
          <div className="mb-1.5 flex gap-[3px] font-mono text-[10px] text-dim" aria-hidden>
            {months.map((m, i) => (
              <span key={i} className="min-w-0 flex-1 overflow-visible whitespace-nowrap">
                {m}
              </span>
            ))}
          </div>
          <div className="flex gap-[3px]" role="img" aria-label={`${github.totalContributions} ${g.contributions}`}>
            {weeks.map((w, wi) => (
              <div key={wi} className="flex min-w-0 flex-1 flex-col gap-[3px]">
                {w.map((d) => (
                  <span
                    key={d[0]}
                    onPointerEnter={() => setHover(d)}
                    style={{ transitionDelay: inView ? `${wi * 12}ms` : '0ms' }}
                    className={cn(
                      'aspect-square w-full rounded-[3px] transition-[opacity,transform] duration-500',
                      LEVEL_BG[d[2]],
                      inView ? 'scale-100 opacity-100' : 'scale-50 opacity-0',
                      hover?.[0] === d[0] && 'ring-1 ring-paper',
                    )}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] text-dim">
        <p aria-live="polite" className="min-h-4">
          {hover ? <span className="text-paper">{dayLabel(hover)}</span> : `${g.updated} ${updated}`}
        </p>
        <div className="flex items-center gap-1.5" aria-hidden>
          {g.less}
          {LEVEL_BG.map((c) => (
            <span key={c} className={cn('size-[11px] rounded-[3px]', c)} />
          ))}
          {g.more}
        </div>
      </div>
    </div>
  )
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd className="text-3xl font-bold tracking-tight text-paper">{value}</dd>
      <dd className="max-w-[12ch] text-xs leading-tight text-dim">{label}</dd>
    </div>
  )
}

function RecentRepos() {
  const { t, lang } = useLang()
  const g = t.activity.github
  const rtf = new Intl.RelativeTimeFormat(lang === 'pt' ? 'pt-BR' : 'en', { numeric: 'auto' })

  function ago(iso: string) {
    const days = Math.round((new Date(iso).getTime() - new Date(github.updatedAt).getTime()) / 86_400_000)
    if (days > -31) return rtf.format(days, 'day')
    if (days > -365) return rtf.format(Math.round(days / 30), 'month')
    return rtf.format(Math.round(days / 365), 'year')
  }

  return (
    <div className="flex h-full flex-col rounded-3xl border border-line bg-deep/50 p-5 sm:p-8">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-paper">
        <GitFork className="size-5 text-volt" />
        {g.recent}
      </h3>
      <ul className="mt-4 space-y-3">
        {github.repos.map((r) => (
          <li key={r.name}>
            <a
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className="group block rounded-xl border border-line bg-ink/60 p-4 transition-colors hover:border-volt/60"
            >
              <p className="flex items-center justify-between gap-2 font-mono text-sm text-paper">
                <span className="truncate group-hover:text-glow">{r.name}</span>
                <ExternalLink className="size-3.5 shrink-0 text-dim" />
              </p>
              <p className="mt-1 text-sm text-dim">{r.description ?? g.noDescription}</p>
              <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-dim">
                {r.language && (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="size-2 rounded-full" style={{ background: r.languageColor ?? 'var(--dim)' }} />
                    {r.language}
                  </span>
                )}
                {r.stars > 0 && (
                  <span className="inline-flex items-center gap-1">
                    <Star className="size-3" />
                    {r.stars}
                  </span>
                )}
                <span>{ago(r.pushedAt)}</span>
              </p>
            </a>
          </li>
        ))}
      </ul>
      <a
        href={`https://github.com/${github.login}`}
        target="_blank"
        rel="noreferrer"
        className="mt-auto inline-flex items-center gap-2 pt-5 font-mono text-sm text-glow hover:text-paper"
      >
        <GithubIcon className="size-4" />
        {g.profile}
      </a>
    </div>
  )
}

function Diary() {
  const { t, lang } = useLang()
  const d = t.activity.diary
  const { entradas, status } = useDiario()
  const [all, setAll] = useState(false)
  const shown = all ? entradas : entradas.slice(0, DIARY_PAGE)

  return (
    <div className="h-full rounded-3xl border border-line bg-deep/50 p-5 sm:p-8">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-paper">
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-glow opacity-60" />
          <span className="relative inline-flex size-2.5 rounded-full bg-glow" />
        </span>
        {d.heading}
      </h3>

      {status === 'carregando' && <p className="caret mt-6 font-mono text-sm text-dim">{d.loading}</p>}
      {status === 'erro' && <p className="mt-4 font-mono text-xs text-signal">{d.error}</p>}
      {status !== 'carregando' && entradas.length === 0 && <p className="mt-6 text-dim">{d.empty}</p>}

      <ol className="mt-6 space-y-6">
        <AnimatePresence initial={false}>
          {shown.map((e) => (
            <motion.li
              key={e.data + e.titulo}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <DiaryEntry e={e} lang={lang} linkLabel={d.linkedin} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>

      {entradas.length > DIARY_PAGE && (
        <button type="button" onClick={() => setAll((v) => !v)} className="mt-6 font-mono text-sm text-glow hover:text-paper">
          {all ? d.less : `${d.more} (${entradas.length - DIARY_PAGE})`}
        </button>
      )}
    </div>
  )
}

function DiaryEntry({ e, lang, linkLabel }: { e: Entrada; lang: string; linkLabel: string }) {
  const date = new Intl.DateTimeFormat(lang === 'pt' ? 'pt-BR' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' }).format(
    new Date(`${e.data}T12:00:00`),
  )
  return (
    <article className="border-l-2 border-line pl-4 transition-colors hover:border-volt">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs">
        <time dateTime={e.data} className="text-signal">
          {date}
        </time>
        {e.tag && <span className="text-volt">#{e.tag}</span>}
      </p>
      <h4 className="mt-1.5 text-lg font-semibold text-paper">{e.titulo}</h4>
      {e.texto && <p className="mt-1.5 max-w-[65ch] leading-relaxed whitespace-pre-line text-paper/80">{e.texto}</p>}
      {e.imagem && (
        <img src={e.imagem} alt="" loading="lazy" className="mt-3 max-h-72 w-full rounded-xl border border-line object-cover" />
      )}
      {e.link && (
        <a
          href={e.link}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-2 font-mono text-xs text-glow hover:text-paper"
        >
          <LinkedinIcon className="size-3.5" />
          {linkLabel}
        </a>
      )}
    </article>
  )
}
