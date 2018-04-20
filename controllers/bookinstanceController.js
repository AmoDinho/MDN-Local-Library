//bookinstance Controller


var BookInstance = require('../models/bookinstance');
var Book = require('../models/book');
var async = require('async');
//Display list of bookinstance
exports.bookinstance_list = function(req,res,next){
    BookInstance.find()
    .populate('book')
    .exec(function (err, list_bookinstances) {
      if (err) { return next(err); }
      // Successful, so render
      res.render('bookinstance_list', { title: 'Book Instance List', bookinstance_list: list_bookinstances });
    });
};

//display detail page for an autbookinstancehor
exports.bookinstance_detail = function(req,res){
    res.send('bookinstance details' + req.params.id);
};

//Display bookinstance create form on GET
exports.bookinstance_create_get = function(req,res){
    res.send('bookinstance create get');
};

//Handle bookinstance create on POST
exports.bookinstance_create_post = function(req,res){
    res.send('bookinstance create_post');
};

//Display bookinstance delete form on GET
exports.bookinstance_delete_get = function(req,res){
    res.send('bookinstance delte get');
};


//handle bookinstance delete on post
exports.bookinstance_delete_post = function(req,res){
    res.send('bookinstance delete post');
};

//Display bookinstance update form on get
exports.bookinstance_update_get = function(req,res){
    res.send('bookinstance update_get');
};

//handle bookinstance update on Post
exports.bookinstance_update_post = function(req,res){
    res.send('bookinstance update post');
};