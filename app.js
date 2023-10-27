//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const session = require("express-session");
const _ = require("lodash");


const Post = require("./models/blog");
const User = require("./models/user");
const indexRoute = require("./routes/index");
const blogRoute = require("./routes/blog");
const authRoute = require("./routes/auth");


const app = express();

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});    //"mongodb://127.0.0.1:27017/blogDB"  process.env.DATABASE_URL

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride('_method'));


app.use(session({
  secret: "sndknmdlnb12e4254jb",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
const saltRounds = 10;

app.use("/",indexRoute);
app.use("/auth",authRoute);
app.use("/blog", blogRoute);


app.listen(process.env.PORT||3000, function() {
  console.log("Server started successfully");
});
