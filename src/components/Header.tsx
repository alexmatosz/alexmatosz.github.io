import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Download, Menu, TerminalSquare, X } from 'lucide-react'
import { useState } from 'react'
import { openTerminal } from '@/components/Terminal'
import { buttonVariants } from '@/components/ui/button'
import { useLang } from '@/i18n'
import { cn } from '@/lib/utils'
import type { Lang } from '@/content'

const sections = ['about', 'experience', 'projects', 'stack', 'activity', 'contact'] as const

export function Header() {
  const { t, lang, switchLang } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollY, scrollYProgress } = useScroll()
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24))

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300',
        scrolled || open ? 'border-b border-line/70 bg-ink/80 backdrop-blur-xl' : 'border-b border-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="group font-mono text-sm text-paper">
          <span className="text-volt">~/</span>
          alexsandro
          <span className="caret" />
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
          {sections.map((s) => (
            <a
              key={s}
              href={`#${s}`}
              className="rounded-md px-3 py-2 font-mono text-sm text-dim transition-colors hover:bg-deep hover:text-paper"
            >
              <span className="text-volt/70">./</span>
              {t.nav[s]}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openTerminal}
            aria-label={t.terminal.open}
            title={`${t.terminal.open} (Ctrl+K)`}
            className="hidden h-9 items-center gap-2 rounded-lg border border-line px-2.5 font-mono text-xs text-dim transition-colors hover:border-volt hover:text-paper lg:flex"
          >
            <TerminalSquare className="size-4 text-volt" />
            <kbd className="font-mono">Ctrl K</kbd>
          </button>
          <LangToggle lang={lang} onChange={switchLang} />
          <a
            href={t.cvFile}
            download
            className={cn(buttonVariants({ size: 'lg' }), 'hidden h-9 px-3.5 sm:inline-flex')}
          >
            <Download />
            {t.nav.cv}
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={t.nav.menu}
            className="grid size-9 place-items-center rounded-lg text-paper hover:bg-deep md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden md:hidden"
          >
            <div className="flex flex-col px-4 pb-4">
              {sections.map((s) => (
                <a
                  key={s}
                  href={`#${s}`}
                  onClick={() => setOpen(false)}
                  className="border-b border-line/60 py-3 font-mono text-paper"
                >
                  <span className="text-volt">./</span>
                  {t.nav[s]}
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  openTerminal()
                }}
                className="flex items-center gap-2 border-b border-line/60 py-3 text-left font-mono text-paper"
              >
                <TerminalSquare className="size-4 text-volt" />
                {t.terminal.open}
              </button>
              <a href={t.cvFile} download className={cn(buttonVariants({ size: 'lg' }), 'mt-4 h-11')}>
                <Download />
                {t.nav.cv}
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* barra de progresso de leitura */}
      <motion.div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-volt"
        style={{ scaleX: scrollYProgress }}
      />
    </header>
  )
}

function LangToggle({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <div role="group" aria-label="Idioma / Language" className="flex rounded-lg border border-line p-0.5 font-mono text-xs">
      {(['pt', 'en'] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onChange(l)}
          aria-pressed={lang === l}
          className={cn(
            'relative rounded-md px-2.5 py-1.5 uppercase transition-colors',
            lang === l ? 'text-white' : 'text-dim hover:text-paper',
          )}
        >
          {lang === l && (
            <motion.span layoutId="lang-pill" className="absolute inset-0 rounded-md bg-volt" transition={{ type: 'spring', bounce: 0.25, duration: 0.45 }} />
          )}
          <span className="relative">{l}</span>
        </button>
      ))}
    </div>
  )
}
