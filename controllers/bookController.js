//Book Controller

var Book = require('../models/book');
var Author = require('../models/author');
var Genre =  require('../models/genre');
var BookInstance = require('../models/bookinstance');


const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

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
exports.book_create_get = function(req,res,next){

    //Get all authors and genres, which we can use for adding to our book.
    async.parallel({
        authors: function(callback){
            Author.find(callback);
        },
        genres: function(callback)
        {
            Genre.find(callback);
        },
    }, function(err, results){
        if (err) { return next(err);}
        res.render('book_form', {title: 'Create Book', authors: results.authors, genres: results.genres});
    
    });

}

//Handle book create on POST
exports.book_create_post = [
    //COnvert the genre to an array.
    (req,res,next) =>{
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre === 'undefined')
            req.body.genre=[];
            else
            req.body.genre=new Array(req.body.genre);
        }
        next();
    },

    //validate fields
    body('title', 'Please supply a title name').isLength({min:1}).trim(),
    body('author', 'Please supply a author name').isLength({min:1}).trim(),
    body('summary', 'Please supply a summary ').isLength({min:1}).trim(),
    body('author', 'Please supply a author name').isLength({min:1}).trim(),
    body('isbn', 'Please supply a ISBN name').isLength({min:1}).trim(),

    //Sanitize fields using wildcard)
    sanitizeBody('*').trim().escape(),


    //process request after validation and sanitization
    (req, res, next) => {

         //Extract validation errors from a request
         const errors = validationResult(req);

         //Create a Book Object with escaped and trimmed data
         var book = new Book(
             {
                 title: req.body.title,
                 author: req.body.author,
                 summary: req.body.summary,
                 isbn: req.body.isbn,
                 genre: req.body.genre
             });

     if (!errors.isEmpty()){
         //There are errors. Render form again with sanitized values/error messages 

         //Get all authors and genres for form
         async.parallel(
             {
                 authors:function(callback){
                     Author.find(callback);
                 },
                 genres: function(callback){
                       Genre.find(callback);
                 },
             }, function(err, results){
                 if(err){ return next(err);}

                 //Mark our selected genres as checked
                 for(let i=0; i< results.genres.Length; i++ ){
                     if (book.genre.indexOf(results.genres[i]._id) > -1){
                         results.genres[i].checked ='true';
                     }
                 }
                 res.render('book_form', { title: 'Create Book', authors: results.authors, genres: results.genres, book: book, errors:errors.array()});
             });
             return;
     }
     else {
         //Data from form is valid. Save Book
         book.save(function (err){
             if(err){ return next(err);}
             //Successful render - redirect to new book record
             res.redirect(book.url);
         });
     }
    }


];

//Display book delete form on GET
exports.book_delete_get = function(req,res, next){
   
};


//handle book delete on post
exports.book_delete_post = [
  

]

//Display book update form on get
exports.book_update_get = function(req,res){
    
    //Aync Function: Get the books and genres for form
    async.parallel({
        book: function(callback){
            Book.findById(req.params.id)
            .populate('author')
            .populate('genre')
            .exec(callback);
        },
        authors: function(callback){
            Author.find(callback);
        },
        genres: function(callback){
            Genre.find(callback);
        },
    }, function(err, results){
        if (err) {return next(err);}
        if (results.book == null){
            //No results
            var err = new Error('Book not found');
            err.status = 404;
            return next(err);
        }
        //Success
        //Mark our selected genres as checked
        for (var all_g_iter = 0; all_g_iter < results.genres.length; all_g_iter++){
            for(var book_g_iter = 0; book_g_iter < results.book.genre.length; book_g_iter++){
                if (results.genres[all_g_iter]._id.toString() == results.book.genre[book_g_iter]._id.toString()){
                    results.genres[all_g_iter].checked ='true';
                }
            }
        }
     res.render('book_form', {title: 'Update Book', authors: results.authors, genres:results.genres , book: results.book});
    });
};

//handle genre update on Post
exports.book_update_post = [
     //Convert the genre to an array

     (req,res,next) =>{
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre === 'undefined')
            req.body.genre =[];
            else
            req.body.genre = new Array(req.body.genre);
        }
        next();
   },


   //validate fields
   body('title', 'title must not be empty').isLength({min:1}).trim(),
   body('author', 'author must not be empty').isLength({min:1}).trim(),
   body('summary', 'summary must not be empty').isLength({min:1}).trim(),
   body('isbn', 'title must not be empty').isLength({min:1}).trim(),

  //Sanitize Fields
  sanitizeBody('title').trim().escape(),
  sanitizeBody('author').trim().escape(),
  sanitizeBody('summary').trim().escape(),
  sanitizeBody('isbn').trim().escape(),
  sanitizeBody('genre.*').trim().escape(),


  //Process request after validation and sanitization
  (req,res,next) => {

    //extract the validation errors from a request
    const errors = validationResult(req);

    //create a book object with escaped/trimed data and old id
    var book = new Book(
        {title: req.body.title,
        author: req.body.author,
        summary: req.body.summary,
        isbn: req.body.isbn,
        genre: (typeof req.body.genre === 'undefined') ? [] : req.body.genre,
        _id: req.params.id//This is required or a new ID will be assigned
        });

        if (!errors.isEmpty()){
            //There are errors Render the form again with sanitized values/error messages

            //Gett all the authors and genres for the form

        //async funct
        async.parallel({
            authors: function (callback){
                Author.find(callback);
            },
            genres: function(callback){
                Genre.find(callback);
            },
        }, function(err, results){
            if (err) {return next(err);}

            //MARK OUR SELECTED GENRES AS CHECKED
            for (let i =0;i<results.genres.length; i++){
                if (book.genre.indexOf(results.genres[i]._id) > -1){
                    results.genres[i].checked = 'true';
                }
            }
        res.render('book_form', {title: 'Update Book', authors: results.authors, genres: results.genres, book: book, errors: errors.array()});
        });
        return;
        }
        else{
            // Data from form is valid update the record
            Book.findByIdAndUpdate(req.params.id, book, {}, function (err, thebook){
                if (err){return next(err);}
                //Successful so render that 
                res.redirect(thebook.url);
            });
        }
  }
];
