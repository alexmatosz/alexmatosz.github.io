import { useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type Props = { command: string; intro?: string; className?: string }

/** Título de seção em forma de comando, digitado quando entra na tela. */
export function SectionTitle({ command, intro, className }: Props) {
  const ref = useRef<HTMLHeadingElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const reduce = useReducedMotion()
  const [typed, setTyped] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduce) return setTyped(command.length)
    setTyped(0)
    const id = window.setInterval(() => {
      setTyped((n) => {
        if (n >= command.length) {
          window.clearInterval(id)
          return n
        }
        return n + 1
      })
    }, 38)
    return () => window.clearInterval(id)
  }, [inView, command, reduce])

  const done = typed >= command.length

  return (
    <div className={cn('mb-12 max-w-3xl md:mb-16', className)}>
      <h2
        ref={ref}
        aria-label={command}
        className="font-mono text-2xl font-medium tracking-tight text-paper sm:text-4xl"
      >
        <span aria-hidden className="text-volt">
          ~${' '}
        </span>
        <span aria-hidden className={cn(!done && 'caret')}>
          {command.slice(0, typed)}
        </span>
      </h2>
      {intro && (
        <p
          className={cn(
            'mt-4 text-lg text-dim transition-opacity duration-500',
            done ? 'opacity-100' : 'opacity-0',
          )}
        >
          {intro}
        </p>
      )}
    </div>
  )
}
