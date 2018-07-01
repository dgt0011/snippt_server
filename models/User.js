var mongoose = require('mongoose')
var bcrypt = require('bcrypt')

// todo: consider adding select: false to the pwd
var userSchema = new mongoose.Schema({
    email:  {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    pwd: {
        type: String,
        required: true
    }
})

userSchema.pre('save',function(next) {
    var user = this

    if(!user.isModified('pwd'))
        return next()

        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(user.pwd, salt, (err, hash) => {
                if(err) return next(err)

            user.pwd = hash
            next()
        })
    })
})

module.exports = mongoose.model('User', userSchema )