import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { content, type Content, type Lang } from '@/content'

type LangContext = { lang: Lang; t: Content; switchLang: (next: Lang) => void }

const Ctx = createContext<LangContext | null>(null)
const STORAGE_KEY = 'alex-lang'

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'pt' || saved === 'en') return saved
  } catch {
    // storage bloqueado: segue com o idioma do navegador
  }
  return navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang)
  const [wipe, setWipe] = useState<Lang | null>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en'
    document.title =
      lang === 'pt'
        ? 'Alexsandro Matos · Dev Full Stack Jr.'
        : 'Alexsandro Matos · Junior Full Stack Dev'
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // ignora
    }
  }, [lang])

  const switchLang = useCallback(
    (next: Lang) => {
      if (next === lang || wipe) return
      if (reduce) return setLang(next)
      // a cortina cobre a tela, o texto troca por baixo e ela sai pelo outro lado
      setWipe(next)
      window.setTimeout(() => setLang(next), 380)
      window.setTimeout(() => setWipe(null), 420)
    },
    [lang, wipe, reduce],
  )

  return (
    <Ctx.Provider value={{ lang, t: content[lang], switchLang }}>
      {children}
      <AnimatePresence>
        {wipe && (
          <motion.div
            key="wipe"
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-volt"
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={{ clipPath: 'inset(0 0% 0 0)' }}
            exit={{ clipPath: 'inset(0 0 0 100%)' }}
            transition={{ duration: 0.38, ease: [0.76, 0, 0.24, 1] }}
          >
            <span className="font-mono text-lg text-white sm:text-2xl">
              $ export LANG={wipe === 'pt' ? 'pt_BR' : 'en_US'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  )
}

export function useLang() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useLang precisa estar dentro de <LangProvider>')
  return ctx
}
