

//contains development and production

const development={
    name:'development',
    asset_path:'./assets',
    session_cokkie_key:'blahsomething',
    db:'codeial_development',
    smtp:{
        service:'gmail',
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        auth:{
            user:'sakshisharma1495@gmail.com',
            pass:'rfycahbkmcquxela'
        }
    },

    google_client_id: "263736104825-1p3t8bc4dj1bbam9ji962lmup089h83m.apps.googleusercontent.com",
    google_client_secret: "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",
    google_call_back_url: "/users/auth/google/callback",
    jwt_secret:'codeial'
}

const production={
    name:'production',
    asset_path:process.env.CODEIAL_ASSET_PATH,
    session_cokkie_key:process.env.CODEIAL_SESSION_COOKIE_KEY,
    db:process.env.CODEIAL_DB,
    smtp:{
        service:'gmail',
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        auth:{
            user:process.env.CODEIAL_GMAIL_USERNAME,
            pass:process.env.CODEIAL_GMAIL_PASSWORD
        }
    },

    google_client_id: process.env.CODEIAL_DBGOOGLE_CLIENT_ID,
    google_client_secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
    google_call_back_url:process.env.CODEIAL_GOOGLE_CALLBACK_RURL,
    jwt_secret:process.env.CODEIAL_JWT_SECRET
}


module.exports=eval(process.env.CODEIAL_ENVIRNOMENT)==undefined?development:eval(process.env.CODEIAL_ENVIRNOMENT);
