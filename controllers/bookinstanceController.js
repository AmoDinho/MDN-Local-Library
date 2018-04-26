//bookinstance Controller


var BookInstance = require('../models/bookinstance');
var Book = require('../models/book');
var async = require('async');

//Sanitization modules
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


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

//Query
   BookInstance.findById(req.params.id)
      .populate('book')
      .exec(function (err,bookinstance){
          if (err) {return next(err);}
          if (bookinstance == null){
              var err = new Error('Book copy not found');
              err.status =404;
              return next(err);
          }
          //Succesful Render
          res.render('bookinstance_detail', {title:'Book', bookinstance: bookinstance});
      })

};

//Display bookinstance create form on GET
exports.bookinstance_create_get = function(req,res){
    
    Book.find({}, 'title')
     .exec(function (err,books){
         if (err) {return next(err);}
         //SUccessfull so render
         res.render('bookinstance_form', {title: 'Create Book Instance ', book_list:books});
     });
};


//Handle bookinstance create on POST
exports.bookinstance_create_post = [

    //Validate fields
    body('book', 'Book must be specified').isLength({min:1}).trim(),
    body('imprint', 'Imprint must be specified').isLength({min:1}).trim(),
    body('due back', 'Invalid Date').optional({checkFalsy: true}).isISO8601(),

    //Sanitize fields
    sanitizeBody('book').trim().escape(),
    sanitizeBody('imprint').trim().escape(),
    sanitizeBody('status').trim().escape(),
    sanitizeBody('due_back').toDate(),

    //Process request after validation and sanitization
    (req, res, next) => {

        //Extract the validation errors from a request
        const errors = validationResult(req);

        //Create a bookinstance object with escaped and trimmed data
        var bookinstance = new BookInstance({
            book: req.body.book,
            imprint: req.body.imprint, 
            status: req.body.status,
            due_back: req.body.due_back
        });



        if (!errors.isEmpty()){
            // THERE ARE NO ERRORS. RENDER FORM AGAIN WITH SANITIZED VALUES AND ERROR MESSAGES
            Book.find({}, 'title')
                .exec( function (err,books){
                    if (err){return next(err);}
                    //Successful so render that mayn!
                    res.render('bookinstance_form', {title: 'create BookInstance', book_list: books, selected_book: bookinstance.book._id, errors: errors.array(), bookinstance:bookinstance});
                });
                return;
        }
        else{
            //Data from form is valid
            bookinstance.save(function (err){
                if (err){return next(err);}
                //succesful redircet to new record
                res.redirect(bookinstance.url);
            });
        }
    }

];

//Display bookinstance delete form on GET
exports.bookinstance_delete_get = function(req,res){
    res.send('bookinstance delte get');
};


//handle bookinstance delete on post
exports.bookinstance_delete_post = function(req,res){
    res.send('bookinstance delete post');
};

//Display bookinstance update form on get
exports.bookinstance_update_get = function(req,res,next){
    
          

                //Get the book, authors and genre from form
                //Async funct
                async.parallel({
                    bookinstance: function(callback){
                        BookInstance.findById(req.params.id)
                        .populate('book')
                        .exec(callback)
                    },
                    books: function(callback){
                        Book.find(callback)
                    },
                }, function(err, results){
                    if (err) {return next(err);}
                    if (results.bookinstance==null){
                        //no results
                        var err = new Error('Book copy not found');
                        err.status = 404;
                        return next(err);
                    }
                    //Success
                    res.render('bookinstance_form', {title: 'Update BookInstance', book_list: results.books, selected_book: results.bookinstance.book._id, bookinstance:results.bookinstance});
                
                });

};

//handle bookinstance update on Post
exports.bookinstance_update_post = [

    //Validate fields
    body('book', 'Book must be specified').isLength({min:1}).trim(),
    body('imprint', 'Imprint must be specified').isLength({min:1}).trim(),
    body('due_back', 'Invaild Date').optional({checkFalsy:true}).isISO8601(),

    //Sanitize fields
    sanitizeBody('book').trim().escape(),
    sanitizeBody('imprint').trim().escape(),
    sanitizeBody('status').trim().escape(),
    sanitizeBody('due_back').toDate(),

    //process request after validation and sanitization
    (req,res,next) =>{

        //extract the validation errors from a request
        const errors = validationResult(req);
        
        //Create a bookinstance object with escaped/trimmed data and current ID
        var bookinstance = new BookInstance({
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back,
            _id:req.params.id
        });

        if (!errors.isEmpty()){
            //Threr are errors so render the form again, passing sanitized values and errors
            Book.find({},'title')
              .exec(function(err,books){
                  if (err) {return next(err);}
                  //successful so render
                  res.render('bookinstance_form', {title:'Update BookInstance', book_list: books, selected_book:bookinstance.book._id, errors: errors.array(), bookinstance: bookinstance});

              });
              return;
        }
          else{ 
              //DATA FROM FORM VALID
              BookInstance.findByIdAndUpdate(req.params.id, bookinstance, {}, function (err, thebookinstance){
                  if(err){return next(err);}
                  //Successful 
                  res.redirect(thebookinstance.url);
              });
          }
    }
    
];