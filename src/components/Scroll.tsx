import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ImageProps = { src: string; alt: string; className?: string; width?: number; height?: number }

/** Foto que desliza dentro da moldura conforme a página rola (parallax). */
export function ParallaxImage({ className, ...img }: ImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <div ref={ref} className="overflow-hidden">
      {/* ampliada o bastante para o deslize nunca mostrar a borda */}
      <motion.img {...img} loading="lazy" style={reduce ? undefined : { y, scale: 1.18 }} className={className} />
    </div>
  )
}

/** Bloco que chega inclinado e se endireita enquanto entra na tela; volta a inclinar rolando para cima. */
export function ScrollTilt({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 55%'] })
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 24, restDelta: 0.001 })
  const rotateX = useTransform(p, [0, 1], [14, 0])
  const scale = useTransform(p, [0, 1], [0.92, 1])
  const opacity = useTransform(p, [0, 1], [0.3, 1])

  return (
    <div ref={ref} className={cn('[perspective:1400px]', className)}>
      <motion.div style={reduce ? undefined : { rotateX, scale, opacity, transformOrigin: '50% 100%' }} className="h-full">
        {children}
      </motion.div>
    </div>
  )
}
