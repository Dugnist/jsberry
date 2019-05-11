const fs = require('fs');
const https = require('https');
const chalk = require('chalk');
const shell = require('shelljs');
const { exec } = require('child_process');

module.exports = async ({ type, pluginName, currentPath }) => {
    try {
        const url = `https://raw.githubusercontent.com/Dugnist/jsberry/master/packages/${
            type
            }.json`;
        const checkForExternal = pluginName.indexOf('https://github.com/') !== -1;
        const modulesList = JSON.parse(await request({ url }));        
        const checkForExist = checkForExternal ? '' : await request({ url: modulesList[pluginName] });
        const splitClearName = pluginName.split('/');
        const clearName = (splitClearName[splitClearName.length - 1] || '').split('.git')[0];
        const pluginsPath = `${currentPath}/src/${type}/`;
        const outputPath = `${currentPath}/src/${type}/${checkForExternal ? clearName : pluginName}`;        

        if (!modulesList[pluginName] && !checkForExternal) {
            throw new Error(`Not found "${pluginName}" in ${type}!`);
        }
        if (
            checkForExist.indexOf(`jsberry i ${pluginName} ${
                type.substring(0, (type.length - 1))
            }`) === -1 && !checkForExternal
        ) throw new Error(`Not found "${pluginName}" in ${type}!\n`);
        
        // check current directory to exist required directories/files
        if (
            fs.existsSync(`${currentPath}/src`) &&
            fs.existsSync(`${currentPath}/src/${type}`) &&
            fs.existsSync(`${currentPath}/package.json`)
        ) {
            console.log(chalk.green(`Installing ${pluginName} ${
                type.substring(0, (type.length - 1))
            } for JSBerry \n`));

            // try to clone module/plugin 
            shell.exec(
                `git clone ${
                    checkForExternal ? pluginName : modulesList[pluginName]
                } ${outputPath}`
            ).output;

            // get data from plugin config
            const {
                name = pluginName, install = [], postinstall = ''
            } = require(`${outputPath}/config.json`);

            const tick = setInterval(() => process.stdout.write('.'), 500);
            const commands = install.map((m) => `npm i ${m}`).join(' && ');
            const installProcess = exec(commands);

            installProcess.stdout.on('data', (data) => {
                process.stdout.write(data.toString());
            });
            installProcess.stderr.on('data', (data) => {
                process.stdout.write(data.toString());
            });
            installProcess.on('exit', () => {
                clearInterval(tick);
                shell.exec(`mv ${outputPath} ${pluginsPath}${name}`).output;
                setTimeout(() => {
                    shell.exec(`cd ${pluginsPath}${name} && ${postinstall}`).output;
                }, 1000);
                addRecordToPlugins('mongoose', `${currentPath}/src/${type}`);
            });  
        } else {
            throw new Error('Not found jsberry project here! \n');
        }
    } catch (error) {
        if (error.message.indexOf('ECONNREFUSED') !== -1) {
            process.stdout.write(chalk.red(`Not found "${pluginName}" in ${type}!\n`));
        } else {
            process.stdout.write(chalk.red('[Error: JSBerry] ' + error));
        }
    }
};

function request({ url, body = '' }) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, (response) => {
                response.on('data', d => body += d);
                response.on('end', () =>
                    resolve(body.indexOf('clear') === -1 ? '{"error": 404}' : body));
                response.on('error', (e) => console.log(chalk.red(e)));
        });

        req.on('error', (error) => reject(error));
    }); 
}

function addRecordToPlugins(name, currentPath) {
    fs.readFile(currentPath + '/index.js', 'utf8', (err, contents) => {
        if (err) {
            console.log(chalk.red(`Not found index.js file in ${
                currentPath.split('/').pop()
            }! ${err.message} \n`));
        }
        if (contents) {
            let plugins = [];
            let already = contents.indexOf(`'./${name}'`) !== -1;

            const pluginsFile = contents.match(/(module.exports \=)+[^\]]+\]/g);
            const pluginsList = pluginsFile[0].split('[')[1].replace(']', '');
            const pluginsText = pluginsFile[0].split('[')[1];

            if (pluginsList) {
                plugins = pluginsList.replace(/\n/g, '').split(',');
            }
            if (!already) {
                plugins.push(`  require('./${name}')`);
            }

            const result = `[\n${plugins.join(',\n')}\n]`;

            fs.writeFile(
                currentPath + '/index.js',
                contents
                    .replace(`[${pluginsText}`, result)
                    .replace(/\n  ,/g, ''),
                (err) => {
                    !err ?
                        console.log(chalk.green(`🙌  Success install ${name}!`)) :
                        console.log(err);
                });
        }
    });
}
