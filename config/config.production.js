var config = require('./config.global');

var secrets = require('./secrets.json');

config.env = 'production';

config.mongo.connectionString = secrets.mongoConnectionStringProd;

config.logging.logLevel = 'warn';

module.exports = config;