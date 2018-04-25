//Author Controller

var Author = require('../models/author');
var async = require('async');
var Book = require('../models/book');


const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

//Display list of authors
exports.author_list = function(req,res){

    Author.find()
       .sort([['family_name','ascending']])
       .exec(function (err,list_authors){
           if(err) {return next(err);}
           //Succesfful render
           res.render('author_list', {title:'Author List', author_list:list_authors});

       });

};

//display detail page for an author
exports.author_detail = function(req,res){

//Asyn function
async.parallel({
  author: function(callback){
    Author.findById(req.params.id)
      .exec(callback)
  },
author_books:function(callback){
 Book.find({'author' : req.params.id }, 'title summary')
  .exec(callback)
},
}, function(err,results){
    if(err) {return next(err);} //Error in API usage
    if (results.author == null) {
        //Nothing to show
        var err = new Error('Author not found');
        err.status = 404;
        return next(err);

    }
    //Success! We can now show the page with the data
    res.render('author_detail', {title: 'Author Detail', author:results.author,author_books: results.author_books});

});


};

//Display Author create form on GET
exports.author_create_get = function(req,res){
   res.render('author_form', {title:'Create Author'});

};

//Handle Auhtor create on POST
exports.author_create_post = [


    //Validate Fields
    body('first_name').isLength({min:1}).trim().withMessage('First Name must be specified')
      .isAlphanumeric().withMessage('First name has non - alphanumeric characters'),
    body('family_name').isLength({min:1}).trim().withMessage('family name must be specified.')
    .isAlphanumeric().withMessage('First name has non - alphanumeric characters'),
    body('date_of_birth', 'Invalid date of birth').optional({checkFalsy: true}).isISO8601(),
    body('date_of_death', 'Invalid date of birth').optional({checkFalsy: true}).isISO8601(),
 
    //Sanitize fields
    sanitizeBody('first_name').trim().escape(),
    sanitizeBody('family_name').trim().escape(),
    sanitizeBody('date_of_birth').toDate(),
    sanitizeBody('date_of_death').toDate(),

    ///Process request after validation and sanitization
    (req, res, next) =>{

        //Extract the validation errors from a request
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            //There are errors RENDER form again with sanitized values/erros messages
            res.render('author_form', {title: 'Create Author', author:req.body, errors: errors.array()});
            return;
        }
        else{
            //Data from form is valid.

            //Create an Author object with escaped and trimmed data
            var author = new Author(
                {
                    first_name: req.body.first_name,
                    family_name: req.body.family_name,
                    date_of_birth: req.body.date_of_birth,
                    date_of_death: req.body.date_of_death
                
                });
                author.save(function(err){
                    if (err) {return next(err);}
                    //successful - redirct to new author record
                    res.redirect(author.url);
                });
        }
    }

];

//Display Author delete form on GET
exports.author_delete_get = function(req,res){


    //Async Function
    async.parallel({
        author: function(callback){
            Author.findById(req.params.id).exec(callback)
        },
        authors_books: function(callback){
            Book.find({'author': req.params.id}).exec(callback)
        },
    }, function(err,results){
        if(err) { return next(err);}
    if (results.author ==null){
    //no results
    res.redirect('/catalog/authors');
    }
    //Successful so render.
    res.render('author_delete', {title: 'Delete AUthor', author: results.author, author_books: results.authors_books});
    });
};


//handle Delete author on post
exports.author_delete_post = function(req,res){

    async.parallel({
        author: function(callback){
          Author.findById(req.body.authorid).exec(callback)
        },
        authors_books: function(callback){
            Book.find({'author': req.body.authorid}).exec(callback)
        },
    }, function(err, results){
        if(err) {return next(err);}
        //Success
        if (results.authors_books.length > 0){
            //Author has books render in same way as GET route.

            res.render('authors_delete', {title:'Delete Author', author: results.author, author_books: results.author_books});
            return;
        }
        else{
            //Author has no books. DELETE OBJECT and redirect to the list of authors
            Author.findByIdAndRemove(req.body.authorid, function deleteAuthor(err){
                if (err){ return next(err);}
                //success go to authormlist
                res.redirect('/catalog/authors')
            })
        }
    


    });

};

//Display Author update form on get
exports.author_update_get = function(req,res){
    res.send('Author update_get');
};

//handle author update on Post
exports.author_update_post = function(req,res){
    res.send('Author update post');
};