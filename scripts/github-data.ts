// Busca o calendário de contribuições e os repositórios públicos do GitHub
// e salva em src/data/github.json (o site lê esse arquivo no build).
// Uso: npm run github   (token: GITHUB_TOKEN ou o login do `gh` CLI)
import { execSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'

const LOGIN = 'alexmatosz'
const OUT = 'src/data/github.json'

function token() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN
  try {
    return execSync('gh auth token', { encoding: 'utf8' }).trim()
  } catch {
    throw new Error('Defina GITHUB_TOKEN ou faça login com `gh auth login`.')
  }
}

const query = `query($login: String!) {
  user(login: $login) {
    login
    avatarUrl
    followers { totalCount }
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
    repositories(first: 12, privacy: PUBLIC, isFork: false, ownerAffiliations: OWNER, orderBy: { field: PUSHED_AT, direction: DESC }) {
      totalCount
      nodes { name description url stargazerCount pushedAt primaryLanguage { name color } }
    }
  }
}`

const LEVELS: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
}

const res = await fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: { Authorization: `bearer ${token()}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ query, variables: { login: LOGIN } }),
})
const json = await res.json()
if (!res.ok || json.errors) throw new Error(JSON.stringify(json.errors ?? json))

const u = json.data.user
const cal = u.contributionsCollection.contributionCalendar

type Day = { date: string; contributionCount: number; contributionLevel: string }
type Repo = {
  name: string
  description: string | null
  url: string
  stargazerCount: number
  pushedAt: string
  primaryLanguage: { name: string; color: string } | null
}

const data = {
  login: u.login,
  avatarUrl: u.avatarUrl,
  followers: u.followers.totalCount,
  publicRepos: u.repositories.totalCount,
  totalContributions: cal.totalContributions,
  // semanas de domingo a sábado; cada dia vira [data, quantidade, nível 0-4]
  weeks: cal.weeks.map((w: { contributionDays: Day[] }) =>
    w.contributionDays.map((d) => [d.date, d.contributionCount, LEVELS[d.contributionLevel] ?? 0]),
  ),
  repos: (u.repositories.nodes as Repo[])
    .filter((r) => r.name.toLowerCase() !== `${LOGIN}.github.io`)
    .slice(0, 6)
    .map((r) => ({
      name: r.name,
      description: r.description,
      url: r.url,
      stars: r.stargazerCount,
      pushedAt: r.pushedAt,
      language: r.primaryLanguage?.name ?? null,
      languageColor: r.primaryLanguage?.color ?? null,
    })),
  updatedAt: new Date().toISOString(),
}

writeFileSync(OUT, JSON.stringify(data) + '\n')
console.log(`✓ ${OUT}: ${data.totalContributions} contribuições, ${data.repos.length} repositórios`)
