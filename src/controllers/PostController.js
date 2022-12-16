const { Types } = require('mongoose')
const jwt = require("jsonwebtoken");
const Post = require('../models/Post')
const User = require("../models/User");
const Comment = require("../models/Comment");
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
        if(filter.length != 0){var posts = await Post.aggregate(filter).skip(page * limit).limit(limit).sort({createdAt:-1})}
        filter.push({
          $group: {
            _id: null,
            count: {
              $sum: 1
            }
          }
        })
        const total = (await Post.aggregate(filter))[0]?.count
        const resopnse = {
          totalPage: Math.ceil(total / limit),
          currentPage: page + 1,
          postCount: total,
          posts
        }
        if(posts) res.status(200).json(resopnse)
    },
    create: async (req, res)=>{
        console.log("CHECK....: ", req.body)
        const {title, content} = req.body
        const image = { name: 'http://localhost:3000/' + req.file.filename }
        if (!image) return res.status(400).json({ msg: 'No image upload' })
        const type = req.body.type
        const owner = req.user.id
        const user = await User.findById(owner)
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
      const blogDetail = await Post.findOne({ _id: req.params.id }).populate('owner').populate('comments')
      if(blogDetail) res.status(200).json(blogDetail)
      else res.status(404).json({ msg: 'There are no blog' })
    },
    addComment: async (req, res) => {
      console.log('BOody :',req.params.id)
      try {
        const blogDetail = await Post.findById({_id:req.params.id})
        if(blogDetail){
          const{owner, title, type, content, image, comments} = blogDetail
          const newComments = req.body.comments
          console.log('newComments: ',newComments)
          // comments = newComments
          const blogDetailUpdated = await Post.update({_id:req.params.id},{$set:{"owner":owner, "title": title, "type":type, "content":content, "image":image, "comments":newComments}})
          console.log('CHECK>>>>>>>> ',blogDetailUpdated)
          res.status(200).json({msg:'Successfully'})
        }
      } catch (error) {
        console.log("error: " + error)
        res.status(500).json({msg:'error updating'})
      }
    }
}

module.exports = PostsController