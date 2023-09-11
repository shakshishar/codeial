const mongoose = require('mongoose');
const Comment = require('../models/comment');
const Post = require('../models/post');
const Like=require('../models/like');
const commentsMailer = require('../mailers/comments_mailer');
const queue=require('../config/kue');
const commentEmailWorker=require('../workers/comment_email_worker');



module.exports.create = async function (req, res) {
    try {
        const post = await Post.findById(req.body.post).exec();

        if (post) {
            const comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            await post.save();

            // Send email notification
            // await commentsMailer.newComment(comment);
            let job= queue.create('emails', comment).save(function (err) {
                if (err) {
                    console.log('error in creating a queue',Error);
                    return;
                }
                console.log('job enqueued',job.id);
            });

            req.flash('success', 'Commented!');
            return res.redirect('/');
        }
    } catch (err) {
        req.flash('error', err.message);
        return res.redirect('back');
    }
};

module.exports.destroy = async function (req, res) {
    try {
        const comment = await Comment.findById(req.params.id).exec();

        if (!comment) {
            return res.redirect('back');
        }

        if (comment.user.toString() === req.user.id) {
            const postId = comment.post;
            await Comment.deleteOne({ _id: comment._id });
            await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });
            await Like.deleteMany({Likeable:comment._id,onModel:'Comment'});

            req.flash('success', 'Comment Deleted!');
            return res.redirect('back');
        } else {
            req.flash('error', 'You cannot delete this comment!');
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error', err.message);
        return res.redirect('back');
    }
};
