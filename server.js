var _ = require('lodash');
var config = require('./config/config');
var restify = require('restify');  
var connect = require('connect');  
var everyauth = require('everyauth');
var bcrypt = require('bcrypt');
var notesController = require("./app/controllers/notes");
var mongoose = require('mongoose');
var db = mongoose.connect(config.credentials.mongoose_auth);

everyauth.debug = true;

var usersById = {};
var nextUserId = 0;

function addUser (source, sourceUser) {
  var user;
  if (arguments.length === 1) { // password-based
    user = sourceUser = source;
    user.id = ++nextUserId;
    return usersById[nextUserId] = user;
  } else { // non-password-based
    user = usersById[++nextUserId] = {id: nextUserId};
    user[source] = sourceUser;
  }
  return user;
}

var usersByTwitId = {};

everyauth.everymodule
  .findUserById( function (id, callback) {
    callback(null, usersById[id]);
  });

everyauth.twitter
    .consumerKey(config.twitter.consumerKey)
    .consumerSecret(config.twitter.consumerSecret)
    .findOrCreateUser( function (sess, accessToken, accessSecret, twitUser) {
      return usersByTwitId[twitUser.id] || (usersByTwitId[twitUser.id] = addUser('twitter', twitUser));
    })
    .redirectPath('/');


var createRestifyServer = function (options) {
    var app = restify.createServer(options);
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

    app.use(restify.bodyParser());
    app.pre(allowCrossDomain);    
    app.get('/notes', notesController.get);
    app.post('/notes', notesController.post);
    app.put('/notes', notesController.post);    
    app.del('/notes/:id', notesController.del);
    // everyauth.helpExpress(app);
    return app;
}

var restifyServer = createRestifyServer({name: config.app.name});

var connectApp = connect()
    .use(connect.cookieParser())
    .use(connect.session({secret: '3}CHvDLA+g7?Yc'}))
    .use(connect.logger())
    .use(connect.bodyParser())
    .use(connect.query())
    .use(connect.static('public'))
    // And this is where the magic happens
    .use("/api", function (req, res) {
             restifyServer.server.emit('request', req, res);
    })
    .use(everyauth.middleware());

connectApp.listen(config.app.port);