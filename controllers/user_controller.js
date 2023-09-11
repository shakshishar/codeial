const express = require('express');
const User=require('../models/user');

const fs=require('fs');
const path=require('path');

// module.exports.profile = async function(req, res) {
//     try {
//         if (req.cookies && req.cookies.user_id) {
//             console.log(req.cookies);
//             console.log('User ID from cookie:', req.cookies.user_id);
            
//             const hexRegex = /^[0-9a-fA-F]{24}$/;
//             if (hexRegex.test(req.cookies.user_id)) {
//                 const user = await User.findById(req.cookies.user_id);
//                 if (user) {
//                     return res.render('user_profile', {
//                         title: "User Profile",
//                         profile_user: user
//                     });
//                 }
//             }
//             return res.redirect('/users/sign-in');
//         } else {
//             return res.redirect('/users/sign-in');
//         }
//     } catch (err) {
//         console.error('Error in user profile:', err);
//         return res.redirect('/users/sign-in');
//     }
// };

module.exports.profile = async function (req, res) {
    try {
        const user = await User.findById(req.params.id).exec();

        return res.render('user_profile', {
            title: "User Profile",
            profile_user: user
        });
    } catch (err) {
        console.log("Error in finding user:", err);
        return res.redirect('/');
    }
};

module.exports.update = async function(req, res) {
    if (req.user.id == req.params.id) {
        try {
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, async function(err) {
                if (err) {
                    console.log('*********multer Error:', err);
                }

                user.name = req.body.name;
                user.email = req.body.email;
                if (req.file) {
                    if (user.avatar) {
                        const avatarPath = path.join(__dirname, '..', user.avatar);
                        if (fs.existsSync(avatarPath)) {
                            fs.unlinkSync(avatarPath);
                        }
                    }
                    // Update the user's avatar field with the correct path
                    user.avatar = User.avatar_path + '/' + req.file.filename;
                }
                
                
                // Save the user object
                await user.save();

                req.flash('success', 'Updated!');
                return res.redirect('back');
            });
        } catch (err) {
            req.flash('error', err);
            return res.redirect('back');
        }
    } else {
        req.flash('error', 'Unauthorized');
        return res.status(401).send('Unauthorized');
    }
};
//render the sign up page
module.exports.signUp=function(req,res)
{
    if(req.isAuthenticated())
    {
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up',{
        title:"Codeial | Sign Up"
    })
}

//render the sign in page
module.exports.signIn=function(req,res)
{
    if(req.isAuthenticated())
    {
        return res.redirect('/users/profile');
    }
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
// module.exports.createSession = async function(req, res) {
//     try {
//         // Find the user
//         const user = await User.findOne({ email: req.body.email });

//         // Handle user found
//         if (user) {
//             // Handle password mismatch
//             if (user.password !== req.body.password) {
//                 return res.redirect('back');
//             }

//             // Handle session creation
//             res.cookie('user_id', user.id);
//             return res.redirect('/'); // Redirect to the home page

//         } else {
//             // Handle user not found
//             return res.redirect('back');
//         }
//     } catch (err) {
//         console.log('Error in signing In:', err);
//     }
// };



module.exports.createSession=function(req,res)
{
    req.flash('success','Logged in Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res) {
    req.logout((err) => {
        if (err) {
            // Handle the error here
            console.log(err);
            return;
        }
        req.flash('success','You have Logged Out!');
        return res.redirect('/');
    });
}