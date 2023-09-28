//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent = "This is my daily journal or blog. Anyone can post a journal or blog in this blogpost.";
const aboutContent = "I am currently pursuing my Bachelor's in Computer Science stream. I am in penultimate year of my bachelor's, currently looking for an internship.";
const contactContent = "whatsapp,instagram";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true}); 

const postSchema = {
  title: String,
  content: String 
};
const Post = mongoose.model("Post", postSchema);


app.get("/",async (req,res)=>{
  const posts = await Post.find()
  res.render("home", {
    homeContent: homeStartingContent,
    posts: posts
  });

})

app.get("/about",(req,res)=>{
  res.render("about",{aboutContent: aboutContent});
})

app.get("/contact",(req,res)=>{
  res.render("contact",{contactContent: contactContent});
})

app.get("/compose",(req,res)=>{
  res.render("compose");
})

app.post("/compose",(req,res)=>{
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save();
  res.redirect("/");
})

app.get("/posts/:postId",async (req,res)=>{
  const requestedPostId = req.params.postId;
  const post = await Post.findOne({_id: requestedPostId});
  res.render("post",{
    id: post._id,
    title: post.title,
    content: post.content
  });
})

app.post("/delete/:postId",async (req,res)=>{
  await Post.deleteOne({_id:req.params.postId});
  res.redirect("/");
})

app.get("/compose/update/:postId", async (req,res)=>{
  const requestedPostId = req.params.postId;
  const post = await Post.findById(requestedPostId);
  res.render("update",{
    post
  });
})

app.post("/compose/update/:postId", async(req,res)=>{
  const id = req.params.postId;
  await Post.findByIdAndUpdate(id,
    {
      title: req.body.postTitle,
      content: req.body.postBody
    })
  res.redirect(`/posts/${id}`);
})

app.listen(process.env.PORT||3000, function() {
  console.log("Server started successfully");
});
