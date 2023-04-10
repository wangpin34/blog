import { performJSON, HTTP } from './api'
import qs from 'qs'

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
  let issues: Array<Issue> = []
  let hasNext = true
  const perPage = 30
  const queryGen = ((perPage: number) => {
      let page = 1
      return {
        next: () => qs.stringify({
          per_page: perPage,
          page: page++
        })
      }
    })(perPage)

  try {
    do {
      const resp = await performJSON(HTTP.Method.GET, `/repos/${process.env.GITHUB_REPOSITORY}/issues?${queryGen.next()}`)
      const _issues = await resp.json() as Array<Issue>
      if (_issues.length < perPage ) {
        hasNext = false
      }
      issues = [...issues, ..._issues]
    } while(hasNext)
    
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