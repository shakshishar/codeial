const nodeMailer=require('../config/nodemailer');
const User=require('../models/user');
const path = require('path');



//this is another way of exporting a method

exports.newComment = async (comment) => {
    
    try {
        let htmlString = nodeMailer.renderTemplate({ comment: comment }, '/comments/new_comments.ejs');

        const user=await User.findById(comment.user);
 
        console.log('Inside newComment mailer', comment);

        await nodeMailer.transporter.sendMail({
            from: 'sakshi123@gmail.com',
            to:user.email,
            subject: 'New Comment Published!',
            html: htmlString
        });

        console.log('Message sent successfully');
    } catch (err) {
        console.log('Error in sending mail', err);
        throw err; // Rethrow the error to handle it in the calling function
    }
};