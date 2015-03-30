var express = require('express'),
	app = express(),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	Game = require('./src/Game.js');

app.use(express.static(__dirname + '/public'));

var game = new Game();

io.on('connection', function(socket) {
	socket.on('enterGame', function(data, response) {
		var newUser = game.addUserBySocket(socket, data);
		response({
			id: newUser.id,
			name: newUser.name,
			x: 0, // 適当な初期座標
			y: 0
		});
	});

	socket.on('getUsers', 　function(response) {
		response(game.getUsers());
	});

	socket.on('leaveGame', 　function() {
		game.removeUserBySocket(socket);
	});

	socket.on('disconnect', function() {
		game.removeUserBySocket(socket);
	});

	socket.on('userMoved', function(data) {
		var user = game.getUserBySocket(socket);
		if (user === null) {
			return;
		}
		user.x = data.x;
		user.y = data.y

		var payload = {
			x: data.x,
			y: data.y,
			userId: user.id.value
		};
		io.emit('userMoved', payload);
	});
});


http.listen(process.env.PORT || 3000, function() {
	console.log('listening on *:3000');
});
