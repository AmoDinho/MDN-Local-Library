//Book Instance Model

var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var BookInstanceSchema = new Schema({
    book:{type: Schema.ObjectId, ref: 'Book', required:true}, //reference associated with the book
    imprint: {type: String, required:true},
    status: {type:String, required:true, enum:['Available', 'Maintenece', 'Loaned', 'Reserverd']  ,default:'Maintenance'},
    due_back: {type: Date, default: Date.now}

});


// Virtual for bookinstance's URL
BookInstanceSchema
.virtual('url')
.get(function () {
  return '/catalog/bookinstance/' + this._id;
});

//virtual instance for the date format
BookInstanceSchema
.virtual('due_back_formatted')
.get(function (){
  return moment(this.due_back).format('MMMM Do, YYYY');
});
//Export
module.exports = mongoose.model('BookInstance', BookInstanceSchema);

