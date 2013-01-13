var fs = require('fs');

exports.credentials = {
  mongoose_auth: 'mongodb://127.0.0.1/notetoself',
};

exports.https = {
	key: fs.readFileSync('ssl/server.key'),
	certificate: fs.readFileSync('ssl/server.crt')
}

exports.app = {
	name: "NoteToSelf",
	port: "3000"
}

exports.fb = {
    appId: '111565172259433'
  , appSecret: '85f7e0a0cc804886180b887c1f04a3c1'
}

exports.twitter = {
    consumerKey: '9LUWz5S3yLmY3sWnRZzMw'
  , consumerSecret: 'XQwo4GanLC65bjgoFZo0wVFeSOdyygjwulEL3FE4E'
}