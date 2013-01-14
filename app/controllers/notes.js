var Note = require('../models/note');

var controller = {
    // GET: /notes
    "get": function (req, res, next) {
        console.dir(req);
        if (req) {
            res.send(Note.find(req.route.param.id).execFind(function (arr, data) {
                if (data) {
                    res.send(data);
                } else {
                    res.send(404,[]);
                }
                
            }))
            return;
        } else {
            Note.find().sort('-dateCreated').execFind(function (arr,data) {
                res.send(data);
            });
        }

        
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
        if (req.param('id')) {
            console.log(req.param('id'));
            Note.remove(req.param('id'), function (err) {
                if (err) return handleError(err);
                res.send(204);
                return next();
            });
        } else {
            res.send(501);
        }
    }
};


module.exports = exports = controller;

