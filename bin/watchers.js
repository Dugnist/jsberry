const shell = require('shelljs');
const silent = false;

// Sync watcher with exec command
export const watcher = (label, cmd, withSuccess = true) => {
    if (label.length > 0) {
        shell.echo(label);
    }

    const data = shell.exec(cmd, {
        silent,
    });

    if (data.stderr && data.code !== 0) {
        console.error(data.stderr);
        process.exit(1);
    }

    if (label.length > 0 && withSuccess) {
        shell.echo('✅  Success');
        shell.echo('');
    }
};

// Async watcher with exec command
export const asyncWatcher = (label, cmd, withSuccess = true, resolve) => {
    if (label.length > 0) {
        shell.echo(label);
    }

    return shell.exec(cmd, { silent, async: true }, (code, stdout, stderr) => {
        if (stderr && code !== 0) {
            console.error(stderr);
            process.exit(1);
        }

        return resolve();
    });
};