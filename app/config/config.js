//     NoteToSelf API 
//     (c) 2012-2013 Matt Richards, Lucidmoon Ltd
//     http://lucidmoon.co.uk
//     -----

//  Application config.
var Config = function () {
    return {
        name: "NoteToSelf Cloud",
        port: "3000",
        mongoose: {
            development: {
                connectionString: 'mongodb://127.0.0.1/notetoself'  
            },
            testing: {
                connectionString: 'mongodb://127.0.0.1/notetoself-testing'  
            },
            production: {
                connectionString: 'mongodb://127.0.0.1/notetoself-production'   
            }               
        },
        services: {
        	twitter: {
        		consumerKey: '9LUWz5S3yLmY3sWnRZzMw',
        		consumerSecret: 'XQwo4GanLC65bjgoFZo0wVFeSOdyygjwulEL3FE4E'
        	}
        }
    }
}();

module.exports = exports = Config;