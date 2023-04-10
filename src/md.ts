import { encode } from 'js-base64'
import { performJSON, HTTP } from './api'
import logger from './logger'

interface FileBody {
  content: string
  message: string
  sha?: string
}

export default async function createOrUpdateMD(path: string, content: string, message: string) {
  let body: FileBody = {content: encode(content), message}
  try {
    const origin = await performJSON(HTTP.Method.GET, `/repos/${process.env.GITHUB_REPOSITORY}/contents/${path}`)
    if (origin.status != 404) {
      const json = await origin.json()
      body.sha = json.sha
    }
    const resp = await performJSON(HTTP.Method.PUT, `/repos/${process.env.GITHUB_REPOSITORY}/contents/${path}`, {body: JSON.stringify(body) })
    logger.trace(resp)
    return resp
  } catch (err) {
    throw err
  }
}