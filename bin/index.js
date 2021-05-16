#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const minimist_1 = __importDefault(require("minimist"));
const inquirer_1 = require("inquirer");
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const argv = minimist_1.default(process.argv.slice(2));
const cwd = process.cwd();
const TEMPLATES = ['base', 'pc', 'mobile'];
async function init() {
    let targetDir = argv._[0];
    if (!targetDir) {
        const { name } = await inquirer_1.prompt({
            type: 'input',
            name: 'name',
            message: 'Project name:',
            default: 'my-project'
        });
        targetDir = name;
    }
    const dist = path_1.default.resolve(cwd, targetDir);
    if (fs_extra_1.default.existsSync(dist)) {
        const { yes } = await inquirer_1.prompt({
            type: 'confirm',
            name: 'yes',
            message: `Target directory ${targetDir} is not empty.\n` +
                'Remove existing files and continue?',
            default: true
        });
        if (yes) {
            await fs_extra_1.default.remove(dist);
        }
        else {
            return;
        }
    }
    let template = argv.t || argv.template;
    let message = 'Select a template:';
    let isValidTemplate = false;
    if (typeof template === 'string') {
        isValidTemplate = TEMPLATES.includes(template);
        message = `${template} isn't a valid template. Please choose from below:`;
    }
    if (!template || !isValidTemplate) {
        const { t } = await inquirer_1.prompt({
            type: 'list',
            name: 't',
            message,
            choices: TEMPLATES
        });
        template = t;
    }
    const templateDir = path_1.default.resolve(__dirname, `../templates/${template}`);
    const files = fs_extra_1.default.readdirSync(templateDir);
    for (const file of files.filter((f) => f !== 'package.json')) {
        fs_extra_1.default.copySync(path_1.default.join(templateDir, file), path_1.default.join(dist, file));
    }
    const pkg = await fs_extra_1.default.readJson(path_1.default.join(templateDir, 'package.json'));
    pkg.name = path_1.default.basename(dist);
    await fs_extra_1.default.outputJson(path_1.default.join(dist, 'package.json'), pkg, { spaces: 2 });
    const pkgManager = /yarn/.test(process.env.npm_execpath) ? 'yarn' : 'npm';
    console.log('\nDone. Now run:\n');
    if (dist !== cwd) {
        console.log(`  cd ${path_1.default.relative(cwd, dist)}`);
    }
    console.log(`  ${pkgManager === 'yarn' ? 'yarn' : 'npm install'}`);
    console.log(`  ${pkgManager === 'yarn' ? 'yarn dev' : 'npm run dev'}`);
    console.log();
}
init().catch((e) => {
    console.error(e);
});
