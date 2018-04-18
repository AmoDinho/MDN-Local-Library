//import { mongo } from 'mongoose';

//Author Model

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AuthorSchema = new Schema({
    first_name: {type:String, required:true, max:100},
    family_name: {type:String, required:true, max:100},
    date_of_birth: {type:Date},
    date_of_death: {type:Date},
});

//Authors virtual full name
AuthorSchema
 .virtual('name')
 .get(function() {
return this.family_name + ',' + this.first_name;
 });

 //Authors virtual url
AuthorSchema
.virtual('url')
.get(function() {
return '/catalog/author/' + this._id;
});

//Export the model
module.exports = mongoose.model('Author', AuthorSchema);
