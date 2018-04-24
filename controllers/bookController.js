//Book Controller

var Book = require('../models/book');
var Author = require('../models/author');
var Genre =  require('../models/genre');
var BookInstance = require('../models/bookinstance');

var async = require('async');

//Site Home PAGE
exports.index = function(req, res,next){


    /*Do something smaller
     Total books
    */
     
//Async Function
async.parallel({
     book_count: function(callback){
         Book.count({}, callback);
     },
     book_instance_count: function(callback){
         BookInstance.count({}, callback);
     },
     book_instance_available_count: function(callback) {
        BookInstance.count({status:'Available'}, callback);
    },
     author_count:  function(callback){
         Author.count({}, callback);
     },
     genre_count: function(callback){
         Genre.count({}, callback);
     }, 
     
    }, function(err, results) {
        //console.log('working');
        res.render('index', {title:'Local Library Home', error: err, data: results});
     });

//res.send('Site Home Page');

//res.render('index',{title:'page'})

};

//Display list of book
exports.book_list = function(req,res, next){

Book.find({}, 'title author')
    .populate('author')
    .exec(function(err,list_books){
        if(err){return next(err);}
        res.render('book_list', {title:'Book List',book_list:list_books});
    });

};

//display detail page for an book
exports.book_detail = function(req,res){
    
    //Async Fucntion

  async.parallel({
      book: function(callback){

        Book.findById(req.params.id)
           .populate('author')
           .populate('genre')
           .exec(callback);
      },
      book_instance: function(callback){
          BookInstance.find({'book': req.params.id})
          .exec(callback);
      },
    }, function(err,results){
        if (err) {return next(err);}
        if (results.book == null){
            //No results
            var err = new Error('book not found');
            err.status = 404;
            return next(err);
        }
        //Successful render
        res.render('book_detail', {title:'Book Results', book:results.book, book_instances: results.book_instance});
    

  });
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
