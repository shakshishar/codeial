const Like=require('../models/like');
const Post=require('../models/post');
const Comment=require('../models/comment');

module.exports.toggleLike=async function(req,res)
{
    try{
        //likes/toggle/?id=abcdef&type=Post

        let Likeable;
        let deleted=false;
        if(req.query.type=='Post')
        {
            Likeable=await Post.findById(req.query.id).populate('likes');
        }
        else
        {
            Likeable=await Comment.findById(req.query.id).populate('likes');
        }

        //check if like already exists
        let existingLike=await Like.findOne({
            Likeable:req.query.id,
            onModel:req.query.type,
            user:req.user._id
        })
        //if a like already exists
        if(existingLike){
            Likeable.likes.pull(existingLike._id);
            Likeable.save();
            existingLike.deleteOne();
            deleted=true;
        }
        else
        {//else make a new like
            let newLike=await Like.create({
                user:req.user._id,
                Likeable:req.query.id,
                onModel:req.query.type
            });

            Likeable.likes.push(newLike._id);
            Likeable.save();
        }
        return res.json(200,{
            message:'Request successful',
            data:{
                deleted:deleted
            }
        })
    }
    catch(err)
    {
        console.log(err);
        return res.json(500,{
            message:'Internal Server Error'
        });

    }
}