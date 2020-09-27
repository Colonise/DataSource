module.exports = require('@colonise/config/eslint');

module.exports.rules['id-denylist'] = module.exports.rules['id-denylist'].filter(id => id !== 'data')
