const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');

const port = 8080;

// Logging
function log(message)
{
	console.log("[" + Math.floor(Date.now() / 1000) + "]: " + message);
}

// Express
app.use('/', express.static(path.join(__dirname, '/public')));
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

http.listen(port, function() {
	console.log('Listening at http://localhost:' + port + "\n")
});