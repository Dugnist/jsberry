#!/usr/bin/env node

const createTask = require('../tasks/create.js');
const installTask = require('../tasks/install.js');

const commands = ['new', 'i', 'un', 'help']

// Get all input args
const args = process.argv.splice(process.execArgv.length + 2);
// Retrieve the first argument as a command
const command = args[0];
// Retrieve the second argument as a name of project
const name = args[1];
// Retrieve the third argument as a type of installed lib (plugin/module)
const type = args[2];
// Get execute directory path
const currentPath = process.cwd();

try {
    // Empty command
    if (!command) throw new Error('Empty command!');
    // Unknown command
    if (commands.indexOf(command) == -1) {
        console.log('Unknown command ' + command + '!');
        usage();
        return;
    }
    // Empty project name
    if (!name && command !== 'help') throw new Error('Empty new project name!');    

    // Choose task which will be init
    switch (command) {
        case 'help':
            usage();
            break
        case 'new':
            createTask({ name, currentPath });
            break
        case 'i':
            installTask({
                pluginName: name, type: (type + 's'), currentPath,
            });
            break
        case 'un':
            usage();
            break
        default:
            console.log('Invalid command passed!')
            usage();
    }
} catch (error) {
    console.log('[Error: JSBerry] ' + error + ' Please input: jsberry help');
}

// Help text output
function usage() {
    const usageText = `
usage:
    jsberry <command> <name> <type>

    commands can be:

    new:      used to create a new jsberry project
    i:        used to install plugins or modules from store
    un:       used to uninstall plugins or modules from project
    help:     used to print the usage guide

    for example:

    jsberry new my-project
    jsberry i express_api plugin
    jsberry i clear module
    `;

    console.log(usageText);
};