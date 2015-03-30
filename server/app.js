var express = require('express'),
	app = express(),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	Game = require('./src/Game.js');

app.use(express.static(__dirname + '/public'));

var game = new Game();

io.on('connection', function(socket) {
	socket.on('enterGame', 　function(data, response) {
		var newUser = game.addUserBySocket(socket, data);
		response(newUser.id, newUser.name);
	});

	socket.on('getUserList', 　function(response) {
		response(game.getUserList());
	});

	socket.on('leaveGame', 　function() {
		game.removeUserBySocket(socket);
	});

	socket.on('disconnect', function() {
		game.removeUserBySocket(socket);
	});
});


http.listen(process.env.PORT || 3000, function() {
	console.log('listening on *:3000');
});
