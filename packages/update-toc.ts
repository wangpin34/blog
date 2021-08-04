import { encode } from 'js-base64'
import { performJSON, HTTP } from './api'

interface FileBody {
  content: string
  message: string
  sha?: string
}

export default async function updateTOC(content: string) {
  let body: FileBody = {content: encode(content), message: 'update toc'}
  try {
    const fetchTocResp = await performJSON(HTTP.Method.GET, `/repos/${process.env.GITHUB_REPOSITORY}/contents/table-of-contents.md`)
    if (fetchTocResp.status != 404) {
      const json = await fetchTocResp.json()
      body.sha = json.sha
    }
    const resp = await performJSON(HTTP.Method.PUT, `/repos/${process.env.GITHUB_REPOSITORY}/contents/table-of-contents.md`, {body: JSON.stringify(body) })
    console.log(resp)
    return resp
  } catch (err) {
    throw err
  }
}

if (process.argv[1] === __filename) {
  (async () => {
    const resp = await updateTOC('123456')
    console.log(resp)
  })()
}