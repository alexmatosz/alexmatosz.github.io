import { useEffect, useState } from 'react'

// Rotas por hash ("#/guia/mercado-livre") funcionam no GitHub Pages sem servidor.
// Hashes sem barra ("#about") continuam sendo âncoras de seção da home.
const GUIDE_PREFIX = '#/guia/'

export const guideHref = (slug: string) => `${GUIDE_PREFIX}${slug}`

function read(): string | null {
  const h = window.location.hash
  return h.startsWith(GUIDE_PREFIX) ? decodeURIComponent(h.slice(GUIDE_PREFIX.length)) : null
}

/** Slug do guia aberto, ou null quando a pessoa está na home. */
export function useGuideRoute() {
  const [slug, setSlug] = useState(read)

  useEffect(() => {
    const onChange = () => {
      const next = read()
      setSlug((prev) => {
        if (next && next !== prev) window.scrollTo({ top: 0 })
        return next
      })
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return slug
}
