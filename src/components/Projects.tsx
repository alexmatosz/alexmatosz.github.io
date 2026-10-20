import { motion, useMotionTemplate, useMotionValue } from 'motion/react'
import type { PointerEvent, ReactNode } from 'react'
import { ChannelHub } from '@/components/Channels'
import { Reveal } from '@/components/Reveal'
import { SectionTitle } from '@/components/SectionTitle'
import { Badge } from '@/components/ui/badge'
import { useLang } from '@/i18n'

export function Projects() {
  const { t } = useLang()
  const p = t.projects
  const f = p.featured

  return (
    <section id="projects" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle command={p.title} intro={p.intro} />

        <Reveal>
          <Spotlight className="rounded-3xl">
            <article className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1.15fr_1fr] lg:gap-12 [&>*]:min-w-0">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-4xl font-bold tracking-[-0.03em] text-paper sm:text-5xl">{f.name}</h3>
                  <span className="inline-flex items-center gap-2 rounded-full border border-signal/40 bg-signal/10 px-3 py-1 font-mono text-xs text-signal">
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-signal opacity-70" />
                      <span className="relative inline-flex size-2 rounded-full bg-signal" />
                    </span>
                    {p.wip}
                  </span>
                </div>
                <p className="mt-2 text-lg text-glow">{f.kicker}</p>
                <p className="mt-6 font-mono text-sm text-paper">
                  <span className="text-dim">{'// '}</span>
                  {f.pun}
                </p>
                <p className="mt-5 max-w-[60ch] leading-relaxed text-paper/85">{f.description}</p>
                <ul className="mt-6 space-y-2.5 text-[15px] text-paper/80">
                  {f.bullets.map((b) => (
                    <li key={b} className="relative max-w-[62ch] pl-6 leading-relaxed">
                      <span aria-hidden className="absolute left-0 font-mono text-volt">
                        ›
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
                <StackList label={p.stackLabel} items={f.stack} />
              </div>

              <ChannelHub integratedLabel={f.hub.integrated} operatedLabel={f.hub.operated} />
            </article>
          </Spotlight>
        </Reveal>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {p.others.map((o, i) => (
            <Reveal key={o.name} delay={i * 0.1} className="h-full">
              <Spotlight className="h-full rounded-3xl">
                <article className="flex h-full flex-col p-6 sm:p-8">
                  <p className="font-mono text-xs text-dim">{o.kicker}</p>
                  <h3 className="mt-2 text-3xl font-bold tracking-[-0.02em] text-paper">{o.name}</h3>
                  <p className="mt-4 font-mono text-sm text-paper">
                    <span className="text-dim">{'// '}</span>
                    {o.pun}
                  </p>
                  <p className="mt-4 leading-relaxed text-paper/80">{o.description}</p>
                  <div className="mt-auto">
                    <StackList label={p.stackLabel} items={o.stack} />
                  </div>
                </article>
              </Spotlight>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function StackList({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="mt-7">
      <p className="sr-only">{label}</p>
      <ul className="flex flex-wrap gap-2">
        {items.map((s) => (
          <li key={s}>
            <Badge variant="outline" className="h-6 border-line bg-ink/60 px-2.5 font-mono text-[11px] text-paper/80">
              {s}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Cartão com uma luz azul que acompanha o mouse. */
function Spotlight({ children, className }: { children: ReactNode; className?: string }) {
  const x = useMotionValue(-999)
  const y = useMotionValue(-999)
  const background = useMotionTemplate`radial-gradient(420px circle at ${x}px ${y}px, rgba(47,107,255,0.16), transparent 60%)`
  function onMove(e: PointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect()
    x.set(e.clientX - r.left)
    y.set(e.clientY - r.top)
  }
  return (
    <div
      onPointerMove={onMove}
      onPointerLeave={() => {
        x.set(-999)
        y.set(-999)
      }}
      className={`group relative overflow-hidden border border-line bg-deep/60 transition-colors duration-300 hover:border-volt/50 ${className ?? ''}`}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}
