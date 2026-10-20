import { openTerminal } from '@/components/Terminal'
import { useLang } from '@/i18n'

const YEAR = new Date().getFullYear()

export function Footer() {
  const { t } = useLang()
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 font-mono text-xs text-dim lg:flex-row lg:items-center lg:justify-between sm:px-6">
        <p>
          <span className="text-volt">©</span> {YEAR} Alexsandro Joaquim De Matos. {t.footer.built}
        </p>
        <p>
          <span className="text-signal">exit 0</span> · {t.footer.line}
        </p>
        <button type="button" onClick={openTerminal} className="text-left text-volt hover:text-paper">
          {t.footer.hint}
        </button>
      </div>
    </footer>
  )
}
