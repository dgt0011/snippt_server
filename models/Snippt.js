var mongoose = require('mongoose')

var snipptSchema = new mongoose.Schema({
    id: {
        type: Number,
    },
    ownerId:  {
        type: String,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String
    },
    body: {
        type: String
    },
    createDate: {
        type: Date
    },
    tags: [{
        type: String
    }]
})

module.exports = mongoose.model('Snippt', snipptSchema )