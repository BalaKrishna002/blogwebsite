//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const passport = require("passport");
const flash = require('express-flash');
const session = require("express-session");


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
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use("/",indexRoute);
app.use("/auth",authRoute);
app.use("/blog", blogRoute);


app.listen(process.env.PORT||3000, function() {
  console.log("Server started successfully");
});
