const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const Post = require("../models/blog");
const User = require("../models/user");
const ensureAuth = require("../middleware/ensureAuth");

const router = express.Router();

router.get("/",ensureAuth, async (req,res)=>{
    const posts = await Post.find({author: req.user._id});
    res.render("home",{user: req.user.fullname,posts: posts}); 
});

router.get("/about",(req,res)=>{
    res.render("about");
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