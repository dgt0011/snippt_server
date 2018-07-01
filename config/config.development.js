var config = require('./config.global');

var secrets = require('./secrets.json');

config.env = 'development';

config.mongo.connectionString = secrets.mongoConnectionStringDev;

config.logging.logLevel = 'debug';

module.exports = config;