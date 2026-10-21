import { useLayoutEffect } from 'react'
import { About } from '@/components/About'
import { Activity } from '@/components/Activity'
import { Calculator } from '@/components/Calculator'
import { Contact } from '@/components/Contact'
import { Experience } from '@/components/Experience'
import { Projects } from '@/components/Projects'
import { Services } from '@/components/Services'
import { Skills } from '@/components/Skills'

/** Tudo o que fica abaixo do topo. Vem num arquivo à parte para o topo aparecer sem esperar o resto da página. */
export default function HomeSections() {
  // um link de seção ("#services") abre antes destas seções existirem: rola até ela quando chegam
  useLayoutEffect(() => {
    const id = window.location.hash.slice(1)
    if (id && !id.startsWith('/')) document.getElementById(id)?.scrollIntoView({ behavior: 'instant' })
  }, [])

  return (
    <>
      <About />
      <Experience />
      <Projects />
      <Services />
      <Skills />
      <Activity />
      <Calculator />
      <Contact />
    </>
  )
}
