//Catalog JS

var express = require('express');
var router = express.Router();

//Require controller modules
var book_controller = require('../controllers/bookController');
var author_controller = require('../controllers/authorController');
var genre_controller = require('../controllers/genreController');
var book_instance_controller = require('../controllers/bookinstanceController');



/// Book Routes ///

//GET catalog home page
router.get('/', book_controller.index);

//get request for creating book [Allways before routes that display books]
router.get('/book/create',  book_controller.book_create_get);

//Post  request for creating Book
router.post('/book/create', book_controller.book_create_post);

//GET REQUEST TO DELETE BOOK
router.get('/book/:id/delete', book_controller.book_delete_get);

//Post request to delete book
router.post('/book/:id/delete',book_controller.book_delete_post);

//Get request to update Book
router.get('/book/:id/update', book_controller.book_update_get);

//Post Request to update book
router.post('/book/:id/update', book_controller.book_update_post);

//Get Request for one book
router.get('/book/:id', book_controller.book_detail);

//GET REQUEST FOR LIST OF ALL BOOK ITEMS
router.get('/books', book_controller.book_list);

///Author Routes ///
//Get request for creating authors
router.get('/author/create', author_controller.author_create_get);

//Post request for create Author
router.post('/author/create', author_controller.author_create_post);

//Get request to delete author
router.get('/author/:id/delete', author_controller.author_delete_get);

//Post Request to delete author
router.post('/author/:id/delete', author_controller.author_delete_post);

//Get request to update author
router.get('/author/:id/update', author_controller.author_update_get);

//Post request to update author
router.post('/author/:id/update', author_controller.author_update_post);


//GET request for one author
router.get('/author/:id', author_controller.author_detail);

//Post request for list of all authors
router.get('/authors', author_controller.author_list);


/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get('/genre/create', genre_controller.genre_create_get);

//POST request for creating Genre.
router.post('/genre/create', genre_controller.genre_create_post);

// GET request to delete Genre.
router.get('/genre/:id/delete', genre_controller.genre_delete_get);

// POST request to delete Genre.
router.post('/genre/:id/delete', genre_controller.genre_delete_post);

// GET request to update Genre.
router.get('/genre/:id/update', genre_controller.genre_update_get);

// POST request to update Genre.
router.post('/genre/:id/update', genre_controller.genre_update_post);

// GET request for one Genre.
router.get('/genre/:id', genre_controller.genre_detail);

// GET request for list of all Genre.
router.get('/genres', genre_controller.genre_list);

/// BOOKINSTANCE ROUTES ///

// GET request for creating a BookInstance. NOTE This must come before route that displays BookInstance (uses id).
router.get('/bookinstance/create', book_instance_controller.bookinstance_create_get);

// POST request for creating BookInstance. 
router.post('/bookinstance/create', book_instance_controller.bookinstance_create_post);

// GET request to delete BookInstance.
router.get('/bookinstance/:id/delete', book_instance_controller.bookinstance_delete_get);

// POST request to delete BookInstance.
router.post('/bookinstance/:id/delete', book_instance_controller.bookinstance_delete_post);

// GET request to update BookInstance.
router.get('/bookinstance/:id/update', book_instance_controller.bookinstance_update_get);

// POST request to update BookInstance.
router.post('/bookinstance/:id/update', book_instance_controller.bookinstance_update_post);

// GET request for one BookInstance.
router.get('/bookinstance/:id', book_instance_controller.bookinstance_detail);

// GET request for list of all BookInstance.
router.get('/bookinstances', book_instance_controller.bookinstance_list);

module.exports = router;