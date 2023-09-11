const Post = require('../models/post');
const { populate } = require('../models/user');
const User=require('../models/user');

module.exports.home = async function (req, res) {
    try {
        //change:: populate the likes of each post and comment
        const posts = await Post.find({})
        .sort('-createdAt')
        .populate({
            path: 'user',
            select: '-password' // Exclude the password field from the user data
        })
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            },
            populate:{
                path:'likes'
            }
        }).populate('likes');
        
    

        const users = await User.find({}).exec(); // Assuming User is your Mongoose model for users

        return res.render('home', {
            title: "Codeial | Home",
            posts: posts,
            all_users: users
        });
    } catch (err) {
        console.log('error in finding posts', err);
        return res.status(500).send('Internal Server Error');
    }
};
