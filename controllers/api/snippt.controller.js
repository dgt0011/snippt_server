
var express     = require('express')
var auth        = require('../../auth')
var snipptRepo  = require('../../lib/SnipptsRepository')
var winston     = require('winston')
var config      = require('../../config')
var logger;

class SnipptController {

    constructor(router) {
        router.get('/snippts', auth.checkAuthenticated, this.getSnippts.bind(this));
        router.get('/snippt/:id', auth.checkAuthenticated, this.getSnippt.bind(this));
        router.post('/snippts', auth.checkAuthenticated, this.insertSnippt.bind(this));
        router.post('/snippt', auth.checkAuthenticated, this.updateSnippt.bind(this));

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

    getSnippts(req, res) {
        logger.log('debug', '-> snippt.controller.getSnippts');
        
        var uid = auth.getAuthenticatedUser(req,res);
        if(uid === null)
        {
            logger.log('error', 'snippt.controller.getSnippts : cannot get Uid for current logged on user');            
        }

        snipptRepo.getSnippts(uid, (err, data) => {
            if (err) {
                logger.log('error', 'snippt.controller.getSnippts : ' + util.inspect(err));
                res.json(null);
            } else {
                logger.log('debug', 'snippt.controller.getSnippts - retrieved snippts for user : ' + uid);
                res.json(data.snippts);
            }
        });

        logger.log('debug', '<- snippt.controller.getSnippts');
    }

    getSnippt(req, res) {
        const id = req.params.id;
        logger.log('debug', '-> snippt.controller.getSnippt : ' + id);

        snipptRepo.getSnippt(id,(err, snippt) => {
            if (err) {
                logger.log('error', 'snippt.controller.getSnippt : ' + util.inspect(err));
                res.json(null);
            } else {
                logger.log('debug', 'snippt.controller.getSnippts - retrieved snippt : ' + id);
                res.json(snippt);
            }
        });
        logger.log('debug', '<- snippt.controller.getSnippt : ' + id);
    }

    insertSnippt(req, res) {        
        logger.log('debug', '-> snippt.controller.insertSnippt');

        var uid = auth.getAuthenticatedUser(req,res);
        if(uid === null)
        {
            logger.log('error', 'snippt.controller.insertSnippt : cannot get Uid for current logged on user');            
        }

        snipptRepo.insertSnippt(uid, req.body, (err, snippt) => {
            if (err) {
                logger.log('error', 'snippt.controller.insertSnippt : ' + util.inspect(err));
                res.json({ status: false, error: 'Insert failed', snippt: null });
            } else {
                logger.log('debug', 'snippt.controller.insertSnippt - ok');
                res.json({ status: true, error: null, snippt: snippt });
            }
        });
        logger.log('debug', '<- snippt.controller.insertSnippt');
    }

    updateSnippt(req, res) {        
        logger.log('debug', '-> snippt.controller.updateSnippt');

        var uid = auth.getAuthenticatedUser(req,res);
        if(uid === null)
        {
            logger.log('error', 'snippt.controller.updateSnippt : cannot get Uid for current logged on user');            
        }

        snipptRepo.updateSnippt(uid, req.body, (err, snippt) => {
            if (err) {
                logger.log('error', 'snippt.controller.updateSnippt : ' + util.inspect(err));
                res.json({ status: false, error: 'Update failed', snippt: null });
            } else {
                logger.log('debug', 'snippt.controller.updateSnippt - ok');
                res.json({ status: true, error: null, snippt: snippt });
            }
        });
        logger.log('debug', '<- snippt.controller.updateSnippt');
    }
}

module.exports = SnipptController;
