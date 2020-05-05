const buildConfig = require('./config/config.build');

module.exports = process.env.NODE_ENV === 'development' ? {} : buildConfig;
