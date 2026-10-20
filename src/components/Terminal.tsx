import { AnimatePresence, motion } from 'motion/react'
import { TerminalSquare, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react'
import { contact } from '@/content'
import { useLang } from '@/i18n'

type Line = { kind: 'in' | 'out' | 'err'; text: ReactNode }

// nomes aceitos no "cd", em PT e EN, apontando para o id da seção
const SECTIONS: Record<string, string> = {
  sobre: 'about', about: 'about', whoami: 'about',
  experiencia: 'experience', experience: 'experience',
  projetos: 'projects', projects: 'projects',
  'como-opero': 'services', 'how-i-work': 'services', servicos: 'services', services: 'services', guias: 'services',
  stack: 'stack', skills: 'stack',
  atividade: 'activity', activity: 'activity', diario: 'activity',
  calculadora: 'calculator', calculator: 'calculator',
  contato: 'contact', contact: 'contact',
  formacao: 'education', education: 'education',
  home: 'top', '~': 'top',
}

/** Abre com Ctrl+K (ou ⌘K) ou pelo botão no topo; o visitante navega digitando comandos. */
export function Terminal() {
  const { t, lang, switchLang } = useLang()
  const tt = t.terminal
  const [open, setOpen] = useState(false)
  const [lines, setLines] = useState<Line[]>([])
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [cursor, setCursor] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    const onOpen = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('open-terminal', onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('open-terminal', onOpen)
    }
  }, [])

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [lines])

  const go = useCallback((id: string) => {
    setOpen(false)
    window.setTimeout(() => {
      const el = document.getElementById(id)
      // dentro de um guia a seção não existe: volta para a home, que rola até ela
      if (el) el.scrollIntoView({ behavior: 'smooth' })
      else window.location.hash = id
    }, 150)
  }, [])

  const openUrl = (url: string, label: string) => {
    window.open(url, '_blank', 'noopener')
    return tt.opening.replace('{x}', label)
  }

  function run(raw: string): Line[] | 'clear' {
    const [cmd = '', ...args] = raw.trim().toLowerCase().split(/\s+/)
    const arg = args.join(' ')
    const out = (text: ReactNode): Line[] => [{ kind: 'out', text }]

    switch (cmd) {
      case '':
        return []
      case 'help':
      case 'ajuda':
        return out(
          <span className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-0.5">
            {tt.help.map(([c, d]) => (
              <span key={c} className="contents">
                <span className="text-glow">{c}</span>
                <span className="text-dim">{d}</span>
              </span>
            ))}
          </span>,
        )
      case 'whoami':
        return out(tt.whoami)
      case 'ls':
        return out(<span className="text-glow">{tt.sections}</span>)
      case 'cd': {
        const id = SECTIONS[arg.replace(/^\.\//, '').replace(/\/$/, '')]
        if (!id) return [{ kind: 'err', text: tt.notFound.replace('{c}', `cd ${arg}`) }]
        go(id)
        return out(`→ ${arg}`)
      }
      case 'cv':
      case 'curriculo':
      case 'resume': {
        const a = document.createElement('a')
        a.href = t.cvFile
        a.download = ''
        a.click()
        return out(tt.opening.replace('{x}', t.cvFile.split('/').pop() ?? 'cv'))
      }
      case 'contato':
      case 'contact':
        return out(
          <span className="block">
            email    <span className="text-glow">{contact.email}</span>
            {'\n'}whatsapp <span className="text-glow">{contact.whatsappLabel}</span>
            {'\n'}linkedin <span className="text-glow">{contact.linkedin.replace('https://www.', '')}</span>
            {'\n'}github   <span className="text-glow">{contact.github.replace('https://', '')}</span>
          </span>,
        )
      case 'github':
        return out(openUrl(contact.github, 'GitHub'))
      case 'linkedin':
        return out(openUrl(contact.linkedin, 'LinkedIn'))
      case 'whatsapp':
      case 'zap':
        return out(openUrl(contact.whatsapp, 'WhatsApp'))
      case 'email':
        window.location.href = `mailto:${contact.email}`
        return out(tt.opening.replace('{x}', contact.email))
      case 'lang':
        if (arg === 'pt' || arg === 'en') {
          setOpen(false)
          switchLang(arg)
          return []
        }
        return [{ kind: 'err', text: 'lang pt | lang en' }]
      case 'clear':
      case 'cls':
        return 'clear'
      case 'exit':
      case 'quit':
        setOpen(false)
        return []
      case 'sudo':
        return [{ kind: 'err', text: tt.sudo }]
      case 'cafe':
      case 'café':
      case 'coffee':
        return out(`☕ ${tt.coffee}`)
      case 'rm':
        return [{ kind: 'err', text: tt.rm }]
      case 'hire':
      case 'contratar':
        openUrl(contact.whatsapp, 'WhatsApp')
        return out(tt.hire)
      default:
        return [{ kind: 'err', text: tt.notFound.replace('{c}', cmd) }]
    }
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    const result = run(value)
    if (result === 'clear') setLines([])
    else setLines((l) => [...l, { kind: 'in', text: value }, ...result])
    if (value.trim()) setHistory((h) => [value, ...h].slice(0, 30))
    setCursor(-1)
    setValue('')
  }

  function onInputKey(e: ReactKeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault()
      const next = Math.min(cursor + 1, history.length - 1)
      setCursor(next)
      setValue(history[next])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = cursor - 1
      setCursor(next)
      setValue(next >= 0 ? history[next] : '')
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="terminal"
          className="fixed inset-0 z-[90] flex items-start justify-center bg-ink/70 px-4 pt-[12vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={tt.open}
            initial={{ y: 24, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 12, scale: 0.98 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-line bg-[#070c22] shadow-[0_40px_120px_-20px_rgba(47,107,255,0.6)]"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5 font-mono text-xs text-dim">
              <span className="flex items-center gap-2">
                <TerminalSquare className="size-4 text-volt" />
                alexsandro-sh — {lang}
              </span>
              <button type="button" onClick={() => setOpen(false)} aria-label="Fechar / Close" className="rounded p-1 hover:bg-deep hover:text-paper">
                <X className="size-4" />
              </button>
            </div>
            <div className="max-h-[55vh] overflow-y-auto p-4 font-mono text-[13px] leading-relaxed whitespace-pre-wrap" onClick={() => inputRef.current?.focus()}>
              <p className="text-dim">{tt.welcome}</p>
              {lines.map((l, i) => (
                <div key={i} className={l.kind === 'err' ? 'text-signal' : l.kind === 'in' ? 'mt-2 text-paper' : 'text-paper/85'}>
                  {l.kind === 'in' && <span className="text-volt">~$ </span>}
                  {l.text}
                </div>
              ))}
              <form onSubmit={submit} className="mt-2 flex items-center gap-2">
                <span className="text-volt">~$</span>
                <input
                  ref={inputRef}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={onInputKey}
                  placeholder={tt.placeholder}
                  aria-label={tt.placeholder}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  className="flex-1 bg-transparent text-paper caret-glow outline-none placeholder:text-dim/60"
                />
              </form>
              <div ref={endRef} />
            </div>
            <p className="border-t border-line px-4 py-2 font-mono text-[11px] text-dim">{tt.hint} · Esc</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Abre o terminal de qualquer lugar (ex.: botão do topo). */
export const openTerminal = () => window.dispatchEvent(new Event('open-terminal'))
