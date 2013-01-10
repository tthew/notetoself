var fs = require('fs');

exports.credentials = {
  mongoose_auth: 'mongodb://127.0.0.1/notetoself',
};

exports.https = {
	key: fs.readFileSync('ssl/server.key'),
	certificate: fs.readFileSync('ssl/server.crt')
}

exports.app = {
	name: "NoteToSelf"
}