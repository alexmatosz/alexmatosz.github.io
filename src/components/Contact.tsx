import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { Check, Copy, Mail } from 'lucide-react'
import { useState, type PointerEvent, type ReactNode } from 'react'
import { GithubIcon, LinkedinIcon, WhatsappIcon } from '@/components/icons'
import { SectionTitle } from '@/components/SectionTitle'
import { buttonVariants } from '@/components/ui/button'
import { contact } from '@/content'
import { useLang } from '@/i18n'
import { cn } from '@/lib/utils'

export function Contact() {
  const { t } = useLang()
  const [copied, setCopied] = useState(false)

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contact.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      window.location.href = `mailto:${contact.email}`
    }
  }

  return (
    <section id="contact" className="relative isolate overflow-hidden py-24 md:py-36">
      <div aria-hidden className="absolute bottom-[-30%] left-1/2 -z-10 size-[48rem] -translate-x-1/2 rounded-full bg-volt/20 blur-[150px]" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle command={t.contact.title} />

        <h3 className="text-balance max-w-4xl text-[clamp(2.8rem,8vw,6.5rem)] leading-[0.95] font-bold tracking-[-0.045em] text-paper">
          {t.contact.headline}
        </h3>
        <p className="mt-8 max-w-[56ch] text-xl leading-relaxed text-paper/80">{t.contact.text}</p>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <Magnetic>
            <a
              href={`mailto:${contact.email}`}
              className={cn(buttonVariants({ size: 'lg' }), 'h-14 px-6 text-base sm:text-lg')}
            >
              <Mail className="size-5!" />
              {contact.email}
            </a>
          </Magnetic>
          <button
            type="button"
            onClick={copyEmail}
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'h-14 min-w-44 bg-transparent px-5 text-base')}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={copied ? 'ok' : 'copy'}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="inline-flex items-center gap-2"
              >
                {copied ? <Check className="size-4 text-glow" /> : <Copy className="size-4" />}
                {copied ? t.contact.copied : t.contact.copy}
              </motion.span>
            </AnimatePresence>
          </button>
          <span aria-live="polite" className="sr-only">
            {copied ? t.contact.copied : ''}
          </span>
        </div>

        <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-4 font-mono text-sm">
          <SocialLink href={contact.whatsapp} icon={<WhatsappIcon className="size-5" />} label={`WhatsApp ${contact.whatsappLabel}`} />
          <SocialLink href={contact.linkedin} icon={<LinkedinIcon className="size-5" />} label="in/alexsandrojoaquim" />
          <SocialLink href={contact.github} icon={<GithubIcon className="size-5" />} label="github.com/alexmatosz" />
        </ul>
      </div>
    </section>
  )
}

function SocialLink({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="group inline-flex items-center gap-2.5 text-dim transition-colors hover:text-paper"
      >
        <span className="text-volt transition-transform group-hover:-rotate-12">{icon}</span>
        <span className="bg-[linear-gradient(var(--volt),var(--volt))] bg-[length:0%_1px] bg-bottom-left bg-no-repeat pb-0.5 transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
          {label}
        </span>
      </a>
    </li>
  )
}

/** O botão é "puxado" levemente na direção do cursor. */
function Magnetic({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 })
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 })

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35)
  }

  return (
    <motion.div
      onPointerMove={onMove}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
      style={{ x, y }}
      className="max-w-full"
    >
      {children}
    </motion.div>
  )
}
