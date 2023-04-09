//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "This is my daily journal or blog. Anyone can post a journal or blog.";
const aboutContent = "I am currently pursuing my Bachelor's in Computer Science stream. I am in penultimate year of my bachelor's, currently looking for an internship.";
const contactContent = "";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];

app.get("/",(req,res)=>{
  res.render("home",{
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
  const post={
    title: req.body.postTitle,
    content: req.body.postBody
  };
  posts.push(post);
  res.redirect("/");
})

app.get("/posts/:postName",(req,res)=>{
  const requestedTitle=_.lowerCase(req.params.postName);
  posts.forEach((post)=>{
    const storedTitle = _.lowerCase(post.title)
    if(requestedTitle == storedTitle ){
      res.render("post",{
        title: post.title,
        content:post.content
      });
    }
  })
})



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
