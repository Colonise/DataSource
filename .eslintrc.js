const config = require('@colonise/config/eslint');

if (config.rules['id-denylist']) {
    config.rules['id-denylist'] = config.rules['id-denylist'].filter(id => id !== 'data')
}


module.exports = config;
