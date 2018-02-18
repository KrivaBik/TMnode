const express =require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
var User=require('../modles/user');

router.get('/register', function (req,res) {
    res.render('register');
});

router.post('/register', function (req,res) {
    const name=req.body.name;
    const email=req.body.email;
    const username=req.body.username;
    const password=req.body.password;
    const password2=req.body.password2;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'email is required').notEmpty();
    req.checkBody('email', 'email is not valid').isEmail();
    req.checkBody('username', 'username is required').notEmpty();
    req.checkBody('password', 'password is required').notEmpty();
    req.checkBody('password2', 'password2 is required').equals(req.body.password);

    let errors=req.validationErrors();
    if(errors){
        res.render('register',{
                errors:errors
        });
    }else {
let newUser=new User({
    name:name,
    email:email,
    username:username,
    password:password
});
bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(newUser.password, salt, function (err,hash) {
        if(err){
            console.log(err);
        }
        newUser.password=hash;
        newUser.save(function (err) {
            if(err){
                console.log(err);
            }else {
                req.flash('success','you are now registered and canlog in');
                res.redirect('/users/login');
            }
        });
    });
});

    }

});

router.get('/login',function (req,res) {
   res.render('login');
});

module.exports=router;