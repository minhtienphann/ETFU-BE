const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Comment = mongoose.Schema({
    commentOwner:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content:{
        type: String
    }
},{timestamps: true})

module.exports = mongoose.model('Comment', Comment)