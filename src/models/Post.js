const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Post = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title:{
        type: String
    },
    type:{
        type: String
    },
    content:{
        type: String
    },
    image: {
        type: Object
      },
    comments:[{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        comment:{
            type: String,
        },
    }]
},{timestamps: true}
)

module.exports = mongoose.model('Post', Post)
