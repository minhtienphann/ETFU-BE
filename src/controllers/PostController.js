const { Types } = require('mongoose')
const jwt = require("jsonwebtoken");
const Post = require('../models/Post')
const User = require("../models/User");
const { json } = require('body-parser');

const PostsController = {
    show: async (req, res)=>{
        const {type, search, page} = req.query
        const filter = []
        if(type) filter.push({$match:{type:type}})
        if(type){var posts = await Post.aggregate(filter)}
        else {var posts = await Post.find()}
        if(posts) res.status(200).json(posts)
    },
    create: async (req, res)=>{
        const {title, type, content, image} = req.body
        console.log("CHECK: ",title)
        console.log("CHECK: ",type)
        console.log("CHECK: ",content)
        console.log("CHECK: ",image)
        var reqData = req.body
        console.log("CHECK....: ", reqData)
        const accessToken = req.header('Authorization').split(' ')[1]
        var decoded = jwt.decode(accessToken, process.env.ACCESS_TOKEN_SECRET, {complete: true})
        const owner = decoded.id;
        const user = await User.findById(decoded.id)
        if(!user) return res.status(400).json({ msg: 'User not available on system' })
        const post = new Post({
            owner,
            title,
            type,
            content,
            image
        })
        await post.save()
        return res.status(200).json({msg:"Post Blog Successfully"})
    }
}

module.exports = PostsController