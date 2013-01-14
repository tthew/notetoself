var mongoose = require("mongoose");
var Schema = mongoose.Schema;
// Note Schema
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

schema.virtual('id')
  .get(function () {
    return this._id.toHexString();
});

exports = schema;