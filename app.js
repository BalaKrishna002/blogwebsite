//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const _ = require("lodash");
const Post = require("./models/blog");
const blogRoute = require("./routes/blog");

//const homeStartingContent = "This is my daily journal or blog. Anyone can post a journal or blog in this blogpost.";
const aboutContent = "I am currently pursuing my Bachelor's in Computer Science stream. I am in penultimate year of my bachelor's, currently looking for an internship.";
const contactContent = "whatsapp,instagram";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride('_method'));
app.use("/", blogRoute);

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});    //"mongodb://127.0.0.1:27017/blogDB"

app.get("/about",(req,res)=>{
  res.render("about",{aboutContent: aboutContent});
})

app.get("/contact",(req,res)=>{
  res.render("contact",{contactContent: contactContent});
})

app.get("/compose",(req,res)=>{
  res.render("compose");
})

app.listen(process.env.PORT||3000, function() {
  console.log("Server started successfully");
});
