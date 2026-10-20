import { motion, useScroll, useSpring } from 'motion/react'
import { useRef } from 'react'
import { Reveal } from '@/components/Reveal'
import { SectionTitle } from '@/components/SectionTitle'
import { useLang } from '@/i18n'

export function Experience() {
  const { t } = useLang()
  const listRef = useRef<HTMLOListElement>(null)
  // a linha do "git graph" se desenha conforme a lista passa pela tela
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 75%', 'end 60%'] })
  const draw = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })

  return (
    <section id="experience" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle command={t.experience.title} intro={t.experience.intro} />

        <ol ref={listRef} className="relative">
          <div aria-hidden className="absolute top-2 bottom-2 left-[7px] w-px bg-line md:left-[calc(11rem+7px)]" />
          <motion.div
            aria-hidden
            style={{ scaleY: draw }}
            className="absolute top-2 bottom-2 left-[7px] w-px origin-top bg-volt shadow-[0_0_12px_var(--volt)] md:left-[calc(11rem+7px)]"
          />

          {t.experience.items.map((job, i) => (
            <li key={job.hash} className="relative pb-16 pl-10 last:pb-0 md:grid md:grid-cols-[11rem_1fr] md:pl-0">
              <div className="mb-3 font-mono text-xs leading-6 md:mb-0 md:pr-8 md:text-right">
                <p className="text-signal">{job.hash}</p>
                <p className="text-dim">{job.period}</p>
              </div>

              <span
                aria-hidden
                className="absolute top-1.5 left-0 grid size-[15px] place-items-center rounded-full border-2 border-volt bg-ink md:left-[11rem]"
              >
                {job.head && <span className="size-[5px] animate-ping rounded-full bg-glow" />}
              </span>

              <Reveal delay={i * 0.05} className="md:pl-10">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-2xl font-semibold tracking-tight text-paper sm:text-3xl">{job.role}</h3>
                  {job.head && (
                    <span className="rounded-md border border-volt/50 bg-volt/10 px-2 py-0.5 font-mono text-[11px] text-glow">
                      HEAD → main
                    </span>
                  )}
                </div>
                <p className="mt-1 text-lg text-glow">
                  {job.company} <span className="text-dim">/ {job.context}</span>
                </p>
                <ul className="mt-5 max-w-[68ch] space-y-3 text-paper/85">
                  {job.bullets.map((b) => (
                    <li key={b} className="relative pl-6 leading-relaxed">
                      <span aria-hidden className="absolute left-0 font-mono text-volt">
                        +
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
