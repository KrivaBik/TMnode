const express =require('express');
const router=express.Router();
let Article=require('../modles/article');
let User=require('../modles/user');

router.get('/add', ensureAuthenticated, function(req, res){
    res.render('add_article',{
        title:'hello GENA CHMO'
    });
});


router.get('/edit/:id', ensureAuthenticated, function (req,res) {
    Article.findById(req.params.id,function (err,article) {
        if(article.author!=req.user._id){
            req.flash('danger', 'not autorized');
            res.redirect('/')
        }
            res.render('edit_article',{
                title:"edit",
                article:article
            });

    });
});
router.post('/add', function(req, res){
    req.checkBody('title', 'title is').notEmpty();
    // req.checkBody('author', 'title is').notEmpty();
    req.checkBody("body", 'title is').notEmpty();

    var errors=req.validationErrors();

    if(errors){
        res.render('add_article', {
            title:'Add article',
            errors:errors
        })
    }else {
        var article = new Article();
        article.title = req.body.title;
        article.author = req.user._id;
        article.body = req.body.body;

        article.save(function (err) {
            if (err){
                console.log(err);
                return;
            }else {
                req.flash('success','article added')
                res.redirect("/");
            }

        })
    }


});
router.post('/edit/:id', function(req, res){
    var article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    var query={_id:req.params.id};
    Article.update(query, article, function (err) {
        if (err){
            console.log(err);
            return;
        }else {
            res.redirect("/");
        }

    });
});
router.delete('/:id', function (req, res) {
    if(!req.user._id){
        res.status(500).send();
    }
    let query={_id:req.params.id};
    Article.findById(req.params.id, function (err, article) {
        if(article.author!==req.user._id){
            res.status(500).send();
        }else {
            Article.remove(query, function (err) {
                if(err){
                    console.log(err);
                }
                res.send("success");
            });
        }
    });
});
router.get('/:id',function (req,res) {
    Article.findById(req.params.id,function (err,article) {
        User.findById(article.author,function (err,user) {
            res.render('article',{
                article:article,
                author: user.name
            });
    });
    });
});

function ensureAuthenticated(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }else {
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }
}

module.exports=router;