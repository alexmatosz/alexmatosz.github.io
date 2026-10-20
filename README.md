# Portfólio — Alexsandro Joaquim De Matos

Currículo online: desenvolvedor Full Stack Jr. em e-commerce e automação.

**Stack:** React, Vite, TypeScript, Tailwind CSS v4, shadcn/ui, Motion.

## Rodar localmente

```bash
npm install
npm run dev
```

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Gera o site estático em `dist/` |
| `npm run github` | Atualiza `src/data/github.json` (calendário de commits e repositórios). Usa `GITHUB_TOKEN` ou o login do `gh` |
| `npm run cv` | Regera os PDFs do currículo (PT e EN) em `public/cv/` a partir de `src/content.ts` (precisa do Chrome) |

## Editar o conteúdo

Todo o texto do site (PT e EN) fica em `src/content.ts`. Depois de editar, rode `npm run cv` para os PDFs acompanharem.

## Deploy

O workflow `.github/workflows/deploy.yml` publica no GitHub Pages a cada push na branch `main`
(em *Settings → Pages*, escolha **Source: GitHub Actions**).

O mesmo workflow roda **todo dia às 06:00 (Brasília)**, puxa os dados novos do GitHub e republica o site.

## Diário de dev (Google Sheets)

O diário lê a planilha **"Diário de dev — portfólio"** (ID em `src/config.ts`), com as colunas
`data, titulo, texto, tag, link, imagem` (modelo em `docs/diario-modelo.csv`).

- `data`: `2026-10-20` ou `20/10/2026` · `link`: URL do post no LinkedIn (opcional) · `imagem`: URL de uma imagem (opcional).
- A planilha precisa estar em **Compartilhar → Qualquer pessoa com o link → Leitor**.
- Cada linha nova aparece no site ao recarregar a página, sem deploy.
- Se a planilha estiver inacessível, o site mostra as entradas de `src/data/diario.json`.
