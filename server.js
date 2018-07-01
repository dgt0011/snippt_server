const   express     = require('express'),
        cors        = require('cors'),
        bodyParser  = require('body-parser'),
        mongoose    = require('mongoose'),
        config      = require('./config'),
        router      = require('./routes/router'),
        winston     = require('winston'),

        app         = express(),
        port        = 3100;

mongoose.Promise = Promise

app.use(cors())
app.use(bodyParser.json())

class Server {
    constructor() {
        this.initRoutes();
        this.start();
    }

    initRoutes() {
        router.load(app, './controllers');
        //redirect all others
        app.all('/*', function(req,res) {
            res.sendFile(__dirname + '/public/404.html');
        })
    }

    start() {
        const logger = winston.createLogger({
            level: config.logging.logLevel,
            format: winston.format.json(),
            transports: [
              //
              // - Write to all logs with level `debug` and below to `combined.log` 
              // - Write all logs error (and below) to `error.log`.
              //
              // new winston.transports.Console(),
              new winston.transports.File({ filename: 'error.log', level: 'error' }),
              new winston.transports.File({ filename: 'combined.log' })
            ]
          });

        mongoose.connect(config.mongo.connectionString, { useMongoClient: true}, (err) => {
            if(!err) {
                logger.log('debug', 'connected to database');
            } else {
                logger.log('error', err)
            }
        })
        
        app.listen(port)
    }
}

let server = new Server();