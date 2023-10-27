const express = require("express");
const mongoose = require("mongoose");
const passport = require("../middleware/passport");
const bcrypt = require("bcrypt");
const session = require("express-session");

const router = express.Router();
const User = require("../models/user");
const saltRounds = 10;

router.route("/register")
    .get((req,res)=>{
        res.render("register");
    })
    .post( async (req, res) => {
        const { fullname, username, password } = req.body;
    
        try {
        const existingUser = await User.findOne({ username });
    
        if (existingUser) {
            //return res.send('Username already exists. Please choose another one.');
            res.redirect("/auth/login");
        }
    
        // Create a new user document and save it to the database
        const hash = await bcrypt.hash(password,saltRounds);
        const newUser = new User({ fullname, username, password:hash });
        await newUser.save();
    
        // Redirect to the login page or any other appropriate page
        res.redirect('/auth/login');
        } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred during registration.');
        }
    });

router.route("/login")
    .get((req,res)=>{
        res.render("login");
    })
    .post(passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
    }));



module.exports =  router ;