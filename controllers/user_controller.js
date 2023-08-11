const express = require('express');
const User=require('../models/user');

module.exports.profile = async function(req, res) {
    try {
        if (req.cookies && req.cookies.user_id) {
            console.log('User ID from cookie:', req.cookies.user_id);
            
            const hexRegex = /^[0-9a-fA-F]{24}$/;
            if (hexRegex.test(req.cookies.user_id)) {
                const user = await User.findById(req.cookies.user_id);
                if (user) {
                    return res.render('user_profile', {
                        title: "User Profile",
                        user: user
                    });
                }
            }
            return res.redirect('/users/sign-in');
        } else {
            return res.redirect('/users/sign-in');
        }
    } catch (err) {
        console.error('Error in user profile:', err);
        return res.redirect('/users/sign-in');
    }
};
//render the sign up page
module.exports.signUp=function(req,res)
{
    return res.render('user_sign_up',{
        title:"Codeial | Sign Up"
    })
}

//render the sign in page
module.exports.signIn=function(req,res)
{
    return res.render('user_sign_in',{
        title:"Codeial | Sign In"
    })
}

//post the sign up data

module.exports.create = async function (req, res) {
    try {
        console.log(req.body);
        if (req.body.password !== req.body.Confirm_password){
            return res.redirect('back');
        }

        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            const newUser = await User.create({
                email: req.body.email,
                password: req.body.password,
                name: req.body.name
            });
            return res.redirect('/users/sign-in');
        } else {
                      return res.redirect('back');
        }
    } catch (err) {
        console.log('Error in signing up:', err);
       
    }}
//sign in and create a session for the user
// module.exports.createSession= async function(req,res)
// {
    
//     //steps to authenticate
//     try{
//    //find the user 
//    const user = await User.findOne({ email: req.body.email });
   
//    //handle user found
//    if (user) {
//     //handle password which doesn't match
//     if(user.password!=req.body.password)
//     {
//         return res.redirect('back');
//     }

//     //handle session creation
//     res.cookie('user_id',user.id);
//     return res.redirect('/users/profile');

//    }
//    else
//    {
//     //handle user is not found
//     return res.redirect('back');

//    } 
// }
// catch (err) {
//     console.log('Error in signing In:', err);
   
// }}


module.exports.createSession=function(req,res)
{
    return res.redirect('/');
}
module.exports.signOut = async function(req, res) {
    try {
        // Clear the user_id cookie to sign the user out
        res.clearCookie('user_id');

        // Redirect to a sign-in page or any other appropriate page
        return res.redirect('/users/sign-in');
    } catch (err) {
        console.error('Error in signing out:', err);
        return res.redirect('/'); // Redirect to a general error page if needed
    }
};