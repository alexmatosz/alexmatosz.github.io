import { MotionConfig } from 'motion/react'
import { useEffect } from 'react'
import { About } from '@/components/About'
import { Calculator } from '@/components/Calculator'
import { Activity } from '@/components/Activity'
import { ChannelMarquee } from '@/components/Channels'
import { Contact } from '@/components/Contact'
import { Experience } from '@/components/Experience'
import { Footer } from '@/components/Footer'
import { GuidePage } from '@/components/GuidePage'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Projects } from '@/components/Projects'
import { Services } from '@/components/Services'
import { Skills } from '@/components/Skills'
import { Terminal } from '@/components/Terminal'
import { WhatsappFab } from '@/components/WhatsappFab'
import { TooltipProvider } from '@/components/ui/tooltip'
import { LangProvider } from '@/i18n'
import { useGuideRoute } from '@/lib/route'

export default function App() {
  const guide = useGuideRoute()

  // voltando de um guia por um link de seção ("#services"), rola até ela depois que a home monta
  useEffect(() => {
    if (guide) return
    const id = window.location.hash.slice(1)
    if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView())
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
        <TooltipProvider>
          <a
            href="#about"
            className="sr-only z-[60] rounded-md bg-volt px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
          >
            Pular para o conteúdo
          </a>
          <Header />
          {guide ? (
            <GuidePage slug={guide} />
          ) : (
            <main>
              <Hero />
              <ChannelMarquee />
              <About />
              <Experience />
              <Projects />
              <Services />
              <Skills />
              <Activity />
              <Calculator />
              <Contact />
            </main>
          )}
          <Footer />
          <WhatsappFab />
          <Terminal />
        </TooltipProvider>
      </LangProvider>
    </MotionConfig>
  )
}
