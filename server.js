var mongoose = require('mongoose');
var _ = require('lodash');
var config = require('./config');

var db = mongoose.connect(config.credentials.mongoose_auth);
var Schema = mongoose.Schema;



var restify = require('restify');  

// Note Schema
var NoteSchema = new Schema({
    title: {type: String, required: true},
    context: {type: String, required: true},
    selectionText: String,
    pageUrl: {type: String, required: true},
    linkUrl: String, 
    mediaType: {type: String, required: false},
    srcUrl: String,  
    dateCreated: {type: Date, required: true}
});

NoteSchema.virtual('id')
  .get(function () {
    return this._id.toHexString();
  });

// Register Note Model
mongoose.model('Note', NoteSchema); 
var Note = mongoose.model('Note'); 

// GET: /notes
function getNote (req, res, next) {
    Note.find().sort('-dateCreated').execFind(function (arr,data) {
        res.send(data);
    });
}

// POST: /notes
function postNote (req, res, next) {
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
}

// PUT: /notes/:noteId
function putNote (req, res, next) {

}

// DELETE: /notes/:noteId
function deleteNote (req, res, next) {
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



var allowCrossDomain = function (req, res, next) {
    
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
    
      res.send(200);
    }
    else {
      next();
    }
};

var setupServer = function (app) {
    app.use(restify.bodyParser());
    app.pre(allowCrossDomain);    
    app.get('/notes', getNote);
    app.post('/notes', postNote);
    app.put('/notes', postNote);    
    app.del('/notes/:id', deleteNote);
}

var serverOptions = {
    name: config.app.name
};

var server = restify.createServer(serverOptions);
var httpsServer = restify.createServer(_.extend(serverOptions,config.https));

setupServer(server);
setupServer(httpsServer);

server.listen(80, function() {
  console.log('%s listening at %s, love & peace', server.name, server.url);
});

httpsServer.listen(443, function() {
  console.log('%s listening at %s, love & peace', httpsServer.name, httpsServer.url);
});
