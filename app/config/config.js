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
        		consumerKey: 'aCSlu76Ure2Whtb9ohPg',
        		consumerSecret: 'KwE08W5YX5MCfHRXjhIm8Z95XfXq6Oeza2LCDLzT5Y'
        	}
        }
    }
}();

module.exports = exports = Config;