import { performJSON, HTTP } from './api'

interface Issue {
  id: string
  html_url: string
  state: 'open' | 'closed' | 'all'
  title: 'string'
  body: 'string'
  labels: Array<{
    id: number
    name: string
    description: string
    color: string
  }>
  locked: boolean
  comments: number
  created_at: string
  updated_at: string
}

export default async function getIssues() {
  try {
    const resp = await performJSON(HTTP.Method.GET, `/repos/${process.env.GITHUB_REPOSITORY}/issues`)
    const issues = await resp.json() as Array<Issue>
    return issues
  } catch (err) {
    throw err
  }
}

if (process.argv[1] === __filename) {
  (async () => {
    const issues = await getIssues()
    console.log(issues)
  })()
}