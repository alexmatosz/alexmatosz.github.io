import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { useState, type KeyboardEvent } from 'react'
import { Reveal } from '@/components/Reveal'
import { SectionTitle } from '@/components/SectionTitle'
import { buttonVariants } from '@/components/ui/button'
import { guides } from '@/guides'
import { useLang } from '@/i18n'
import { guideHref } from '@/lib/route'
import { cn } from '@/lib/utils'

/** Lista de canais à esquerda e o resumo do escolhido ao lado; o botão leva ao guia completo. */
export function Services() {
  const { t } = useLang()
  const s = t.services
  const [active, setActive] = useState(0)

  // setas do teclado trocam de aba, como num tablist de verdade
  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    const step = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    e.preventDefault()
    const next = (active + step + guides.length) % guides.length
    setActive(next)
    document.getElementById(`svc-tab-${next}`)?.focus()
  }

  return (
    <section id="services" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle command={s.title} intro={s.intro} />

        <Reveal>
          <div className="grid gap-4 lg:grid-cols-[19rem_1fr] lg:gap-6">
            <div role="tablist" aria-orientation="vertical" onKeyDown={onKey} className="grid grid-cols-2 content-start gap-2 sm:gap-3 lg:grid-cols-1">
              {guides.map((x, i) => {
                const on = i === active
                return (
                  <button
                    key={x.slug}
                    id={`svc-tab-${i}`}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    aria-controls="svc-panel"
                    tabIndex={on ? 0 : -1}
                    onClick={() => setActive(i)}
                    className={cn(
                      'relative flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors sm:p-4',
                      on ? 'border-volt/60 bg-deep' : 'border-line bg-deep/40 hover:border-volt/30 hover:bg-deep/70',
                    )}
                  >
                    {on && (
                      <motion.span
                        layoutId="svc-active"
                        aria-hidden
                        className="absolute inset-y-3 left-0 w-0.5 rounded-full bg-volt shadow-[0_0_12px_var(--volt)]"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }}
                      />
                    )}
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white p-1.5 sm:size-11">
                      <img src={x.logo} alt="" className="max-h-full max-w-full object-contain" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm leading-tight font-semibold text-paper sm:truncate sm:text-base">{x.name}</span>
                      <span className="hidden truncate font-mono text-[11px] text-dim sm:block">{x.tag}</span>
                    </span>
                  </button>
                )
              })}
            </div>

            <div
              id="svc-panel"
              role="tabpanel"
              aria-labelledby={`svc-tab-${active}`}
              className="relative overflow-hidden rounded-3xl border border-line bg-deep/60 p-6 sm:p-10"
            >
              <div aria-hidden className="bg-dots absolute inset-0 opacity-40" />
              <div aria-hidden className="absolute -top-24 -right-24 size-72 rounded-full bg-volt/20 blur-[90px]" />
              {/* todos os resumos ocupam a mesma célula: o painel fica com a altura do maior e não pula ao trocar */}
              <div className="relative grid">
              {guides.map((g, i) => (
                <div
                  key={g.slug}
                  aria-hidden={i !== active}
                  inert={i !== active}
                  style={{ gridArea: '1 / 1' }}
                  className={cn(
                    'transition-[opacity,translate] duration-300 ease-out',
                    i === active ? 'translate-y-0 opacity-100 delay-100' : 'pointer-events-none translate-y-3 opacity-0',
                  )}
                >
                  <p className="font-mono text-xs text-volt">{g.hero.kicker}</p>
                  <h3 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-balance text-paper sm:text-4xl">{g.hero.title}</h3>
                  <p className="mt-5 max-w-[62ch] text-[17px] leading-relaxed text-paper/85">{g.summary}</p>

                  <p className="mt-8 font-mono text-xs text-dim">
                    <span className="text-volt">{'// '}</span>
                    {s.topics}
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {g.topics.map((topic) => (
                      <li key={topic} className="rounded-full border border-line bg-ink/60 px-3 py-1 font-mono text-xs text-paper/85">
                        {topic}
                      </li>
                    ))}
                  </ul>

                  <a href={guideHref(g.slug)} className={cn(buttonVariants({ size: 'lg' }), 'group/cta mt-9 h-12 px-5 text-base')}>
                    {s.read}
                    <ArrowRight className="transition-transform group-hover/cta:translate-x-1" />
                  </a>
                </div>
              ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
