//Genre Controller

var Genre = require('../models/genre');

//Display list of genre
exports.genre_list = function(req,res){
    Genre.find()
    .sort([['name','ascending']])
    .exec(function (err,list_genres){
        if(err) {return next(err);}
        //Succesfful render
        res.render('genre_list', {title:'Genre List', list_genres:list_genres});

    });
};

//display detail page for an genre
exports.genre_detail = function(req,res){
    res.send('genre details' + req.params.id);
};

//Display genre create form on GET
exports.genre_create_get = function(req,res){
    res.send('genre create get');
};

//Handle genre create on POST
exports.genre_create_post = function(req,res){
    res.send('genre create_post');
};

//Display genre delete form on GET
exports.genre_delete_get = function(req,res){
    res.send('genre delte get');
};


//handle genre delete on post
exports.genre_delete_post = function(req,res){
    res.send('genre delete post');
};

//Display genre update form on get
exports.genre_update_get = function(req,res){
    res.send('genre update_get');
};

//handle genre update on Post
exports.genre_update_post = function(req,res){
    res.send('genre update post');
};