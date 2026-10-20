import { animate, useMotionValue, useMotionValueEvent, useReducedMotion } from 'motion/react'
import { useEffect, useId, useState } from 'react'
import { WhatsappIcon } from '@/components/icons'
import { Reveal } from '@/components/Reveal'
import { SectionTitle } from '@/components/SectionTitle'
import { buttonVariants } from '@/components/ui/button'
import { contact } from '@/content'
import { useLang } from '@/i18n'
import { cn } from '@/lib/utils'

const WEEKS = 52
const HOURS_PER_DAY = 8

export function Calculator() {
  const { t, lang } = useLang()
  const c = t.calculator
  const [hours, setHours] = useState(10)
  const [people, setPeople] = useState(2)
  const [rate, setRate] = useState(30)

  const hoursYear = hours * people * WEEKS
  const costYear = hoursYear * rate
  const locale = lang === 'pt' ? 'pt-BR' : 'en-US'
  const money = (v: number) => new Intl.NumberFormat(locale, { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v)
  const num = (v: number) => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(v)

  const message = c.whatsMsg.replace('{h}', num(hoursYear)).replace('{v}', money(costYear))
  const whatsUrl = `${contact.whatsapp}?text=${encodeURIComponent(message)}`

  return (
    <section id="calculator" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle command={c.title} intro={c.intro} />

        <Reveal>
          <div className="grid overflow-hidden rounded-3xl border border-line bg-deep/50 lg:grid-cols-[1fr_1.05fr]">
            <div className="space-y-8 p-6 sm:p-10">
              <Slider label={c.hours} hint={c.hoursHint} value={hours} min={1} max={40} onChange={setHours} suffix="h" />
              <Slider label={c.people} value={people} min={1} max={15} onChange={setPeople} />
              <Slider label={c.rate} value={rate} min={10} max={150} step={5} onChange={setRate} prefix="R$ " />
            </div>

            <div className="relative flex flex-col justify-center gap-6 border-t border-line bg-ink/60 p-6 sm:p-10 lg:border-t-0 lg:border-l">
              <div aria-hidden className="absolute top-0 right-0 size-72 rounded-full bg-volt/20 blur-[100px]" />
              <div className="relative" aria-live="polite">
                <p className="text-[clamp(2.6rem,7vw,4.6rem)] leading-none font-bold tracking-[-0.04em] text-paper tabular-nums">
                  <Counter value={costYear} format={money} />
                </p>
                <p className="mt-2 font-mono text-sm text-dim">{c.perYear}</p>
              </div>
              <dl className="relative grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-line bg-deep/70 p-4">
                  <dd className="text-2xl font-semibold text-glow tabular-nums">
                    <Counter value={hoursYear} format={num} />
                  </dd>
                  <dt className="text-sm text-dim">{c.hoursYear}</dt>
                </div>
                <div className="rounded-2xl border border-line bg-deep/70 p-4">
                  <dd className="text-2xl font-semibold text-glow tabular-nums">
                    <Counter value={hoursYear / HOURS_PER_DAY} format={num} />
                  </dd>
                  <dt className="text-sm text-dim">{c.workdays}</dt>
                </div>
              </dl>
              <p className="relative max-w-[52ch] text-sm leading-relaxed text-dim">{c.note}</p>
              <a
                href={whatsUrl}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ size: 'lg' }), 'relative h-12 w-fit bg-[#25D366] px-5 text-base text-[#06240f] hover:bg-[#25D366]/85')}
              >
                <WhatsappIcon className="size-5" />
                {c.cta}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

type SliderProps = {
  label: string
  hint?: string
  value: number
  min: number
  max: number
  step?: number
  prefix?: string
  suffix?: string
  onChange: (v: number) => void
}

function Slider({ label, hint, value, min, max, step = 1, prefix = '', suffix = '', onChange }: SliderProps) {
  const id = useId()
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-paper">
          {label}
        </label>
        <output htmlFor={id} className="font-mono text-lg text-glow tabular-nums">
          {prefix}
          {value}
          {suffix}
        </output>
      </div>
      {hint && <p className="mt-0.5 text-sm text-dim">{hint}</p>}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range mt-4 w-full"
        style={{ background: `linear-gradient(90deg, var(--volt) ${pct}%, var(--line) ${pct}%)` }}
      />
    </div>
  )
}

/** Número que "corre" até o valor novo. */
function Counter({ value, format }: { value: number; format: (v: number) => string }) {
  const reduce = useReducedMotion()
  const mv = useMotionValue(value)
  const [text, setText] = useState(() => format(value))
  useMotionValueEvent(mv, 'change', (v) => setText(format(v)))

  useEffect(() => {
    if (reduce) {
      mv.set(value)
      return
    }
    const controls = animate(mv, value, { duration: 0.5, ease: 'easeOut' })
    return () => controls.stop()
  }, [value, reduce, mv])

  // o idioma pode mudar o formato sem mudar o valor
  useEffect(() => {
    setText(format(mv.get()))
  }, [format, mv])

  return <>{text}</>
}
