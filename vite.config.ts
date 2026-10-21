import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

// As fontes só seriam descobertas depois que o JS desenhasse o texto na tela.
// Com o preload no HTML, o navegador baixa as duas (só o subset latin) junto com o CSS.
function preloadFonts(): Plugin {
  return {
    name: 'preload-fonts',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        return Object.keys(ctx.bundle ?? {})
          .filter((f) => /(bricolage-grotesque|jetbrains-mono)-latin-wght-normal-.*\.woff2$/.test(f))
          .map((f) => ({
            tag: 'link',
            attrs: { rel: 'preload', href: `./${f}`, as: 'font', type: 'font/woff2', crossorigin: '' },
            injectTo: 'head' as const,
          }))
      },
    },
  }
}

// base relativa: funciona no GitHub Pages (raiz ou subpasta)
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), preloadFonts()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
