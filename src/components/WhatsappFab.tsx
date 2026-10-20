import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useState } from 'react'
import { WhatsappIcon } from '@/components/icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { contact } from '@/content'
import { useLang } from '@/i18n'

/** Botão fixo de WhatsApp; aparece depois que a pessoa começa a rolar. */
export function WhatsappFab() {
  const { t } = useLang()
  const { scrollY } = useScroll()
  const [visible, setVisible] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => setVisible(y > 300))

  return (
    <motion.div
      className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6"
      initial={false}
      animate={visible ? { scale: 1, opacity: 1 } : { scale: 0.4, opacity: 0 }}
      transition={{ type: 'spring', bounce: 0.4, duration: 0.5 }}
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
    >
      <Tooltip>
        <TooltipTrigger
          render={
            <a
              href={contact.whatsapp}
              target="_blank"
              rel="noreferrer"
              aria-label={t.fab}
              tabIndex={visible ? 0 : -1}
              className="group relative grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_12px_40px_-8px_rgba(37,211,102,0.6)] transition-transform hover:scale-110"
            />
          }
        >
          <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-25 [animation-duration:2.4s]" />
          <WhatsappIcon className="relative size-7" />
        </TooltipTrigger>
        <TooltipContent side="left" className="font-mono">
          {t.fab}
        </TooltipContent>
      </Tooltip>
    </motion.div>
  )
}
