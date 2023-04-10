import { encode } from 'js-base64'
import { performJSON, HTTP } from './api'

interface FileBody {
  content: string
  message: string
  sha?: string
}

export default async function updateOrCreateFile(path: string, content: string, message: string) {
  let body: FileBody = {content: encode(content), message}
  try {
    const fetchTocResp = await performJSON(HTTP.Method.GET, `/repos/${process.env.GITHUB_REPOSITORY}/contents/${path}`)
    if (fetchTocResp.status != 404) {
      const json = await fetchTocResp.json()
      body.sha = json.sha
    }
    const resp = await performJSON(HTTP.Method.PUT, `/repos/${process.env.GITHUB_REPOSITORY}/contents/${path}`, {body: JSON.stringify(body) })
    console.log(resp)
    return resp
  } catch (err) {
    throw err
  }
}