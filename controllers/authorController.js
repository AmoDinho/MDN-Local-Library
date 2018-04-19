//Author Controller

var Author = require('../models/author');

//Display list of authors
exports.author_list = function(req,res){
    res.send('Author List');
};

//display detail page for an author
exports.author_detail = function(req,res){
    res.send('Author details');
};

//Display Author create form on GET
exports.author_create_get = function(req,res){
    res.send('Author create get');
};

//Handle Auhtor create on POST
exports.author_create_post = function(req,res){
    res.send('Author create_post');
};

//Display Author delete form on GET
exports.author_delete_get = function(req,res){
    res.send('Author delte get');
};


//handle author on post
exports.author_delete_post = function(req,res){
    res.send('Author delete post');
};

//Display Author update form on get
exports.author_update_get = function(req,res){
    res.send('Author update_get');
};

//handle author update on Post
exports.author_update_post = function(req,res){
    res.send('Author update post');
};