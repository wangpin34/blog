import path from 'path'
import fs from 'fs/promises'
import getIssues from './get-issues'
import Renderer from './toc-renderer'
import updateTOC from './update-toc'

async function Start() {
  try {
    const template = await fs.readFile(path.join(__dirname, 'toc.template'), 'utf-8')
    const tocRenderer = new Renderer(template)
    const issues = await getIssues()
    const toc = tocRenderer.render({articles: issues.map(issue => ({title: issue.title, url: issue.html_url}))})
    await updateTOC(toc)
  } catch (err) {
    throw err
  }
}

(async () => {
  await Start()
})()