//Book Controller

var Book = require('../models/book');

exports.index = function(req,res){
res.send('Site home page');
};

//Display list of book
exports.book_list = function(req,res){
    res.send('book List');
};

//display detail page for an book
exports.book_detail = function(req,res){
    res.send('book details' + req.params.id);
};

//Display book create form on GET
exports.book_create_get = function(req,res){
    res.send('book create get');
};

//Handle book create on POST
exports.book_create_post = function(req,res){
    res.send('book create_post');
};

//Display book delete form on GET
exports.book_delete_get = function(req,res){
    res.send('book delte get');
};


//handle book delete on post
exports.book_delete_post = function(req,res){
    res.send('book delete post');
};

//Display book update form on get
exports.book_update_get = function(req,res){
    res.send('book update_get');
};

//handle genre update on Post
exports.book_update_post = function(req,res){
    res.send('book update post');
};
