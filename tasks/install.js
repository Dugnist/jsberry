const http = require('http');

module.exports = async ({ type, name }) => {
    const modulesList = await request();

    console.log(modulesList);
};

function request({
    urlHost = 'raw.githubusercontent.com',
    urlPath = '/Dugnist/jsberry/master/packages/modules.json',
    body = '',
}) {
    return new Promise((resolve) => {
        http.get({ host: urlHost, path: urlPath },
            (response) => {
                response.on('data', d => body += d);
                response.on('end', () => resolve(JSON.parse(body)));
        });
    }); 
}