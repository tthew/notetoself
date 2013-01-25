var Server = function() {

    //  Check for NODE_ENV environment variable or set a sensible default.
    var NODE_ENV = process.env.NODE_ENV || "development";

    var express = require('express')
    , User = require('./core/models/user')
    , usersController = require('./core/controllers/users')
    , http = require('http')
    , path = require('path')
    , mongoose = require('mongoose')
    , passport = require('passport')
    , TwitterStrategy = require('passport-twitter').Strategy
    , config = require('./app/config/config');

    var app = express();

    passport.serializeUser(function(user, done) {
      done(null, user.uid);
    });

    passport.deserializeUser(function(uid, done) {
      User.findOne({uid: uid}, function (err, user) {
        done(err, user);
      });
    });

    passport.use(new TwitterStrategy({
        consumerKey: config.services.twitter.consumerKey,
        consumerSecret: config.services.twitter.consumerSecret,
        callbackURL: "http://notetoself.com:3000/auth/twitter/callback"
        },
        function(token, tokenSecret, profile, done) {
            usersController.findOrCreate(profile.id, profile, function(user) {
                console.log("USER:");
                console.log(user);
                done(null, user);
            });
        }
    ));

    app.configure(function(){
        app.set('port', process.env.PORT || config.port);
        app.set('views', __dirname + '/app/views');
        app.set('view engine', 'jade');
        app.use(express.static(path.join(__dirname, 'public')));
        app.use(express.favicon());
        app.use(express.logger('dev'));
        app.use(express.cookieParser());        
        app.use(express.bodyParser());
        app.use(express.session({secret: 'omnomnom'}));
        // app.use(express.methodOverride());
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(app.router);
        
    });

    app.configure('development', function(){
        app.use(express.errorHandler());
    });

    app.get('/', function(req, res){
      res.render('index', { user: req.user });
  });

    app.get('/login', function(req, res){
      res.render('login', { user: req.user });
  });

    // GET /auth/twitter
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  The first step in Twitter authentication will involve redirecting
    //   the user to twitter.com.  After authorization, the Twitter will redirect
    //   the user back to this application at /auth/twitter/callback
    app.get('/auth/twitter',
      passport.authenticate('twitter'),
      function(req, res){
        // The request will be redirected to Twitter for authentication, so this
        // function will not be called.
    });

    // GET /auth/twitter/callback
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  If authentication fails, the user will be redirected back to the
    //   login page.  Otherwise, the primary route function function will be called,
    //   which, in this example, will redirect the user to the home page.
    app.get('/auth/twitter/callback', 
      passport.authenticate('twitter', { failureRedirect: '/login' }),
      function(req, res) {
        res.redirect('/');
    });

    app.get('/logout', function(req, res){
      req.logout();
      res.redirect('/');
  });    

    // Simple route middleware to ensure user is authenticated.
    //   Use this route middleware on any resource that needs to be protected.  If
    //   the request is authenticated (typically via a persistent login session),
    //   the request will proceed.  Otherwise, the user will be redirected to the
    //   login page.
    function ensureAuthenticated(req, res, next) {
      if (req.isAuthenticated()) { return next(); }
      res.redirect('/login')
  }

  function _start() {
    mongoose.connect(config.mongoose[NODE_ENV].connectionString);
    http.createServer(app).listen(app.get('port'), function(){
      if (NODE_ENV === 'development') {
          console.log("Express server listening on port " + app.get('port'));  
      }

  });
}

return {
    start: _start
}

}();

module.exports = exports = Server;