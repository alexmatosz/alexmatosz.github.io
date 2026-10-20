import { motion } from 'motion/react'
import { ArrowUpRight, GraduationCap, Languages } from 'lucide-react'
import formatura from '@/assets/alex-formatura.jpg'
import { Reveal } from '@/components/Reveal'
import { SectionTitle } from '@/components/SectionTitle'
import { useLang } from '@/i18n'

export function Skills() {
  const { t } = useLang()

  return (
    <section id="stack" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle command={t.stack.title} intro={t.stack.intro} />

        {/* árvore no estilo "npm ls" */}
        <div className="rounded-3xl border border-line bg-deep/50 p-5 font-mono text-sm sm:p-8">
          <p className="text-paper">
            alexsandro@<span className="text-glow">2026.10</span>
          </p>
          <ul className="mt-2">
            {t.stack.groups.map((g, gi) => {
              const lastGroup = gi === t.stack.groups.length - 1
              return (
                <li key={g.key} className="mt-4 first:mt-2">
                  <p className="text-dim">
                    {lastGroup ? '└─┬ ' : '├─┬ '}
                    <span className="text-volt">{g.key}</span>
                  </p>
                  <ul className="mt-1 flex flex-wrap gap-2 pl-[2ch] sm:pl-[4ch]">
                    {g.items.map((s, i) => (
                      <motion.li
                        key={s}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-5% 0px' }}
                        transition={{ delay: i * 0.04, duration: 0.35 }}
                        whileHover={{ y: -3 }}
                        className="cursor-default rounded-lg border border-line bg-ink/70 px-3 py-1.5 text-[13px] text-paper/90 transition-colors hover:border-volt hover:text-white"
                      >
                        {s}
                      </motion.li>
                    ))}
                  </ul>
                </li>
              )
            })}
          </ul>
        </div>

        <div id="education" className="mt-24 md:mt-32">
          <SectionTitle command={t.education.title} />
          <div className="grid gap-6 md:grid-cols-[1.6fr_1fr]">
            <div className="space-y-4">
              {t.education.items.map((e, i) => (
                <Reveal key={e.course} delay={i * 0.08}>
                  <div className="flex gap-4 rounded-2xl border border-line bg-deep/50 p-5 sm:p-6">
                    <GraduationCap className="mt-1 size-6 shrink-0 text-volt" />
                    <div className="min-w-0">
                      <h3 className="text-xl font-semibold text-balance text-paper">{e.course}</h3>
                      <p className="text-glow">{e.school}</p>
                      <p className="mt-1 font-mono text-xs text-dim">{e.status}</p>
                      <a
                        href={e.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group mt-3 inline-flex items-center gap-1.5 font-mono text-xs text-volt transition-colors hover:text-paper"
                      >
                        {t.education.visit}
                        <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    </div>
                  </div>
                </Reveal>
              ))}
              <Reveal delay={0.15}>
                <div className="rounded-2xl border border-line bg-deep/50 p-5 sm:p-6">
                  <h3 className="flex items-center gap-2 text-xl font-semibold text-paper">
                    <Languages className="size-5 text-volt" />
                    {t.education.languages}
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {t.education.languageItems.map((l) => (
                      <li key={l.name} className="flex items-baseline justify-between gap-4 border-b border-line/70 pb-3 last:border-0">
                        <span className="text-paper">{l.name}</span>
                        <span className="font-mono text-xs text-dim">{l.level}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.15}>
              <figure className="group">
                <div className="overflow-hidden rounded-2xl border border-line">
                  <img
                    src={formatura}
                    alt={t.education.photoAlt}
                    className="aspect-[4/5] w-full object-cover object-[50%_20%] transition-transform duration-700 group-hover:scale-[1.04]"
                    loading="lazy"
                    width={720}
                    height={1080}
                  />
                </div>
                <figcaption className="mt-3 font-mono text-xs text-dim">
                  <span className="text-volt">{'// '}</span>
                  {t.education.photoCaption}
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
