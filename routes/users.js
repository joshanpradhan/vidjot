const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
// const passport = require('passport');
const router = express.Router();

//load User Model
require('../models/User');
const User = mongoose.model('users');


//User login route
router.get('/login', (req, res) => {
    res.render('users/login');
});

//User login route
router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//Process register Form
router.post('/register', (req, res) => {
    let errors = [];
    if (!req.body.name) {
        errors.push({
            text: 'Please enter your name'
        });
    }
    if (!req.body.email) {
        errors.push({
            text: 'Please enter your email'
        });
    }
    if (!req.body.password) {
        errors.push({
            text: 'Please enter your password'
        });
    }
    if (!req.body.confirm_password) {
        errors.push({
            text: 'Please enter your confirm_password'
        });
    }
    if (req.body.password != req.body.confirm_password) {
        errors.push({
            text: 'Password do not match'
        });
    }
    if (req.body.password.length < 4) {
        errors.push({
            text: 'Password must be atleast 4 characters'
        });

    }
    if (errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            confirm_password: req.body.confirm_password
        });
    } else {
        User.findOne({ email: req.body.email })
            .then(user => {
                if (user) {
                    req.flash('error_msg', 'Email already registered');
                    res.redirect('/users/register');
                } else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    });
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser
                                .save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can log In');
                                    res.redirect('/users/login');

                                })
                                .catch(err => {
                                    console.log(err);
                                    return;
                                });
                        });
                    });

                }
            });
    }
});


//Logout User

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});



module.exports = router;