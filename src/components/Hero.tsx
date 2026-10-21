import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowDown, Download, MapPin } from 'lucide-react'
import { useEffect, useRef, useState, type PointerEvent } from 'react'
import retrato from '@/assets/alex-retrato.jpg'
import { ScrollTilt, useWide } from '@/components/Scroll'
import { buttonVariants } from '@/components/ui/button'
import { useLang } from '@/i18n'
import { cn } from '@/lib/utils'

const LINE_MS = 220

export function Hero() {
  const { t, lang } = useLang()
  const reduce = useReducedMotion()
  // quantas linhas do boot já apareceram; só roda na primeira carga.
  // é enfeite: nome, descrição e foto entram junto, sem esperar o boot terminar
  const [shown, setShown] = useState(reduce ? t.boot.length : 0)
  const booted = shown >= t.boot.length

  useEffect(() => {
    if (booted) return
    const id = window.setTimeout(() => setShown((n) => n + 1), shown === 0 ? 120 : LINE_MS)
    return () => window.clearTimeout(id)
  }, [shown, booted])

  // saindo do topo: texto sobe e some, foto desce e encolhe, o brilho fica para trás (camadas em velocidades diferentes).
  // só com as duas colunas lado a lado; no celular a foto fica embaixo do texto e o efeito apagaria o que ainda está sendo lido
  const wide = useWide()
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const textY = useTransform(scrollYProgress, [0, 1], [0, -140])
  const textOpacity = useTransform(scrollYProgress, [0.15, 0.85], [1, 0])
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 90])
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, 0.88])
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 260])
  const exit = (style: Record<string, unknown>) => (reduce || !wide ? undefined : style)

  return (
    <section ref={sectionRef} id="top" className="relative isolate flex min-h-svh items-center overflow-hidden pt-24 pb-16">
      <div
        aria-hidden
        className="bg-dots absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_60%_at_60%_40%,black,transparent)]"
      />
      <motion.div
        aria-hidden
        style={exit({ y: glowY })}
        className="absolute top-1/4 right-[-10%] -z-10 size-[42rem] rounded-full bg-volt/25 blur-[140px]"
      />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <motion.div style={exit({ y: textY, opacity: textOpacity })}>
          <div className="mb-8 min-h-[6.5rem] font-mono text-[13px] leading-relaxed sm:text-sm" aria-hidden>
            {t.boot.slice(0, shown).map((line, i) => (
              <motion.p
                key={`${lang}-${i}`}
                initial={reduce ? false : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className={i === 0 ? 'text-paper' : 'text-dim'}
              >
                {line.endsWith('ok') ? (
                  <>
                    {line.slice(0, -2)}
                    <span className="text-glow">ok</span>
                  </>
                ) : (
                  line
                )}
              </motion.p>
            ))}
            {!booted && <span className="caret" />}
          </div>

          <h1 className="sr-only">Alexsandro Joaquim De Matos — {t.hero.role}</h1>
          <div aria-hidden className="font-heading leading-[0.88] font-bold tracking-[-0.045em]">
            <SplitWord text="Alexsandro" delay={0} className="text-[clamp(3.2rem,13vw,7.25rem)] text-paper" />
            <SplitWord
              text="Joaquim De Matos"
              delay={0.15}
              className="mt-1 text-[clamp(1.9rem,6.4vw,3.9rem)] font-light tracking-[-0.03em] text-glow"
            />
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mt-8 font-mono text-sm text-paper sm:text-base">
              <span className="text-volt">{'<'}</span>
              {t.hero.role}
              <span className="text-volt">{' />'}</span>
            </p>
            <p className="mt-1 font-mono text-sm text-dim">{t.hero.subrole}</p>
            <p className="text-balance mt-6 max-w-xl text-xl leading-snug text-paper/90 sm:text-2xl">{t.hero.tagline}</p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a href="#projects" className={cn(buttonVariants({ size: 'lg' }), 'h-12 px-5 text-base')}>
                {t.hero.ctaProjects}
              </a>
              <a
                href={t.cvFile}
                download
                className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'h-12 bg-transparent px-5 text-base')}
              >
                <Download />
                {t.hero.ctaCv}
              </a>
            </div>
            <p className="mt-6 flex items-center gap-2 text-sm text-dim">
              <MapPin className="size-4 text-volt" />
              {t.hero.location}
            </p>
          </motion.div>
        </motion.div>

        <motion.div style={exit({ y: photoY, scale: photoScale })}>
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.94, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full max-w-sm lg:max-w-[25rem]"
          >
            {wide ? (
              <PhotoWindow lang={lang} />
            ) : (
              <ScrollTilt>
                <PhotoWindow lang={lang} />
              </ScrollTilt>
            )}
          </motion.div>
        </motion.div>
      </div>

      <a
        href="#about"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 font-mono text-xs text-dim transition-colors hover:text-paper md:flex"
      >
        <motion.span animate={reduce ? undefined : { y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
          <ArrowDown className="size-4" />
        </motion.span>
        {t.hero.scroll}
      </a>
    </section>
  )
}

function SplitWord({ text, delay, className }: { text: string; delay: number; className?: string }) {
  const reduce = useReducedMotion()
  let index = 0
  // cada palavra fica inteira na mesma linha; as letras sobem uma a uma
  return (
    <span className={cn('block pb-[0.08em]', className)}>
      {text.split(' ').map((word, w) => (
        <span key={w} className="inline-block overflow-hidden whitespace-nowrap pb-[0.1em] align-top">
          {Array.from(word).map((ch) => {
            const i = index++
            return (
              <motion.span
                key={i}
                className="inline-block"
                initial={reduce ? false : { y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ delay: delay + i * 0.028, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                {ch}
              </motion.span>
            )
          })}
          {w < text.split(' ').length - 1 && <span className="inline-block w-[0.25em]" />}
        </span>
      ))}
    </span>
  )
}

/** Foto dentro de uma "janela de editor" que inclina seguindo o mouse. */
function PhotoWindow({ lang }: { lang: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(py, [0, 1], [7, -7]), { stiffness: 150, damping: 18 })
  const rotateY = useSpring(useTransform(px, [0, 1], [-9, 9]), { stiffness: 150, damping: 18 })
  const shineX = useTransform(px, (v) => `${v * 100}%`)
  const shineY = useTransform(py, (v) => `${v * 100}%`)
  const shine = useTransform(
    [shineX, shineY],
    ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.35), transparent 55%)`,
  )

  function onMove(e: PointerEvent) {
    if (reduce || e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  function onLeave() {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <div className="[perspective:1100px]">
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX, rotateY }}
        className="relative overflow-hidden rounded-2xl border border-line bg-deep shadow-[0_40px_120px_-30px_rgba(47,107,255,0.55)]"
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5 font-mono text-xs">
          <span className="rounded-md bg-ink px-2.5 py-1 text-paper">
            alex.jpg <span className="ml-1 text-dim">×</span>
          </span>
          <span className="text-dim">main</span>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={retrato}
            alt={lang === 'pt' ? 'Alexsandro sorrindo, de braços cruzados, com camiseta da Monvatti' : 'Alexsandro smiling, arms crossed, wearing a Monvatti T-shirt'}
            className="absolute inset-0 size-full object-cover object-[50%_35%]"
            width={900}
            height={1600}
          />
          <motion.div
            aria-hidden
            className="absolute inset-0 mix-blend-soft-light"
            style={{ background: shine }}
          />
        </div>
        <div className="flex items-center justify-between border-t border-line px-4 py-2 font-mono text-[11px] text-dim">
          <span>900 × 1600 · JPG</span>
          <span className="text-glow">{lang === 'pt' ? '✓ 100% humano' : '✓ 100% human'}</span>
        </div>
      </motion.div>
    </div>
  )
}
