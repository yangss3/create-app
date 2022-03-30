#!/usr/bin/env node
import minimist from 'minimist'
import inquirer from 'inquirer'
import path from 'path'
import fs from 'fs-extra'
import { exec as execCb } from 'child_process'
import { promisify } from 'util'
import ora from 'ora'


const { prompt } = inquirer
const spinner = ora()
const exec = promisify(execCb)
const argv = minimist(process.argv.slice(2))
const cwd = process.cwd()

const renameRootFiles: Record<string, string> = {
  _gitignore: '.gitignore'
}

const pcRenameFiles = [
  { dir: 'src', regex: /^(?<uiLib>.+\.)App\.vue$/ },
  { dir: 'src/views', regex: /^(?<uiLib>.+\.)Home\.vue$/ }
]

const templates = ['web', 'pc', 'mobile', 'blog', 'node'] as const

const pcUiLibs = [
  { name: 'Ant Design Vue', value: 'antdv' },
  { name: 'Element Plus', value: 'element' }
] as const

const mobileUiLibs = [
  { name: 'Vant', value: 'vant' }
] as const

const uiLibs = {
  antdv: {
    name: 'ant-design-vue',
    version: '^3.1.0-rc.4',
    resolver: 'AntDesignVueResolver'
  },
  element: {
    name: 'element-plus',
    version: '^2.1.5',
    resolver: 'ElementPlusResolver'
  },
  vant: {
    name: 'vant',
    version: '^3.4.6',
    resolver: 'VantResolver'
  }
} as const

const agentCli = {
  pnpm: {
    install: 'pnpm install',
    add: 'pnpm add',
    run: 'pnpm',
    exec: 'pnpm exec',
    publish: 'pnpm publish'
  },
  yarn: {
    install: 'yarn install',
    add: 'yarn add',
    run: 'yarn run',
    exec: 'yarn exec',
    publish: 'yarn publish'
  },
  npm: {
    install: 'npm install',
    add: 'npm install',
    run: 'npm run',
    exec: 'npx',
    publish: 'npm publish'
  }
} as const

type Template = typeof templates[number]
type PcUiLib = typeof pcUiLibs[number]['value']
type MobileUiLib = typeof mobileUiLibs[number]['value']

const isWebApp = (template: Template) => ['web', 'pc', 'mobile'].includes(template)
const isNodeApp = (template: Template) => template === 'node'
const isPcApp = (template: Template) => template === 'pc'

let targetDir = argv._[0]
let template: Template = argv.t || argv.template
const lint: boolean = argv.l || argv.lint
let lintOptions: string[] = []
let uiLib: PcUiLib | MobileUiLib | undefined

const agent = agentCli[await getAgent()]

async function run() {

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
      message: `Target directory ${targetDir} is not empty.\n`
      + 'Remove existing files and continue?',
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

  if (isPcApp(template)) {
    const { ui } = await prompt({
      type: 'list',
      name: 'ui',
      message: 'Select an UI library:',
      choices: pcUiLibs
    })
    uiLib = ui
  }


  if (lint) {
    lintOptions = ['lint-staged', 'lint-msg']
  } else {
    const { yes } = await prompt({
      type: 'confirm',
      name: 'yes',
      message: 'Integrate linting?',
      default: false
    })
    if (yes) {
      const { opts } = await prompt({
        type: 'checkbox',
        name: 'opts',
        message: 'Choose linting types:',
        choices: [
          { name: 'Lint staged files', value: 'lint-staged' },
          { name: 'Lint commit message', value: 'lint-msg' }
        ]
      })
      lintOptions = opts
    }
  }

  generateTemplate(dest)

  if (isNodeApp(template)) {
    console.log('\nDone.')
    console.log()
  } else {
    console.log('\nDone. Now run:\n')
    if (dest !== cwd) {
      console.log(` cd ${path.relative(cwd, dest)}`)
    }
    console.log(` ${agent.install}`)
    console.log(` ${agent.run} dev`)
    console.log()
  }
}


function copyFiles(dest: string) {
  const templateDir = path.resolve(__dirname, `../templates/${template}`)
  const files = fs.readdirSync(templateDir)
  for (const file of files) {
    const templateRootFile = path.join(templateDir, file)
    renameRootFiles[file]
      ? fs.copySync(templateRootFile, path.join(dest, renameRootFiles[file]))
      : fs.copySync(templateRootFile, path.join(dest, file))
  }
}

function renameFiles(dest: string) {
  pcRenameFiles.forEach(({ dir, regex }) => {
    const dirPath = path.join(dest, dir)
    const dirFiles = fs.readdirSync(dirPath)
    for (const file of dirFiles) {
      const matched = regex.exec(file)
      if (matched) {
        const oldFile = path.join(dirPath, file)
        if (matched.groups?.uiLib === uiLib + '.') {
          fs.renameSync(
            oldFile,
            path.join(dirPath, file.replace(matched.groups?.uiLib || '', ''))
          )
        } else {
          fs.unlinkSync(oldFile)
        }
      }
    }
  })
}


function generateTemplate(dest: string) {
  copyFiles(dest)

  if (isPcApp(template)) {
    renameFiles(dest)
  }

  const pkgJsonPath = path.join(dest, 'package.json')
  const pkgJson = fs.readJsonSync(pkgJsonPath)

  if (!lintOptions.length) {
    fs.removeSync(path.join(dest, '.husky'))
    delete pkgJson.devDependencies['@yangss/lint-msg']
    delete pkgJson.devDependencies['husky']
    delete pkgJson.devDependencies['lint-staged']
    delete pkgJson['lint-staged']
    delete pkgJson.scripts.prepare
  } else if (lintOptions.length === 1) {
    if (lintOptions[0] === 'lint-staged') {
      fs.unlinkSync(path.join(dest, '.husky/commit-msg'))
      delete pkgJson.devDependencies['@yangss/lint-msg']
    } else if (lintOptions[0] === 'lint-msg') {
      fs.unlinkSync(path.join(dest, '.husky/pre-commit'))
      delete pkgJson.devDependencies['lint-staged']
      delete pkgJson['lint-staged']
    }
  }

  if (isNodeApp(template)) {
    pkgJson.scripts.release = `${agent.run} build && bumpp --tag --push --no-verify && ${agent.publish}`
  }

  if (uiLib) {
    const viteConfigPath = path.join(dest, 'vite.config.ts')
    const viteConfig = fs.readFileSync(viteConfigPath, 'utf-8')
    fs.writeFileSync(
      viteConfigPath,
      viteConfig
        .replace(
          /import +Components +from +['"]unplugin-vue-components\/vite['"]/,
          [
            'import Components from \'unplugin-vue-components/vite\'',
            `import { ${uiLibs[uiLib].resolver} } from 'unplugin-vue-components/resolvers'`
          ].join('\n')
        )
        .replace(
          /\/\/ *componentResolver/,
          `${uiLibs[uiLib].resolver}(),`
        )
    )
    pkgJson.dependencies[uiLibs[uiLib].name] = uiLibs[uiLib].version
    if (uiLib === 'element')
      pkgJson.devDependencies.sass = '^1.35.2'
  }

  pkgJson.name = targetDir

  fs.outputJsonSync(pkgJsonPath, pkgJson, { spaces: 2 })

  if (isWebApp(template)) {
    const indexHtmlPath = path.join(dest, 'index.html')
    const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8')
    fs.writeFileSync(
      indexHtmlPath,
      indexHtml.replace('<!--app-title-->', path.basename(dest))
    )
  }
}

async function getAgent() {
  try {
    await exec('pnpm --version')
    return 'pnpm'
  } catch (error) {
    try {
      await exec('yarn --version')
      return 'yarn'
    } catch (error) {
      return 'npm'
    }
  }
}


run().catch((e) => {
  console.error(e)
  process.exit(1)
})
