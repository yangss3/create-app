#!/usr/bin/env node
import minimist from 'minimist'
import { prompt } from 'inquirer'
import path from 'path'
import fs from 'fs-extra'
import { exec as execCb } from 'child_process'
import { promisify } from 'util'
import ora from 'ora'

const spinner = ora()
const exec = promisify(execCb)
const argv = minimist(process.argv.slice(2))
const cwd = process.cwd()
const TEMPLATES = ['web', 'pc', 'mobile', 'vanilla']
const renameFiles: Record<string, string> = {
  _gitignore: '.gitignore'
}

async function init () {
  let targetDir = argv._[0]

  if (!targetDir) {
    const { name } = await prompt({
      type: 'input',
      name: 'name',
      message: 'Project name:',
      default: 'my-project'
    })
    targetDir = name
  }

  const dist = path.resolve(cwd, targetDir)

  if (fs.existsSync(dist)) {
    const { yes } = await prompt({
      type: 'confirm',
      name: 'yes',
      message: `Target directory ${targetDir} is not empty.\n` +
      'Remove existing files and continue?',
      default: true
    })
    if (yes) {
      spinner.start('Removing...')
      await fs.remove(dist)
      spinner.succeed('Removed')
    } else {
      return
    }
  }

  let template: string = argv.t || argv.template
  let message = 'Select a template:'
  let isValidTemplate = false

  if (typeof template === 'string') {
    isValidTemplate = TEMPLATES.includes(template)
    message = `${template} isn't a valid template. Please choose from below:`
  }

  if (!template || !isValidTemplate) {
    const { t } = await prompt({
      type: 'list',
      name: 't',
      message,
      choices: TEMPLATES
    })
    template = t
  }

  const templateDir = path.resolve(__dirname, `../templates/${template}`)

  const files = fs.readdirSync(templateDir)
  for (const file of files) {
    renameFiles[file]
      ? fs.copySync(path.join(templateDir, file), path.join(dist, renameFiles[file]))
      : fs.copySync(path.join(templateDir, file), path.join(dist, file))
  }

  spinner.start('Install deps...')
  const installOpt = await exec(`cd ${dist} && npm install`)
  spinner.succeed('Install deps completed')
  console.log(installOpt.stdout)

  const initGitRepo = [
    `cd ${dist}`,
    'git init',
    'npx mrm@2 lint-staged',
    'npx husky add .husky/commit-msg "node ./scripts/validate-commit-msg.js"'
  ]
  spinner.start('Initialize git repo...')
  const initOpt = await exec(initGitRepo.join('&&'))
  spinner.succeed('Initialize git repo completed')
  console.log(initOpt.stdout)

  const pkgJsonPath = path.join(dist, 'package.json')
  const pkgJson = fs.readJsonSync(pkgJsonPath)
  pkgJson.name = path.basename(dist)
  pkgJson['lint-staged'] = template === 'vanilla'
    ? { '*.(ts|js)': 'eslint --fix' }
    : { '*.(ts|tsx|vue)': 'eslint --fix' }
  fs.outputJsonSync(pkgJsonPath, pkgJson, { spaces: 2 })
  fs.rmSync(path.resolve(dist, '6'))

  if (template === 'vanilla') {
    console.log('\nDone.')
    console.log()
  } else {
    console.log('\nDone. Now run:\n')
    if (dist !== cwd) {
      console.log(` cd ${path.relative(cwd, dist)}`)
    }
    console.log(' npm run dev')
    console.log()
  }
}

init().catch((e) => {
  console.error(e)
})
