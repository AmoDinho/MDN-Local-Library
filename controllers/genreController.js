//Genre Controller

var Genre = require('../models/genre');
var Book = require('../models/book');

var async = require('async');

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
     
    //Async Fucntion
    async.parallel({
      genre: function(callback){
        Genre.findById(req.params.id)
           .exec(callback);
      },
      genre_books: function(callback) {
          Book.find({'genre': req.params.id})
           .exec(callback);
        
      }
    }, function(err, results){
        if (err) {return next(err);}
        if (results.genre == null){ //No RESULTS
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);

        }
        //Successful Render
        res.render('genre_detail', {title: 'Genre Detail', genre: results.genre, genre_books:results.genre_books});
    });
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