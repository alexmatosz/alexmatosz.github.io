import { ArrowLeft, ArrowRight, Check, TriangleAlert, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { WhatsappIcon } from '@/components/icons'
import { Reveal } from '@/components/Reveal'
import { buttonVariants } from '@/components/ui/button'
import { contact } from '@/content'
import { findGuide, guides, type Guide, type GuideSection } from '@/guides'
import { useLang } from '@/i18n'
import { guideHref } from '@/lib/route'
import { cn } from '@/lib/utils'

/** Página de um guia: o problema do canal, cada tema em detalhe e como eu faço. */
export function GuidePage({ slug }: { slug: string }) {
  const { t } = useLang()
  const g = findGuide(slug)

  if (!g) {
    return (
      <main className="mx-auto flex min-h-svh max-w-6xl flex-col justify-center px-4 pt-24 sm:px-6">
        <p className="font-mono text-paper">
          <span className="text-volt">~$ </span>
          {t.guide.notFound}
        </p>
        <BackLink />
      </main>
    )
  }
  return <Guide g={g} />
}

function BackLink() {
  const { t } = useLang()
  return (
    <a href="#services" className="group mt-6 inline-flex items-center gap-2 font-mono text-sm text-dim transition-colors hover:text-paper">
      <ArrowLeft className="size-4 text-volt transition-transform group-hover:-translate-x-1" />
      cd .. <span className="text-dim/70">{'// '}{t.guide.back}</span>
    </a>
  )
}

function Guide({ g }: { g: Guide }) {
  const { t, lang } = useLang()
  const tg = t.guide
  const toc = [{ id: 'problema', label: tg.problem }, ...g.sections.map((s) => ({ id: s.id, label: s.label })), { id: 'como-faco', label: g.approach.title }]
  const current = useActiveSection(toc.map((x) => x.id))
  const whats = `${contact.whatsapp}?text=${encodeURIComponent(tg.whatsMsg.replace('{x}', g.name))}`

  useEffect(() => {
    const previous = document.title
    document.title = `${g.name} · Alexsandro Matos`
    return () => {
      document.title = previous
    }
  }, [g.name])

  return (
    <main className="relative">
      {/* topo */}
      <section className="relative isolate overflow-hidden border-b border-line/70 pt-24 pb-14 sm:pt-28 md:pb-20">
        <div aria-hidden className="bg-dots absolute inset-0 -z-10 opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div aria-hidden className="absolute -top-40 left-1/2 -z-10 size-[40rem] -translate-x-1/2 rounded-full bg-volt/20 blur-[140px]" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <BackLink />
          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-start">
            <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-white p-2.5 shadow-[0_0_40px_-8px_rgba(47,107,255,0.9)] sm:size-20">
              <img src={g.logo} alt={g.name} className="max-h-full max-w-full object-contain" />
            </span>
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-3 font-mono text-xs text-volt">
                {g.hero.kicker}
                {import.meta.env.DEV && g.draft && (
                  <span className="rounded-full border border-signal/40 bg-signal/10 px-2 py-0.5 text-signal">{tg.draft}</span>
                )}
              </p>
              <h1 className="mt-3 text-[clamp(2.2rem,6vw,4.25rem)] leading-[1.02] font-bold tracking-[-0.04em] text-balance text-paper">
                {g.hero.title}
              </h1>
              <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-paper/80 sm:text-xl">{g.hero.lead}</p>
              {lang !== 'pt' && tg.ptOnly && (
                <p className="mt-6 max-w-[62ch] rounded-xl border border-line bg-deep/70 px-4 py-3 font-mono text-xs text-dim">{tg.ptOnly}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[13rem_1fr] lg:gap-14">
        {/* índice: barra horizontal no celular, coluna fixa no desktop */}
        <nav aria-label={tg.onPage} className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-3 font-mono text-xs text-dim">
            <span className="text-volt">{'// '}</span>
            {tg.onPage}
          </p>
          <ol className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0">
            {toc.map((x, i) => (
              <li key={x.id} className="shrink-0">
                <a
                  href={`#${x.id}`}
                  onClick={(e) => {
                    // o hash é a rota do guia, então a rolagem até a seção é feita aqui
                    e.preventDefault()
                    document.getElementById(x.id)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  aria-current={current === x.id ? 'true' : undefined}
                  className={cn(
                    'flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs whitespace-nowrap transition-colors lg:rounded-lg lg:border-transparent lg:py-2',
                    current === x.id ? 'border-volt/60 bg-deep text-paper lg:border-transparent' : 'border-line text-dim hover:text-paper',
                  )}
                >
                  <span className={current === x.id ? 'text-volt' : 'text-dim/60'}>{String(i).padStart(2, '0')}</span>
                  {x.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="min-w-0 space-y-20 md:space-y-28">
          <Reveal>
            <section id="problema" className="scroll-mt-24">
              <SectionHead n={0} label={tg.problem} title={g.problem.title} />
              <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
                <div className="space-y-4 text-[17px] leading-relaxed text-paper/85">
                  {g.problem.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                <div className="rounded-2xl border border-signal/30 bg-signal/[0.06] p-5 sm:p-6">
                  <p className="font-mono text-xs text-signal">{tg.symptoms}</p>
                  <ul className="mt-4 space-y-3">
                    {g.problem.symptoms.map((s) => (
                      <li key={s} className="flex gap-3 text-[15px] leading-snug text-paper/85">
                        <TriangleAlert className="mt-0.5 size-4 shrink-0 text-signal" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </Reveal>

          {g.sections.map((s, i) => (
            <Reveal key={s.id}>
              <TopicSection s={s} n={i + 1} />
            </Reveal>
          ))}

          <Reveal>
            <section id="como-faco" className="scroll-mt-24">
              <SectionHead n={g.sections.length + 1} label="./run" title={g.approach.title} />
              <ol className="relative space-y-6 border-l border-line pl-6 sm:pl-8">
                {g.approach.steps.map((st, i) => (
                  <li key={st.title} className="relative">
                    <span className="absolute top-0.5 -left-[2.05rem] grid size-7 place-items-center rounded-full border border-volt bg-ink font-mono text-[11px] text-volt sm:-left-[2.55rem]">
                      {i + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-paper">{st.title}</h3>
                    <p className="mt-1 max-w-[62ch] leading-relaxed text-paper/75">{st.text}</p>
                  </li>
                ))}
              </ol>

              <div className="mt-12 rounded-2xl border border-line bg-deep/50 p-5 sm:p-6">
                <p className="font-mono text-xs text-dim">
                  <span className="text-volt">$ </span>
                  {tg.tools}
                </p>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {g.tools.map((tool) => (
                    <li key={tool.name} className="rounded-xl border border-line/70 bg-ink/50 px-4 py-3">
                      <span className="font-mono text-sm text-glow">{tool.name}</span>
                      <span className="mt-0.5 block text-sm text-paper/70">{tool.why}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section className="relative overflow-hidden rounded-3xl border border-volt/40 bg-volt/10 p-6 sm:p-10">
              <div aria-hidden className="absolute -right-20 -bottom-24 size-72 rounded-full bg-volt/30 blur-[90px]" />
              <h2 className="relative text-3xl font-bold tracking-[-0.03em] text-balance text-paper sm:text-4xl">{tg.ctaTitle}</h2>
              <p className="relative mt-3 max-w-[52ch] text-lg text-paper/80">{tg.ctaText}</p>
              <a href={whats} target="_blank" rel="noreferrer" className={cn(buttonVariants({ size: 'lg' }), 'relative mt-7 h-12 px-5 text-base')}>
                <WhatsappIcon className="size-5" />
                {tg.ctaButton}
              </a>
            </section>
          </Reveal>

          <section>
            <p className="font-mono text-xs text-dim">
              <span className="text-volt">{'// '}</span>
              {tg.others}
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {guides
                .filter((x) => x.slug !== g.slug)
                .map((x) => (
                  <li key={x.slug}>
                    <a
                      href={guideHref(x.slug)}
                      className="group flex h-full items-center gap-3 rounded-2xl border border-line bg-deep/40 p-4 transition-colors hover:border-volt/50"
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white p-1.5">
                        <img src={x.logo} alt="" className="max-h-full max-w-full object-contain" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-paper">{x.name}</span>
                        <span className="block truncate font-mono text-[11px] text-dim">{x.tag}</span>
                      </span>
                      <ArrowRight className="size-4 shrink-0 text-volt transition-transform group-hover:translate-x-1" />
                    </a>
                  </li>
                ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  )
}

function SectionHead({ n, label, title }: { n: number; label: string; title: string }) {
  return (
    <header className="mb-8">
      <p className="font-mono text-xs text-dim">
        <span className="text-volt">{String(n).padStart(2, '0')}</span> · {label}
      </p>
      <h2 className="mt-2 text-3xl font-bold tracking-[-0.03em] text-balance text-paper sm:text-4xl">{title}</h2>
    </header>
  )
}

function TopicSection({ s, n }: { s: GuideSection; n: number }) {
  const { t } = useLang()
  return (
    <section id={s.id} className="scroll-mt-24">
      <SectionHead n={n} label={s.label.toLowerCase()} title={s.title} />
      <p className="-mt-3 mb-8 max-w-[64ch] text-[17px] leading-relaxed text-paper/80">{s.lead}</p>

      <ul className="grid gap-3 sm:grid-cols-2">
        {s.points.map((p) => (
          <li key={p.title} className="rounded-2xl border border-line bg-deep/50 p-5 transition-colors hover:border-volt/40">
            <h3 className="font-semibold text-paper">{p.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-paper/75">{p.text}</p>
          </li>
        ))}
      </ul>

      {s.compare && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <CompareList kind="wrong" title={t.guide.wrong} items={s.compare.wrong} />
          <CompareList kind="right" title={t.guide.right} items={s.compare.right} />
        </div>
      )}
    </section>
  )
}

function CompareList({ kind, title, items }: { kind: 'wrong' | 'right'; title: string; items: string[] }) {
  const right = kind === 'right'
  const Icon = right ? Check : X
  return (
    <div className={cn('rounded-2xl border p-5', right ? 'border-volt/50 bg-volt/10' : 'border-line bg-ink/40')}>
      <p className={cn('font-mono text-xs', right ? 'text-glow' : 'text-dim')}>{title}</p>
      <ul className="mt-3 space-y-2">
        {items.map((x) => (
          <li key={x} className={cn('flex gap-2.5 text-[15px]', right ? 'text-paper' : 'text-paper/60')}>
            <Icon className={cn('mt-0.5 size-4 shrink-0', right ? 'text-volt' : 'text-destructive/70')} />
            {x}
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Id da seção que está no topo da tela, para destacar no índice. */
function useActiveSection(ids: string[]) {
  const [current, setCurrent] = useState(ids[0])
  const key = ids.join('|')
  useEffect(() => {
    const els = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el)
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (hit) setCurrent(hit.target.id)
      },
      { rootMargin: '-20% 0px -65% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [key])
  return current
}
