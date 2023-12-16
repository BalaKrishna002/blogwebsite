const express = require("express");
const Post = require("../models/blog");
const ensureAuth = require("../middleware/ensureAuth");

const router = express.Router();
  
  
 router.route("/compose")
  .get(ensureAuth,(req,res)=>{
    res.render("compose");
  })
  .post(ensureAuth,async (req,res)=>{
    const {title, content} = req.body;
    try{
      const post = new Post ({
        title,
        content,
        author: req.user._id
      });
      await post.save();
      res.redirect("/");
    }catch(err){
      console.log("Error: ",err);
    }
    
  })
  
 router.get("/posts/:postId",async (req,res)=>{
    const requestedPostId = req.params.postId;
    const post = await Post.findOne({_id: requestedPostId});
    res.render("post",{
      id: post._id,
      title: post.title,
      content: post.content,               
      createdAt: post.createdAt.getDate()+'/'+post.createdAt.getMonth()+'/'+post.createdAt.getFullYear()
    });
  })
  
router.delete("/delete/:postId",ensureAuth,async (req,res)=>{
  try{
    const deletePost = await Post.findByIdAndDelete(req.params.postId);
    if(!deletePost){
      return res.status(404).json({ error: `Blog not found!`});
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
    await Post.findByIdAndUpdate(id,
      {
        title: req.body.title,
        content: req.body.content
      },{ new: true })
    res.redirect(`/blog/posts/${id}`);
  });

  module.exports = router;