const { Types } = require('mongoose')
const jwt = require("jsonwebtoken");
const Post = require('../models/Post')
const User = require("../models/User");
const { json } = require('body-parser');

const PostsController = {
    show: async (req, res)=>{
        const {type, search} = req.query
        const filter = []
        const page = parseInt(req.query.page) - 1 || 0
      const limit = parseInt(req.query.limit) || 6
        if(type) filter.push({$match:{type:type}})
        if (search && filter.length != 0) filter[0].$match.title = { $regex: search.replace(/  +/g, ' ').trim().toLowerCase(), $options: 'i' }
        else filter.push({$match:{title:{ $regex: search.replace(/  +/g, ' ').trim().toLowerCase(), $options: 'i' }}})
          filter.push({
            $lookup: {
              from: 'users',
              localField: 'owner',
              foreignField: '_id',
              as: 'userInfo'
            }
          })
        if(filter.length != 0){var posts = await Post.aggregate(filter).skip(page * limit).limit(limit)}
        if(posts) res.status(200).json(posts)
    },
    create: async (req, res)=>{
        console.log("CHECK....: ", req.body)
        const {title, content} = req.body
        const image = { name: 'http://localhost:3000/' + req.file.filename }
        if (!image) return res.status(400).json({ msg: 'No image upload' })
        const type = req.body.type
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
    },
    detail: async (req, res) => {
      console.log("CHECK [GET] DETAIL REQ: ",req.params.id)
      const blogDetail = await Post.findOne({ _id: req.params.id }).populate('owner')
      if(blogDetail) res.status(200).json(blogDetail)
      else res.status(404).json({ msg: 'There are no blog' })
    },
}

module.exports = PostsController