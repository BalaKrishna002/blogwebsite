const express = require("express");
const passport = require("../middleware/passport");
const bcrypt = require("bcrypt");

const router = express.Router();
const User = require("../models/user");
const saltRounds = 10;

router.route("/register")
    .get((req,res)=>{
        res.render("register",{message: req.flash()});
    })
    .post( async (req, res) => {
        const { username, email, password } = req.body;
    
        try {
        const existingUser = await User.findOne({ email });
        //console.log(existingUser)
    
        if (existingUser) {
            //return res.send('Username already exists. Please choose another one.');
            req.flash('error','User already exists!');
            return res.redirect("/auth/register");
        }
    
        // Create a new user document and save it to the database
        const hash = await bcrypt.hash(password,saltRounds);
        const newUser = new User({  username, email, password:hash });
        await newUser.save();
    
        // Redirect to the login page or any other appropriate page
        req.flash('success','User successfully registered!');
        res.redirect('/auth/login');
        } catch (err) {
        console.error(err);
        req.flash('error','An error occurred during registration!');
        res.status(500).send('An error occurred during registration.');
        }
    });

router.route("/login")
    .get((req,res)=>{
        res.render("login",{message: req.flash()});
    })
    .post(passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: true,
        successFlash: 'Successfully logged in'
      }));

router.get('/google', passport.authenticate('google', { scope: ['email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/auth/login' }), (req, res) => {
        res.redirect('/'); // Redirect after successful authentication
    });



module.exports =  router ;