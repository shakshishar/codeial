const Post = require('../models/post');
const Comment=require('../models/comment');
const Like = require('../models/like');

module.exports.create = async function (req, res) {
    try {
        const post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        if (req.xhr) {
            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post created!"
            });
        }
        req.flash('success','Post Published!');
        return res.redirect('back');
    } catch (err) {
        req.flash('error',err);
        return res.redirect('back');
    }
}


module.exports.destroy = async function (req, res) {
    try {
        const post = await Post.findById(req.params.id).exec();

        if (!post) {
            return res.redirect('back');
        }

        if (post.user.toString() === req.user.id) {
            //delete the asscoiated likes for the post and all its comments likes too
            await Like.deleteMany({Likeable:post,onModel:'Post'});
            await Like.deleteMany({_id:{$in:post.comments}});
            await Post.deleteOne({ _id: post._id }); // Use deleteOne method
            await Comment.deleteMany({ post: req.params.id });

            if(req.xhr)
            {
                return res.status(200).json({
                    data:{
                        post_id:req.params.id
                    },
                    message:"post deleted"
                })

            }
            req.flash('success','Post and associated comments deleted!');
            return res.redirect('back');
        } else {
            req.flash('error','You can not delete this post!');
            return res.redirect('back');
        }
    } catch (err) {
        // Handle error
        req.flash('error',err);  
        return res.redirect('back');
    }
};