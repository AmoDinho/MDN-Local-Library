//Genre Controller

var Genre = require('../models/genre');
var Book = require('../models/book');


var async = require('async');


const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

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
     res.render('genre_form' , {title: 'Create Genre'});
};

//Handle genre create on POST
exports.genre_create_post = [

    //validate the name field is not empty
    body('name' , 'Genre name required').isLength({min:1}).trim(),

    //Sanitize the name field
    sanitizeBody('name').trim().escape(),

    //process request after validation and sanitization
    (req,res, next) =>{
        //extract the validation errors from a request.

        const errors = validationResult(req);

        //create a genre object with escaped and trimmed data
        var genre = new Genre(
            {name : req.body.name}
        );

        if (!errors.isEmpty()) {
            //There are errors. Render the form again wiht sanitized values/error messages.
            res.render('genre_form', {title: 'Create Genre', genre: genre, errors:errors.array()});
        return;
        }
        else{
            //Data from form is valid.
            //check if Genre with same name already exists.
            Genre.findOne({'name' : req.body.name})
                .exec( function(err, found_genre) {
                    if (err) {return next(err);}

                    if (found_genre){
                        //Genre exists, redirect to its detail page
                        res.redirect(found_genre.url);

                    }

                    else{
                        genre.save(function (err){
                            if (err) {return next(err);}
                            //Genre saveed! Redirect to genre detail pae
                            res.redirect(genre.url);
                        });
                    }
                });
        }
    }
];

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