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
const renameRootFiles: Record<string, string> = {
  _gitignore: '.gitignore'
}
const templates = ['web', 'pc', 'mobile', 'vanilla'] as const
const pcUiLibs = [
  { name: 'Ant Design Vue', value: 'antdv' }
] as const
const mobileUiLibs = [
  { name: 'Vant', value: 'vant' }
] as const

type Template = typeof templates[number]
type PcUiLib = typeof pcUiLibs[number]['value']
type MobileUiLib = typeof mobileUiLibs[number]['value']

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

  const dest = path.resolve(cwd, targetDir)

  if (fs.existsSync(dest)) {
    const { yes } = await prompt({
      type: 'confirm',
      name: 'yes',
      message: `Target directory ${targetDir} is not empty.\n` +
      'Remove existing files and continue?',
      default: true
    })
    if (yes) {
      spinner.start('Removing...')
      await fs.remove(dest)
      spinner.succeed('Removed')
    } else {
      return
    }
  }

  let template: Template = argv.t || argv.template
  let message = 'Select a template:'
  let isValidTemplate = false

  if (typeof template === 'string') {
    isValidTemplate = templates.includes(template)
    message = `${template} isn't a valid template. Please choose from below:`
  }

  if (!template || !isValidTemplate) {
    const { t } = await prompt({
      type: 'list',
      name: 't',
      message,
      choices: templates
    })
    template = t
  }

  let uiLib: PcUiLib | MobileUiLib | undefined
  if (template === 'pc') {
    const { ui } = await prompt({
      type: 'list',
      name: 'ui',
      message: 'Select an UI library:',
      choices: pcUiLibs
    })
    uiLib = ui
  }

  generateTemplate(dest, template, uiLib)

  spinner.start('Install deps...')
  const installOpt = await exec(`cd ${dest} && npm install`)
  spinner.succeed('Install deps completed')
  console.log(installOpt.stdout)

  const initGitRepo = [
    `cd ${dest}`,
    'npm install @yangss/init-git-repo -D',
    'npx init-git-repo'
  ]
  spinner.start('Initialize git repo...')
  const initOpt = await exec(initGitRepo.join('&&'))
  spinner.succeed('Initialize git repo completed')
  console.log(initOpt.stdout)

  const pkgJsonPath = path.join(dest, 'package.json')
  const pkgJson = fs.readJsonSync(pkgJsonPath)
  pkgJson.name = path.basename(dest)
  pkgJson['lint-staged'] = template === 'vanilla'
    ? { '*.(ts|js)': 'eslint --fix' }
    : { '*.(ts|tsx|vue)': 'eslint --fix' }
  fs.outputJsonSync(pkgJsonPath, pkgJson, { spaces: 2 })

  if (template === 'vanilla') {
    console.log('\nDone.')
    console.log()
  } else {
    console.log('\nDone. Now run:\n')
    if (dest !== cwd) {
      console.log(` cd ${path.relative(cwd, dest)}`)
    }
    console.log(' npm run dev')
    console.log()
  }
}

function generateTemplate<T extends Template> (
  dest: string,
  template: T,
  uiLib: T extends 'pc'
    ? PcUiLib
    : T extends 'mobile'
      ? MobileUiLib
      : undefined
) {
  const templateDir = path.resolve(__dirname, `../templates/${template}`)

  const files = fs.readdirSync(templateDir)
  for (const file of files) {
    const templateRootFile = path.join(templateDir, file)
    renameRootFiles[file]
      ? fs.copySync(templateRootFile, path.join(dest, renameRootFiles[file]))
      : fs.copySync(templateRootFile, path.join(dest, file))
  }

  const renameSrcFiles = (dir: string, files: string[]) => {
    const regex = /^.+(?<lib>\..+)\..+$/
    for (const file of files) {
      const oldFile = path.join(dir, file)
      const matched = regex.exec(file)
      if (matched) {
        if (matched.groups?.lib?.slice(1) === uiLib) {
          fs.renameSync(
            oldFile,
            path.join(dir, file.replace(matched.groups?.lib, ''))
          )
        } else {
          fs.unlinkSync(oldFile)
        }
      }
    }
  }

  if (template === 'pc') {
    const destSrcPath = path.join(dest, 'src')
    const destSrcViewPath = path.join(dest, 'src/views')
    renameSrcFiles(destSrcPath, fs.readdirSync(destSrcPath))
    renameSrcFiles(destSrcViewPath, fs.readdirSync(destSrcViewPath))
  }
}


init().catch((e) => {
  console.error(e)
})
