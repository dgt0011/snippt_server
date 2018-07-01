var config = module.exports = {};

var secrets = require('./secrets.json');

config.env = 'development';
config.hostname = 'dev.example.com';

//jwt - secrets populated
config.jwt = {};
config.jwt.key = secrets.jwtKey;

//mongo database
config.mongo = {};
config.mongo.connectionString = '';

//winston logging level
config.logging = {};
config.logging.logLevel = '';