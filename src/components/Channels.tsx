import amazon from '@/assets/logos/amazon.svg'
import bling from '@/assets/logos/bling.svg'
import magalu from '@/assets/logos/magalu.svg'
import mercadolivre from '@/assets/logos/mercadolivre.svg'
import replique from '@/assets/logos/replique.svg'
import shopee from '@/assets/logos/shopee.svg'
import tiktok from '@/assets/logos/tiktok.svg'
import { useLang } from '@/i18n'
import { cn } from '@/lib/utils'

type Channel = { name: string; src: string; wordmark: boolean; integrated: boolean }

// integrated = o Replique publica nesse canal pela API; os outros são canais da minha operação
const channels: Channel[] = [
  { name: 'Mercado Livre', src: mercadolivre, wordmark: false, integrated: true },
  { name: 'Shopee', src: shopee, wordmark: false, integrated: true },
  { name: 'Amazon', src: amazon, wordmark: true, integrated: true },
  { name: 'TikTok Shop', src: tiktok, wordmark: false, integrated: false },
  { name: 'Magalu', src: magalu, wordmark: true, integrated: false },
  { name: 'Bling ERP', src: bling, wordmark: true, integrated: false },
]

function Tile({ c, className }: { c: Channel; className?: string }) {
  return (
    <span className={cn('flex items-center gap-2.5 rounded-2xl bg-white px-4 shadow-[0_8px_30px_-12px_rgba(47,107,255,0.6)]', className)}>
      <img src={c.src} alt={c.wordmark ? c.name : ''} className={cn('w-auto object-contain', c.wordmark ? 'h-6 max-w-24' : 'h-7')} />
      {!c.wordmark && <span className="font-sans text-sm font-semibold whitespace-nowrap text-[#1b2240]">{c.name}</span>}
    </span>
  )
}

/** Faixa de logos que desliza sem parar (pausa com o mouse em cima). */
export function ChannelMarquee() {
  const { t } = useLang()
  const row = [...channels, ...channels]
  return (
    <section aria-label={t.channels.label} className="relative border-y border-line/70 bg-deep/40 py-8">
      <p className="mx-auto mb-6 max-w-6xl px-4 font-mono text-xs text-dim sm:px-6">
        <span className="text-volt">{'// '}</span>
        {t.channels.label}
      </p>
      <div className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <ul className="marquee flex w-max gap-4 group-hover:[animation-play-state:paused]">
          {row.map((c, i) => (
            <li key={i} aria-hidden={i >= channels.length}>
              <Tile c={c} className="h-14" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

const ring = (items: Channel[], radius: number, offsetDeg: number) =>
  items.map((c, i) => {
    const a = ((offsetDeg + (360 / items.length) * i) * Math.PI) / 180
    return { c, x: 50 + radius * Math.cos(a), y: 50 + radius * Math.sin(a) }
  })

/** Replique no centro; canais integrados no anel de dentro, canais operados no de fora. */
export function ChannelHub({ integratedLabel, operatedLabel }: { integratedLabel: string; operatedLabel: string }) {
  const inner = ring(channels.filter((c) => c.integrated), 29, -90)
  const outer = ring(channels.filter((c) => !c.integrated), 44, -30)

  return (
    <figure className="relative flex flex-col justify-center rounded-2xl border border-line bg-ink/70 p-4 sm:p-6">
      <div className="bg-dots absolute inset-0 rounded-2xl opacity-60" aria-hidden />
      <div className="@container relative mx-auto aspect-square w-full max-w-[28rem]" aria-hidden>
        <Orbit nodes={outer} spin="orbit-slow-rev" dashed />
        <Orbit nodes={inner} spin="orbit-slow" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="absolute inset-0 -m-3 animate-ping rounded-[1.6rem] bg-volt/30 [animation-duration:2.6s]" />
          <img src={replique} alt="" className="relative size-[clamp(3.5rem,21cqw,6rem)] drop-shadow-[0_0_30px_rgba(47,107,255,0.8)]" />
        </div>
      </div>

      <figcaption className="relative mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-[11px] text-dim">
        <span className="inline-flex items-center gap-2">
          <span className="h-0.5 w-6 bg-volt" />
          {integratedLabel}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-0 w-6 border-t-2 border-dashed border-dim" />
          {operatedLabel}
        </span>
      </figcaption>
      <p className="sr-only">
        Replique: {channels.filter((c) => c.integrated).map((c) => c.name).join(', ')}. {operatedLabel}:{' '}
        {channels.filter((c) => !c.integrated).map((c) => c.name).join(', ')}.
      </p>
    </figure>
  )
}

function Orbit({ nodes, spin, dashed }: { nodes: { c: Channel; x: number; y: number }[]; spin: string; dashed?: boolean }) {
  return (
    <div className={cn('absolute inset-0', spin)}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible">
        {nodes.map(({ c, x, y }, i) => (
          <g key={c.name}>
            <line
              x1="50"
              y1="50"
              x2={x}
              y2={y}
              stroke={dashed ? 'var(--dim)' : 'var(--volt)'}
              strokeOpacity={dashed ? 0.5 : 0.9}
              strokeWidth="0.5"
              strokeDasharray={dashed ? '1.5 1.5' : undefined}
            />
            {!dashed && (
              <circle r="1.1" fill="var(--glow)" className="motion-reduce:hidden">
                <animateMotion dur="2.2s" begin={`${i * 0.5}s`} repeatCount="indefinite" path={`M50 50 L${x} ${y}`} />
              </circle>
            )}
          </g>
        ))}
      </svg>
      {nodes.map(({ c, x, y }) => (
        <div key={c.name} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
          {/* gira ao contrário da órbita para a logo ficar sempre em pé */}
          <div className={cn(spin, 'counter')}>
            <span
              className={cn(
                'grid size-[clamp(2.5rem,14cqw,4rem)] place-items-center rounded-[22%] bg-white p-[14%]',
                dashed ? 'opacity-85 ring-1 ring-line' : 'shadow-[0_0_28px_-4px_rgba(47,107,255,0.9)] ring-2 ring-volt',
              )}
              title={c.name}
            >
              <img src={c.src} alt="" className="max-h-full max-w-full object-contain" />
            </span>
            <span className="mt-1 hidden text-center font-mono text-[10px] whitespace-nowrap text-paper/80 @sm:block">{c.name}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
