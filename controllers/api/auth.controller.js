var User        = require('../../models/User.js')
var bcrypt      = require('bcrypt')
var jwt         = require('jwt-simple')
var express     = require('express')
var winston     = require('winston')
var config      = require('../../config')
var secrets     = require('../../config/secrets.json');

var logger;

class AuthController {     
    constructor(router) {
        router.post('/register', this.registerUser.bind(this));
        router.post('/login', this.loginUser.bind(this));

        // TODO: This could be injected?
        logger = winston.createLogger({
            level: config.logging.logLevel,
            format: winston.format.json(),
            transports: [
              // new winston.transports.Console(),
              new winston.transports.File({ filename: 'error.log', level: 'error' }),
              new winston.transports.File({ filename: 'combined.log' })
            ]
          });
    }

    registerUser(req, res) {
        logger.log('debug', '-> registerUser');

        var userData = req.body
        var user = new User(userData)
        var userExists = false
        
        User.findOne({ userId: userData.userId }).then(function (result) {
            if (result === null) {
                logger.log('debug', 'User does not exist, adding user : ' + userData.userId);

                user.save((err, newUser) => {
                    if (err) {
                        logger.log('error', 'Error saving user - ' + err);
                        res.statusCode = 500
                        logger.log('debug', '<- registerUser [error]');
                        return res.end('Error saving user')
                    }
    
                    logger.log('debug', 'User saved.');
                    var payload = { sub: newUser._id }
                    var jwtToken = jwt.encode(payload, secrets.jwtKey)

                    logger.log('debug', '<- registerUser [success]');
                    return res.status(200).send({ jwtToken })
                })

            } else {
                logger.log('warn', 'User Id : ' + userData.userId + ' already exists.');

                userExists = true
                res.statusCode = 409

                logger.log('debug', '<- registerUser [error]');
                return res.end('That User Id already exists.  Please choose another.')
            }
        })
    }

    loginUser (req, res)  {
        logger.log('debug', '-> loginUser');

        var userData = req.body;        
        User.findOne({ userId: userData.userId }).then(function (result) {
            if (result === null) {
                logger.log('warn', 'User Id : ' + userId + ' does not exist.');
                res.statusCode = 401
                logger.log('debug', '<- loginUser [error]');
                return res.end('UserId or password is invalid')
            } else {
                bcrypt.compare(userData.pwd, result.pwd, function(err, isMatch) {
                    if(!isMatch) {
                        logger.log('warn', 'User Id : ' + userId + ' password mismatch.');
                        res.statusCode = 401
                        logger.log('debug', '<- loginUser [error]');
                        return res.end('UserId or password is invalid')
                    }
        
                    var payload = { sub: result._id }
                    var jwtToken = jwt.encode(payload, secrets.jwtKey)        
                    logger.log('debug', '<- loginUser [success]');            
                    return res.status(200).send({ jwtToken })       
                });
            }
        })
    }

    checkAuthenticated(req, res, next) {
        logger.log('debug', '-> checkAuthenticated');

        if(!req.header('Authorization')){
            res.statusCode(401)        
            logger.log('warn', 'Authorization header missing.');
            logger.log('debug', '<- checkAuthenticated [error]');
            return res.end({message: 'Unauthorized.  Login required.'})
        }
        const token = req.header('Authorization').split(' ')[1]

        const payload = jwt.decode(token, secrets.jwtKey)

        if(!payload) {
            res.status(401)
            logger.log('warn', 'Jwt token invalid.');
            logger.log('debug', '<- checkAuthenticated [error]');
            return res.end({message: 'Unauthorized.  Login required.'})
        }
        
        req.userId = payload.sub

        logger.log('debug', '<- checkAuthenticated');

        next()
    }
}

module.exports = AuthController;
