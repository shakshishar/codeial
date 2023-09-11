const Post=require('../../../models/post');
const Comment=require('../../../models/comment');
module.exports.index=async function(req,res){
   

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
        }
    });
    return res.json(200,{
        message:"List of Posts",
        posts:posts
    })
}

module.exports.destroy = async function (req, res) {
    try {
        // Find the post by ID and delete it
        const result = await Post.deleteOne({ _id: req.params.id });

        // Check if the post was deleted successfully
        if (result.deletedCount === 0) {
            return res.json(400, {
                message: "Post cannot be deleted or does not exist"
            });
        }

        // Delete associated comments
        await Comment.deleteMany({ post: req.params.id });

        return res.json(200, {
            message: "Post and associated comments deleted successfully!"
        });
      
    } catch (err) {
        // Handle error
        console.log('****', err);
        return res.json(500, {
            message: "Internal Server Error"
        });
    }
};

