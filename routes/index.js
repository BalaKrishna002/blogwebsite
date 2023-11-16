const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const { marked }  = require("marked");

const Post = require("../models/blog");
const User = require("../models/user");
const ensureAuth = require("../middleware/ensureAuth");

const router = express.Router();

router.get("/",ensureAuth, async (req,res)=>{
    const posts = await Post.find({author: req.user._id});
    posts.forEach((post)=>{
      post.content = marked(post.content);
    })
    res.render("home",{user: req.user.fullname,posts: posts}); 
});

router.get("/about",(req,res)=>{
    res.render("about");
})

router.get("/search",async (req,res)=>{
  const search = req.query.search;
  const regex = new RegExp(search, 'i');

  const posts =  await Post.find(
    {
      $or: [{title: { $regex: regex }},{content: { $regex: regex }}]
    }
  );
  posts.forEach((post)=>{
    post.content = marked(post.content);
  })
  res.render("search",{search,posts})
})

router.get("/search/posts/:postId",async (req,res)=>{
  const requestedPostId = req.params.postId;
  const post = await Post.findOne({_id: requestedPostId});
  const author = await User.findOne({_id: post.author});
  res.render("search_post",{
    id: post._id,
    title: post.title,
    content: marked(post.content),
    author: author,
    createdAt: post.createdAt.getDate()+'/'+post.createdAt.getMonth()+'/'+post.createdAt.getFullYear()
  });
});

router.get("/profile/:profileId", async (req,res)=>{
    const posts = await Post.find({author: req.params.profileId});
    const author = await User.findOne({_id: req.params.profileId});
    posts.forEach((post)=>{
      post.content = marked(post.content);
    })
    res.render("profile",{posts,author}); 
})

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
          console.error(err);
          return res.send(err); // Handle error appropriately
        }
        res.redirect('/auth/login');
      });
    
});

module.exports = router;