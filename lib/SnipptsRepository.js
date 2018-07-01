const mongoose    = require('mongoose'),
      Schema      = mongoose.Schema,
      Snippt      = require('../models/Snippt'),
      config      = require('../config'),
      winston     = require('winston');

var logger;

class SnipptsRepository {

      constructor() {   
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

      getSnippts(uid, callback) {
            logger.log('debug', '-> SnipptsRepository.getSnippts for UID : ' + uid);

            Snippt.count((err, snipptsCount) => {
                  let count = snipptsCount;
                  logger.log('debug', 'SnipptsRepository.getSnippts snippt count : ' + count);

                  Snippt.find({ ownerId : uid }, (err, snippts) => {
                        if (err) {
                              logger.log('error', 'SnipptsRepository.getSnippts error : ' + err);
                              return callback(err);
                        }
                        callback(null, {
                              count: count,
                              snippts: snippts
                        });
                  });
            });
            logger.log('debug', '<- SnipptsRepository.getSnippts for UID : ' + uid);
      }

      getSnippt(id, callback) {
            logger.log('debug', '-> SnipptsRepository.getSnippt for ID : ' + id);

            Snippt.findById(id, (err, snippt) => {
            if (err) { 
                  logger.log('error', 'SnipptsRepository.getSnippt error : ' + err);
                  return callback(err); 
            }
            callback(null, snippt);
            });

            logger.log('debug', '<- SnipptsRepository.getSnippt for ID : ' + id);
      }

      insertSnippt(uid, body, callback) {
            logger.log('debug', '-> SnipptsRepository.getSnippt for UID : ' + uid);

            let snippt = new Snippt();
            snippt.ownerId = uid;
            snippt.id = body.id;
            snippt.title = body.title;
            snippt.description = body.description;
            snippt.body = body.body;
            snippt.createDate = body.createDate;

            snippt.save((err, snippt) => {
                  if (err) { 
                        logger.log('error', 'SnipptsRepository.insertSnippt error : ' + err);
                        return callback(err, null); 
                  }

                  callback(null, snippt);
            });
            logger.log('debug', '<- SnipptsRepository.getSnippt for UID : ' + uid);
      }

      updateSnippt(uid, body, callback) {
            logger.log('debug', '-> SnipptsRepository.updateSnippt for UID : ' + uid);

            Snippt.findById(body._id, (err, snipptItem)  => {
                  if (err) { 
                      logger.log('error', 'SnipptsRepository.updateSnippt error : ' + err);
                      return callback(err); 
                  }
      
                  snipptItem.title = body.title || snipptItem.title;
                  snipptItem.description = body.description || snipptItem.description;
                  snipptItem.body = body.body || snipptItem.body;      
      
                  snipptItem.save((err, snipptItem) => {
                        if (err) { 
                              logger.log('error', 'SnipptsRepository.updateSnippt error : ' + err);
                              return callback(err, null); 
                        }
      
                      callback(null, snipptItem);
                  });
            });
            logger.log('debug', '<- SnipptsRepository.updateSnippt for UID : ' + uid);
      }
}

module.exports = new SnipptsRepository();