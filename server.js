var Server = function() {

    //  Check for NODE_ENV environment variable or set a sensible default.
    var NODE_ENV = process.env.NODE_ENV || "development";

    var express = require('express')
    , routes = require('./app/routes')
    , user = require('./app/routes/user')
    , http = require('http')
    , path = require('path')
    , mongoose = require('mongoose')
    , config = require('./app/config/config');

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
        app.use(app.router);
        app.use(express.static(path.join(__dirname, 'public')));
    });

    app.configure('development', function(){
        app.use(express.errorHandler());
    });

    function _start() {
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