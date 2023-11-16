const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const passport = require("../middleware/passport")

const Post = require("../models/blog");
const User = require("../models/user");
const ensureAuth = require("../middleware/ensureAuth");
const { marked } = require("marked");

const router = express.Router();
  
  
 router.route("/compose")
  .get(ensureAuth,(req,res)=>{
    res.render("compose");
  })
  .post(ensureAuth,async (req,res)=>{
    //const htmlContent = marked(req.body.postBody);
    const post = new Post ({
      title: req.body.postTitle,
      content: req.body.postBody,
      author: req.user._id
    });
    await post.save();
    res.redirect("/");
  })
  
 router.get("/posts/:postId",async (req,res)=>{
    const requestedPostId = req.params.postId;
    const post = await Post.findOne({_id: requestedPostId});
    res.render("post",{
      id: post._id,
      title: post.title,
      content: marked(post.content),
      createdAt: post.createdAt.getDate()+'/'+post.createdAt.getMonth()+'/'+post.createdAt.getFullYear()
    });
  })
  
router.delete("/delete/:postId",ensureAuth,async (req,res)=>{
  try{
    const deletePost = await Post.findByIdAndDelete(req.params.postId);
    if(!deletePost){
      return res.status(404).json({ error: "Blog not found to delete "});
    }
    res.redirect("/");
  }catch (error){
    res.status(500).json({ error: "Error while deleting the blog!" });
  }
    
  })

router.route("/compose/update/:postId",ensureAuth)
  .get(async (req,res)=>{
    const requestedPostId = req.params.postId;
    const post = await Post.findById(requestedPostId);
    res.render("update",{
      post
    });
  })
  .put(async(req,res)=>{
    const id = req.params.postId;
    //const htmlContent = marked(req.body.postBody);
    await Post.findByIdAndUpdate(id,
      {
        title: req.body.postTitle,
        content: req.body.postBody
      },{ new: true })
    res.redirect(`/blog/posts/${id}`);
  });

  module.exports = router;