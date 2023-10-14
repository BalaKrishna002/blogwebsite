const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Post = require("../models/blog");

const router = express.Router();

router.get("/",async (req,res)=>{
    const posts = await Post.find()
    res.render("home", {
      homeContent: "This is my daily journal or blog.",
      posts: posts
    });
  
  })
  
  
 router.post("/compose",async (req,res)=>{
    const post = new Post ({
      title: req.body.postTitle,
      content: req.body.postBody
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
      content: post.content
    });
  })
  
router.delete("/delete/:postId",async (req,res)=>{
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

router.route("/compose/update/:postId")
  .get(async (req,res)=>{
    const requestedPostId = req.params.postId;
    const post = await Post.findById(requestedPostId);
    res.render("update",{
      post
    });
  })
  .put( async(req,res)=>{
    const id = req.params.postId;
    await Post.findByIdAndUpdate(id,
      {
        title: req.body.postTitle,
        content: req.body.postBody
      },{ new: true })
    res.redirect(`/posts/${id}`);
  });

  module.exports = router;