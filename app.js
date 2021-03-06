var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalogRouter = require('./routes/catalog')
var helmet = require('helmet');
var app = express();

app.use(helmet());
//Mongoose Setup
//Import the module


var mongoose = require('mongoose');


//set up default mongoose connection
var dev_db_url = 'mongodb://newuser:sony@ds249079.mlab.com:49079/local_library'
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);

//Get Mongose to use global promise library
mongoose.Promise = global.Promise;
//get the default connection
var db = mongoose.connection;

//bind connection to error event
db.on('error', console.error.bind(console, 'MongoDB connecntion error:'));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
