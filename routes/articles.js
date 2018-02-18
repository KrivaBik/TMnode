const express =require('express');
const router=express.Router();
var Article=require('../modles/article');

router.get('/add', function(req, res){
    res.render('add_article',{
        title:'hello GENA CHMO'
    });
});


router.get('/edit/:id',function (req,res) {
    Article.findById(req.params.id,function (err,article) {
        if(err){
            console.log(err);
        }else {
            res.render('edit_article',{
                title:"edit",
                article:article
            });
        }
    });
});
router.post('/add', function(req, res){
    req.checkBody('title', 'title is').notEmpty();
    req.checkBody('author', 'title is').notEmpty();
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
        article.author = req.body.author;
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
    var query={_id:req.params.id};

    Article.remove(query, function (err) {
        if(err){
            console.log(err);
        }
        res.send("success");

    });
});
router.get('/:id',function (req,res) {
    Article.findById(req.params.id,function (err,article) {
        if(err){
            console.log(err);
        }else {
            res.render('article',{
                article:article
            });
        }
    });
});

module.exports=router;