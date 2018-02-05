const express =require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser=require('body-parser');



mongoose.connect('mongodb://localhost/nodekb');
var db=mongoose.connection;

db.once('open',function () {
    console.log('connections to MongoDb');
});
db.on('error', function (err) {
    console.log(err);
});
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"public")));

var Article=require('./modles/article');

app.set('views', path.join(__dirname,  'views'));
app.set('view engine', 'pug');

app.get('/', function(req, res){
  Article.find({}, function (err, articles) {
      if (err){
          console.log(err);
      }else {
          res.render('index', {
              title: 'hello vasya ZALUPA',
              articles: articles
          });
      }
  });
});
app.get('/articles/add', function(req, res){
    res.render('add_article',{
        title:'hello GENA CHMO'
    });
});
app.get('/articles/:id',function (req,res) {
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
app.get('/articles/edit/:id',function (req,res) {
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
app.post('/articles/add', function(req, res){
    var article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;
    
    article.save(function (err) {
        if (err){
            console.log(err);
            return;
        }else {
            res.redirect("/");
        }
        
    })
});
app.post('/articles/edit/:id', function(req, res){
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
app.delete('/articles/:id', function (req, res) {
    var query={_id:req.params.id}

    Article.remove(query, function (err) {
        if(err){
            console.log(err);
        }
        res.send("success");
        
    });
    
});

app.listen(3000, function(){
  console.log('s w');
});
