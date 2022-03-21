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
    version: '^2.2.7',
    resolver: 'AntDesignVueResolver'
  },
  element: {
    name: 'element-plus',
    version: '^1.1.0-beta.7',
    resolver: 'ElementPlusResolver'
  },
  vant: {
    name: 'vant',
    version: '^3.1.5',
    resolver: 'VantResolver'
  }
} as const

const agentCli = {
  pnpm: {
    install: 'pnpm install',
    add: 'pnpm add',
    run: 'pnpm',
    exec: 'pnpm exec'
  },
  yarn: {
    install: 'yarn install',
    add: 'yarn add',
    run: 'yarn run',
    exec: 'yarn exec'
  },
  npm: {
    install: 'npm install',
    add: 'npm install',
    run: 'npm run',
    exec: 'npx'
  }
} as const

type Template = typeof templates[number]
type PcUiLib = typeof pcUiLibs[number]['value']
type MobileUiLib = typeof mobileUiLibs[number]['value']

const isWebApp = (template: Template) => ['web', 'pc', 'mobile'].includes(template)
const isNodeApp = (template: Template) => template === 'node'
const isPcApp = (template: Template) => template === 'pc'

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

  if (isPcApp(template)) {
    const { ui } = await prompt({
      type: 'list',
      name: 'ui',
      message: 'Select an UI library:',
      choices: pcUiLibs
    })
    uiLib = ui
  }

  generateTemplate(dest, template, uiLib)

  const agent = agentCli[await getAgent()]

  spinner.start('Install deps...')
  const installOpt = await exec(`cd ${dest} && ${agent.install}`)
  spinner.succeed('Install deps completed')
  console.log(installOpt.stdout)

  const initGitRepo = [
    `cd ${dest}`,
    `${agent.add} @yangss/init-git-repo -D`,
    `${agent.exec} init-git-repo -t ${isNodeApp(template) ? 'ts' : 'vue'}`
  ]
  spinner.start('Initialize git repo...')
  const initOpt = await exec(initGitRepo.join('&&'))
  spinner.succeed('Initialize git repo completed')
  console.log(initOpt.stdout)


  if (isNodeApp(template)) {
    console.log('\nDone.')
    console.log()
  } else {
    console.log('\nDone. Now run:\n')
    if (dest !== cwd) {
      console.log(` cd ${path.relative(cwd, dest)}`)
    }
    console.log(` ${agent.run} dev`)
    console.log()
  }
}

function generateTemplate (
  dest: string,
  template: Template,
  uiLib?: PcUiLib | MobileUiLib
) {
  const templateDir = path.resolve(__dirname, `../templates/${template}`)

  const files = fs.readdirSync(templateDir)
  for (const file of files) {
    const templateRootFile = path.join(templateDir, file)
    renameRootFiles[file]
      ? fs.copySync(templateRootFile, path.join(dest, renameRootFiles[file]))
      : fs.copySync(templateRootFile, path.join(dest, file))
  }

  const renameFiles = (files: { dir: string, regex: RegExp }[]) => {
    files.forEach(({ dir, regex }) => {
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

  if (isPcApp(template)) {
    renameFiles(pcRenameFiles)
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
    const pkgJsonPath = path.join(dest, 'package.json')
    const pkgJson = fs.readJsonSync(pkgJsonPath)
    pkgJson.dependencies[uiLibs[uiLib].name] = uiLibs[uiLib].version
    if (uiLib === 'element') pkgJson.devDependencies.sass = '^1.35.2'
    fs.outputJsonSync(pkgJsonPath, pkgJson, { spaces: 2 })
  }

  if (isWebApp(template)) {
    const indexHtmlPath = path.join(dest, 'index.html')
    const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8')
    fs.writeFileSync(
      indexHtmlPath,
      indexHtml.replace('<!--app-title-->', path.basename(dest))
    )
  }
}

async function getAgent () {
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


init().catch((e) => {
  console.error(e)
  process.exit(1)
})
