const https = require('https');

module.exports = async ({ type, name }) => {
    const url = `https://raw.githubusercontent.com/Dugnist/jsberry/master/packages/${
        type
    }.json`;
    const modulesList = await request({ url });

    console.log(JSON.parse(modulesList));
};

function request({ url, body = '' }) {
    return new Promise((resolve) => {
        https.get(url, (response) => {
                response.on('data', d => body += d);
                response.on('end', () =>
                    resolve(body.indexOf('clear') === -1 ? '{"error": 404}' : body));
                response.on('error', (e) => console.log(e));
        });
    }); 
}