// const path = require('path');
const chalk = require('chalk');
const shell = require('shelljs');
const inquirer = require('inquirer');

// Load lists with questions
const { questions } = require('../package.json');
const { typeinstall, framework, database, websockets, modules } = questions;

const jsbCoreRepo = 'https://github.com/Dugnist/jsberry-core.git';
const jsbFrameworkRepo = f => `https://github.com/Dugnist/jsberry-${f}-api.git`;
const jsbDatabaseRepo = d => `https://github.com/Dugnist/jsberry-${d}.git`;
const version = '0.0.5';

module.exports = async({ currentPath, name }) => {
    // Intro
    shell.echo(
        chalk.blue(`

    JSBerry CLI v${version}
        
        `)
    );

    // Check git version
    shell.echo(chalk.cyan('🔎 Check git'));
    if (!shell.which('git')) {
        shell.echo('Sorry, this script requires git!');
        shell.exit(1);
    }
    shell.exec('git --version').stdout;

    // Check npm version
    shell.echo(chalk.cyan('📂 Check npm version'));

    const npm = shell.exec('npm -v').stdout;

    if (parseFloat(npm) < 5) {
        throw new Error('[ERROR: JSBerry] You need npm version @>=5');
    }

    // Check node.js version
    shell.echo(chalk.cyan('💻 Check node.js version'));

    const nodeVersion = shell.exec('node -v').stdout.replace('v', '');

    if (parseFloat(nodeVersion) < 8.6) {
        throw new Error('[ERROR: JSBerry] You need to use node version @>=9');
    }

    // Get type of install (manual or default)
    const { TYPEINSTALL } = await askChooseTypeInstall();

    if (TYPEINSTALL === 'manual') {
        const { FRAMEWORK } = await askChooseFramework();
        const { DATABASE } = await askChooseDatabase();
        const { WEBSOCKETS } = await askConnectWS();
        const { MODULES } = await askConnectModules();

        const DB = DATABASE === 'MongoDB' ? 'mongoose' : DATABASE;
        
        setup({
            currentPath, name, websockets: WEBSOCKETS, modules: MODULES,
            framework: FRAMEWORK.toLowerCase(), database: DB.toLowerCase(),
        });
    } else {
        setup({ currentPath, name });
    }
};

function setup({
    framework = 'express', database = 'mongoose',
    websockets = false, validation = true,
    modules = ['clear'], currentPath, name,
}) {
    shell.echo('');
    shell.echo(chalk.cyan('🕓  The setup process can take few minutes.'));
    shell.echo('');
    shell.exec(`git clone ${jsbCoreRepo} ${currentPath}/${name}`).output;
    shell.echo(chalk.cyan('👣 Go to project'));
    shell.cd(`${currentPath}/${name}`).output;
    shell.echo(chalk.cyan('📥 Install scripts'));
    shell.exec('npm i').output;
    shell.echo(chalk.cyan('📥 Install framework'));
    shell.cd(`${currentPath}/${name}/src/plugins`).output;
    shell.exec(`git clone ${jsbFrameworkRepo(framework)} ${framework}-api`).output;
    shell.cd(`${currentPath}/${name}/src/plugins/${framework}-api`).output;
    shell.exec('node install').output;
    shell.echo(chalk.cyan('📥 Install database'));
    shell.cd('../').output;
    shell.exec(`git clone ${jsbDatabaseRepo(database)} ${database}`).output;
    shell.cd(`${currentPath}/${name}/src/plugins/${database}`).output;
    shell.exec('node install').output;
    shell.echo(chalk.green('🙌  Done.'));
}

function askChooseTypeInstall () {
    return inquirer.prompt([typeinstall]);
}

function askChooseFramework () {
    return inquirer.prompt([framework]).then((res) => {
        if (res.FRAMEWORK.indexOf('(soon)') !== -1) {
            shell.echo(
                chalk.yellow(`Unfortunately ${res.FRAMEWORK} not support now. Choose another please!`)
            );
            return askChooseFramework();
        } else return res;
    });
}

function askChooseDatabase () {
    return inquirer.prompt([database]).then((res) => {
        if (res.DATABASE.indexOf('(soon)') !== -1) {
            shell.echo(
                chalk.yellow(`Unfortunately ${res.DATABASE} not support now. Choose another please!`)
            );
            return askChooseDatabase();
        } else return res;
    });
}

function askConnectWS () {
    return inquirer.prompt([websockets]);
}

function askConnectModules () {
    return inquirer.prompt([modules]);
}