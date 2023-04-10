import path from 'path'
import fs from 'fs/promises'
import yargs from 'yargs'
import getIssues from './get-issues'
import Renderer from './toc-renderer'
import updateOrCreateFile from './update-toc'
import createOrUpdateMD from './md'
import logger from './logger'

require('dotenv').config()

async function updateToc() {
  try {
    const readmeTemplate = await fs.readFile(path.resolve('./readme.template.md'), 'utf-8')
    const tocTemplate = await fs.readFile(path.resolve('./toc.template.md'), 'utf-8')
    const readmeRenderer = new Renderer(readmeTemplate)
    const tocRenderer = new Renderer(tocTemplate)

    const issues = await getIssues()
    logger.info(`${issues.length} issue(s) found`)

    const articles = issues.map(issue => ({title: issue.title, url: issue.html_url}))
    await updateOrCreateFile('README.md', readmeRenderer.render({articles}), 'update readme')
    await updateOrCreateFile('table-of-contents.md', tocRenderer.render({articles}), 'update toc')
  } catch (err) {
    throw err
  }
}

async function updatePosts() {
    try {
    const issues = await getIssues()
    logger.info(`${issues.length} issue(s) found`)

    await Promise.all(issues.map(issue => {
      const title = issue.title
      const labels = issue.labels.map(label => label.name)
      const markdown =
`
---
title: ${title}
tags: ${labels.join(',')}
---
${issue.body}
`
      return createOrUpdateMD(`posts/${title.replaceAll(/\//ig, '-')}.md`, markdown, 'auto sync')
    }))
  } catch (err) {
    throw err
  }
}


yargs(process.argv.slice(2))
  .command('update-toc',  'Update Toc', () => {}, async () => {
    try {
      await updateToc()
    } catch(err) {
      logger.error((err as Error).message)
    }
  })
  .command('update-posts',  'Covert issues to posts as markdown', () => {}, async () => {
    try {
      await updatePosts()
    } catch(err) {
      logger.error((err as Error).message)
    }
  })
  .demandCommand()
  .help().argv 