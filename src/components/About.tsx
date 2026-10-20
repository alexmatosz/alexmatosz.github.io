import evento from '@/assets/alex-evento.jpg'
import { Reveal } from '@/components/Reveal'
import { ParallaxImage } from '@/components/Scroll'
import { SectionTitle } from '@/components/SectionTitle'
import { useLang } from '@/i18n'

export function About() {
  const { t, lang } = useLang()

  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle command={t.about.title} />

        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16 [&>*]:min-w-0">
          <Reveal>
            <figure>
              <div className="overflow-hidden rounded-2xl border border-line">
                <ParallaxImage
                  src={evento}
                  alt={lang === 'pt' ? 'Alexsandro no evento Tray Experience Varejo, em frente ao painel com a marca da Monvatti' : 'Alexsandro at the Tray Experience Varejo event, in front of the Monvatti banner'}
                  className="aspect-[4/3] w-full object-cover object-[50%_40%]"
                  width={1600}
                  height={1066}
                />
              </div>
              <figcaption className="mt-3 font-mono text-xs text-dim">
                <span className="text-volt">{'// '}</span>
                {t.about.caption}
              </figcaption>
            </figure>
          </Reveal>

          <div>
            <div className="space-y-5 text-lg leading-relaxed text-paper/85">
              {t.about.paragraphs.map((p, i) => (
                <Reveal key={p} delay={i * 0.08}>
                  <p className="max-w-[62ch]">{p}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2}>
              <pre className="mt-10 overflow-x-auto rounded-2xl border border-line bg-deep/70 p-5 font-mono text-[13px] leading-7 sm:text-sm">
                <code>
                  <span className="text-dim">{t.about.codeComment}</span>
                  {'\n'}
                  <span className="text-volt">const</span> <span className="text-paper">alex</span>{' '}
                  <span className="text-dim">=</span> {'{'}
                  {t.about.code.map(([k, v]) => (
                    <span key={k}>
                      {'\n  '}
                      <span className="text-glow">{k}</span>
                      <span className="text-dim">: </span>
                      <span className={v.startsWith("'") || v.startsWith('[') ? 'text-signal' : 'text-volt'}>{v}</span>
                      <span className="text-dim">,</span>
                    </span>
                  ))}
                  {'\n}'}
                </code>
              </pre>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
