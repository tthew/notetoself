var noteSchema = require("../schemas/note");
var mongoose = require("mongoose");
// Register Note Model
mongoose.model('Note', noteSchema); 
var Note = mongoose.model('Note'); 

module.exports = {
    // GET: /notes
    "get": function (req, res, next) {
        Note.find().sort('-dateCreated').execFind(function (arr,data) {
            res.send(data);
        });
    },

    // POST: /notes
    "post": function (req, res, next) {
        var note = new Note();
        note.title = req.params.title;
        note.context = req.params.context;
        note.dateCreated = req.params.dateCreated;  
        note.pageUrl = req.params.pageUrl || '';
        note.linkUrl = req.params.linkUrl || '';
        note.srcUrl = req.params.srcUrl || '';
        note.selectionText = req.params.selectionText || '';

        note.save(function () {
            res.send(req.body);
        });
    },

    // PUT: /notes/:noteId
    "put": function (req, res, next) {

    },

    // DELETE: /notes/:noteId
    "del": function (req, res, next) {
        if (req.params.id) {
            console.log(req.params.id);
            Note.remove(req.params.id, function (err) {
                if (err) return handleError(err);
                res.send(204);
                return next();
            });
        } else {
            res.send(501);
        }
    }
};

