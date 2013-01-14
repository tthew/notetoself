var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema({
    title: {type: String, required: true},
    context: {type: String, required: true},
    selectionText: String,
    pageUrl: {type: String, required: true},
    linkUrl: String, 
    mediaType: {type: String, required: false},
    srcUrl: String,  
    dateCreated: {type: Date, required: true}
});

// Support ID (rather than _ID)
schema.virtual('id')
  .get(function () {
    return this._id.toHexString();
});

// Register Model
mongoose.model('Note', schema); 
var Note = mongoose.model('Note'); 

module.exports = exports = Note;