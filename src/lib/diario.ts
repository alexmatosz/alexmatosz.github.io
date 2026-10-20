import { useEffect, useState } from 'react'
import { DIARIO_CSV_URL } from '@/config'
import salvas from '@/data/diario.json'

export type Entrada = { data: string; titulo: string; texto: string; tag: string; link: string; imagem: string }
type Estado = { entradas: Entrada[]; status: 'carregando' | 'ok' | 'erro' }

/** CSV simples com aspas (formato que o Google Sheets publica). */
export function parseCsv(texto: string): string[][] {
  const linhas: string[][] = []
  let linha: string[] = []
  let campo = ''
  let aspas = false
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i]
    if (aspas) {
      if (c === '"' && texto[i + 1] === '"') {
        campo += '"'
        i++
      } else if (c === '"') aspas = false
      else campo += c
    } else if (c === '"') aspas = true
    else if (c === ',') {
      linha.push(campo)
      campo = ''
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && texto[i + 1] === '\n') i++
      linha.push(campo)
      linhas.push(linha)
      linha = []
      campo = ''
    } else campo += c
  }
  if (campo || linha.length) {
    linha.push(campo)
    linhas.push(linha)
  }
  return linhas
}

/** Aceita 2026-10-20 ou 20/10/2026; devolve sempre AAAA-MM-DD. */
function normalizarData(d: string) {
  const br = d.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (br) return `${br[3]}-${br[2].padStart(2, '0')}-${br[1].padStart(2, '0')}`
  return d.trim().slice(0, 10)
}

// só aceita links http(s) da planilha
const url = (v: string | undefined) => (/^https?:\/\//i.test((v ?? '').trim()) ? (v ?? '').trim() : '')

function paraEntradas(linhas: string[][]): Entrada[] {
  const [cabecalho, ...resto] = linhas
  const col = (nome: string) => cabecalho.findIndex((h) => h.trim().toLowerCase() === nome)
  const idx = { data: col('data'), titulo: col('titulo'), texto: col('texto'), tag: col('tag'), link: col('link'), imagem: col('imagem') }
  return resto
    .map((l) => ({
      data: normalizarData(l[idx.data] ?? ''),
      titulo: (l[idx.titulo] ?? '').trim(),
      texto: (l[idx.texto] ?? '').trim(),
      tag: (l[idx.tag] ?? '').trim(),
      link: url(l[idx.link]),
      imagem: url(l[idx.imagem]),
    }))
    .filter((e) => e.titulo && /^\d{4}-\d{2}-\d{2}$/.test(e.data))
}

const ordenar = (e: Entrada[]) => [...e].sort((a, b) => b.data.localeCompare(a.data))

/** Lê o diário da planilha publicada; se falhar, usa as entradas salvas no repositório. */
export function useDiario(): Estado {
  const [estado, setEstado] = useState<Estado>(
    // começa já com as entradas salvas; a planilha substitui quando responder
    () => ({ entradas: ordenar(salvas), status: 'ok' }),
  )

  useEffect(() => {
    if (!DIARIO_CSV_URL) return
    const ctrl = new AbortController()
    fetch(DIARIO_CSV_URL, { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.text()
      })
      .then((csv) => {
        const entradas = paraEntradas(parseCsv(csv))
        if (entradas.length) setEstado({ entradas: ordenar(entradas), status: 'ok' })
      })
      .catch((err) => {
        // planilha fora do ar ou não compartilhada: segue com as entradas salvas
        if (err.name !== 'AbortError') console.warn('Diário: usando entradas salvas.', err)
      })
    return () => ctrl.abort()
  }, [])

  return estado
}
