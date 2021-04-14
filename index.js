const express =require('express');
const session=require ('express-session');
const passport=require('passport');
const app=express();
const port=process.env.port ||3000;
app.set('view engine','ejs');

const GoogleStrategy=require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID="784304260318-u6ajbn494iqjqfij1egutcrmrgha03h2.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET="mI0vyfms0yuX8vZUK4ZABH1Q";


app.use(session({
    secret :'kuch be',
    saveUninitialized:true,
    resave:'secret',
}));

app.use (passport.initialize());
app.use(passport.session());

app.get('/',(req,res) =>{
    res.render('../view/pages/auth');
});


app.get('/sucess',(req,res) =>{
    res.send('userProfile')
});
app.get('/error',(req,res)=>{
    res.send('error in logging')
});

passport.serializeUser(function(user,cb){
    cb(null,user);
})
passport.deserializeUser(function(obj,cb){
    cb(null,obj);
})

passport.use(new GoogleStrategy({
    clientID:GOOGLE_CLIENT_ID,
    clientSecret:GOOGLE_CLIENT_SECRET,
    callbackURL:"http://localhost:3000/auth/google/callback"
},
function(accessToken,refreshToken,profile,done){
    userProfile=profile;
    return done(null,userProfile);
}
));
app.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}))

app.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/error'}),
function(req,res){
    res.redirect('/sucess');
}
)

app.listen(port,() =>{
    console.log('app listining on http://localhost:'+port)

});