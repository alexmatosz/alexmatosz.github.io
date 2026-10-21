import { MotionConfig } from 'motion/react'
import { lazy, Suspense, useEffect, useLayoutEffect } from 'react'
import { ChannelMarquee } from '@/components/Channels'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Terminal } from '@/components/Terminal'
import { WhatsappFab } from '@/components/WhatsappFab'
import { LangProvider } from '@/i18n'
import { useGuideRoute } from '@/lib/route'

// a página de guia só é baixada quando alguém abre um guia; a home não paga por ela
const GuidePage = lazy(() => import('@/components/GuidePage').then((m) => ({ default: m.GuidePage })))
// o resto da home chega logo depois do topo, que aparece sem esperar por ele
const HomeSections = lazy(() => import('@/components/HomeSections'))

export default function App() {
  const guide = useGuideRoute()

  // troca de página: o guia abre no topo e, voltando por um link de seção ("#services"), a home vai direto até ela.
  // instant porque o html tem scroll-behavior smooth, e rolar a página inteira devagar parecia que nada tinha aberto
  useLayoutEffect(() => {
    if (guide) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }
    const id = window.location.hash.slice(1)
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'instant' })
  }, [guide])

  useEffect(() => {
    // easter egg para quem abre o DevTools
    console.log(
      '%c~/alexsandro %c$ achou o console? então já sabe onde me encontrar: alexmatos0620@gmail.com',
      'color:#2f6bff;font-weight:bold;font-family:monospace',
      'color:#e6ecff;font-family:monospace',
    )
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <LangProvider>
        <a
          href="#about"
          className="sr-only z-[60] rounded-md bg-volt px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Pular para o conteúdo
        </a>
        <Header />
        {guide ? (
          <Suspense fallback={<main className="min-h-svh" />}>
            <GuidePage slug={guide} />
          </Suspense>
        ) : (
          <main>
            <Hero />
            <ChannelMarquee />
            <Suspense fallback={<div className="min-h-svh" />}>
              <HomeSections />
            </Suspense>
          </main>
        )}
        <Footer />
        <WhatsappFab />
        <Terminal />
      </LangProvider>
    </MotionConfig>
  )
}
