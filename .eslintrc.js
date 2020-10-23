const config = require('@colonise/config/eslint');

if (config.rules['id-denylist'] && config.rules['id-denylist'][0]) {
    config.rules['id-denylist'][0] = config.rules['id-denylist'][0].filter(id => id !== 'data')
}


module.exports = config;
