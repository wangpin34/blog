import path from 'path'
import fs from 'fs/promises'
import getIssues from './get-issues'
import Renderer from './toc-renderer'
import updateOrCreateFile from './update-toc'

async function Start() {
  try {
    const readmeTemplate = await fs.readFile(path.join(__dirname, 'readme.template.md'), 'utf-8')
    const tocTemplate = await fs.readFile(path.join(__dirname, 'toc.template.md'), 'utf-8')
    const readmeRenderer = new Renderer(readmeTemplate)
    const tocRenderer = new Renderer(tocTemplate)

    const issues = await getIssues()
    console.log(issues)
    const articles = issues.map(issue => ({title: issue.title, url: issue.html_url}))
    
    await updateOrCreateFile('README.md', readmeRenderer.render({articles}), 'update readme')
    await updateOrCreateFile('table-of-contents.md', tocRenderer.render({articles}), 'update toc')
  } catch (err) {
    throw err
  }
}

(async () => {
  await Start()
})()