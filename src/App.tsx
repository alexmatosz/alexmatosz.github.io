import { MotionConfig } from 'motion/react'
import { useEffect } from 'react'
import { About } from '@/components/About'
import { Calculator } from '@/components/Calculator'
import { Activity } from '@/components/Activity'
import { ChannelMarquee } from '@/components/Channels'
import { Contact } from '@/components/Contact'
import { Experience } from '@/components/Experience'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Projects } from '@/components/Projects'
import { Skills } from '@/components/Skills'
import { Terminal } from '@/components/Terminal'
import { WhatsappFab } from '@/components/WhatsappFab'
import { TooltipProvider } from '@/components/ui/tooltip'
import { LangProvider } from '@/i18n'

export default function App() {
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
          <main>
            <Hero />
            <ChannelMarquee />
            <About />
            <Experience />
            <Projects />
            <Skills />
            <Activity />
            <Calculator />
            <Contact />
          </main>
          <Footer />
          <WhatsappFab />
          <Terminal />
        </TooltipProvider>
      </LangProvider>
    </MotionConfig>
  )
}
