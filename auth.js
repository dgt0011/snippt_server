
var User = require('./models/User');
var jwt = require('jwt-simple')
var secrets = require('./config/secrets.json');

var express= require('express')
var router = express.Router()

var auth = {
    router,
    checkAuthenticated: (req, res, next) => {
        if(!req.header('Authorization')){
            return res.status(401).send({message: 'Unauthorized.  Login required.'})
        }
        
        const token = req.header('Authorization').split(' ')[1] 

        if(token == 'null'){
            return res.status(401).send({message: 'Unauthorized.  Login required.'})
        }

        const payload = jwt.decode(token, secrets.jwtKey)    
        if(!payload)
        {
            return res.status(401).send({message: 'Unauthorized.  Login required.'})
        }
        
        req.userId = payload.sub
    
        next()
    },

    getAuthenticatedUser: (req, res) => {
        if(!req.header('Authorization')){
            return res.status(401).send({message: 'Unauthorized.  Login required.'})
        }
        
        const token = req.header('Authorization').split(' ')[1] 

        if(token == 'null'){
            return res.status(401).send({message: 'Unauthorized.  Login required.'})
        }

        const payload = jwt.decode(token, secrets.jwtKey)    
        if(!payload)
        {
            return res.status(401).send({message: 'Unauthorized.  Login required.'})
        }
        
        return payload.sub
    }

}

module.exports = auth