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
    comments:[
        {
            commentOwner: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            email: String,
            content: String
        }
    ]
},{timestamps: true}
)

module.exports = mongoose.model('Post', Post)
