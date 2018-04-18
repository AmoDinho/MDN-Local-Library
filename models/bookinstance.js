//Book Instance Model

var mongoose = require('mongoose');

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

//Export
module.exports = mongoose.model('BookInstance', BookInstanceSchema);

