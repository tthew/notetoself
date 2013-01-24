var Server = function() {
    
    //  Check for NODE_ENV environment variable or set a sensible default.
    var NODE_ENV = process.env.NODE_ENV || "development";

    var express = require('express')
      , routes = require('./app/routes')
      , user = require('./app/routes/user')
      , http = require('http')
      , path = require('path')
      , mongoose = require('mongoose')
      , Schema = mongoose.Schema
      , ObjectId = mongoose.SchemaTypes.ObjectId
      , UserSchema = new Schema({})
      , User
      , config = require('./app/config/config')
      , everyauth = require('everyauth')
      , Promise = everyauth.Promise
      , mongooseAuth = require('mongoose-auth');

    everyauth.debug = true;

    UserSchema.plugin(mongooseAuth, {
        everymodule: {
          everyauth: {
              User: function () {
                return User;
              }
          }
        }
      // , facebook: {
      //     everyauth: {
      //         myHostname: 'http://notetoself.com:3000'
      //       , appId: conf.fb.appId
      //       , appSecret: conf.fb.appSecret
      //       , redirectPath: '/'
      //     }
      //   }
      , twitter: {
          everyauth: {
              myHostname: 'http://notetoself.com:3000'
            , consumerKey: config.services.twitter.consumerKey
            , consumerSecret: config.services.twitter.consumerSecret
            , redirectPath: '/'
          }
        }
      , password: {
            loginWith: 'email'
          , extraParams: {
                phone: String
              , name: {
                    first: String
                  , last: String
                }
            }
          , everyauth: {
                getLoginPath: '/login'
              , postLoginPath: '/login'
              , loginView: 'login.jade'
              , getRegisterPath: '/register'
              , postRegisterPath: '/register'
              , registerView: 'register.jade'
              , loginSuccessRedirect: '/'
              , registerSuccessRedirect: '/'
            }
        }
      // , github: {
      //     everyauth: {
      //         myHostname: 'http://notetoself.com:3000'
      //       , appId: conf.github.appId
      //       , appSecret: conf.github.appSecret
      //       , redirectPath: '/'
      //     }
      //   }
      // , instagram: {
      //     everyauth: {
      //         myHostname: 'http://notetoself.com:3000'
      //       , appId: conf.instagram.clientId
      //       , appSecret: conf.instagram.clientSecret
      //       , redirectPath: '/'
      //     }
      //   }
      // , google: {
      //     everyauth: {
      //         myHostname: 'http://notetoself.com:3000'
      //       , appId: conf.google.clientId
      //       , appSecret: conf.google.clientSecret
      //       , redirectPath: '/'
      //       , scope: 'https://www.google.com/m8/feeds'
      //     }
      //   }
    });

    mongoose.model('User', UserSchema);

    mongoose.connect('mongodb://localhost/example');

    User = mongoose.model('User');

    var app = express();

    app.configure(function(){
      app.set('port', process.env.PORT || config.port);
      app.set('views', __dirname + '/app/views');
      app.set('view engine', 'jade');
      app.use(express.favicon());
      app.use(express.logger('dev'));
      app.use(express.bodyParser());
      app.use(express.cookieParser());
      app.use(express.session({secret: 'omnomnom'}));
      app.use(express.methodOverride());
      app.use(mongooseAuth.middleware());
      // app.use(app.router);
      app.use(express.static(path.join(__dirname, 'public')));

    });

    // mongooseAuth.helpExpress(app);

    app.configure('development', function(){
      app.use(express.errorHandler());
    });


    function _start() {
        http.createServer(app).listen(app.get('port'), function(){
            // app.use(mongooseAuth.middleware());
          console.log("Express server listening on port " + app.get('port'));
        });
    }
    
    return {
        start: _start
    }
}();

module.exports = exports = Server;