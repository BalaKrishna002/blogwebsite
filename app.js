//jshint esversion:6

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

mongoose.connect("mongodb+srv://balu:y20cs108@cluster0.iwk3gyj.mongodb.net/blogDB", {useNewUrlParser: true});

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

app.post("/:postId",async (req,res)=>{
  await Post.deleteOne({_id:req.params.postId});
  res.redirect("/");
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
