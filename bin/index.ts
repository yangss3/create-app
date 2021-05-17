#!/usr/bin/env node
import minimist from 'minimist'
import { prompt } from 'inquirer'
import path from 'path'
import fs from 'fs-extra'

const argv = minimist(process.argv.slice(2))
const cwd = process.cwd()
const TEMPLATES = ['base', 'pc', 'mobile']
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
      await fs.remove(dist)
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
  for (const file of files.filter((f) => f !== 'package.json')) {
    renameFiles[file]
      ? fs.copySync(path.join(templateDir, file), path.join(dist, renameFiles[file]))
      : fs.copySync(path.join(templateDir, file), path.join(dist, file))
  }

  const pkg = await fs.readJson(path.join(templateDir, 'package.json'))
  pkg.name = path.basename(dist)
  await fs.outputJson(path.join(dist, 'package.json'), pkg, { spaces: 2 })

  const pkgManager = /yarn/.test(process.env.npm_execpath!) ? 'yarn' : 'npm'

  console.log('\nDone. Now run:\n')
  if (dist !== cwd) {
    console.log(`  cd ${path.relative(cwd, dist)}`)
  }
  console.log(`  ${pkgManager === 'yarn' ? 'yarn' : 'npm install'}`)
  console.log(`  ${pkgManager === 'yarn' ? 'yarn dev' : 'npm run dev'}`)
  console.log()
}


init().catch((e) => {
  console.error(e)
})
