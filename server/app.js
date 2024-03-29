var express = require('express'),
	app = express(),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	Game = require('./src/Game.js');

app.use(express.static(__dirname + '/public'));

var game = new Game(io);
setInterval(function() {
	game.updatePadPositions();
}, 16);

io.on('connection', function(socket) {
	socket.on('enterGame', function(name, x, y, response) {
		var newUser = game.addUserBySocket(socket, name, x, y);
		response({
			id: newUser.id,
			name: newUser.name,
			x: x,
			y: y
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

		var setInRange = function(x) {
			if (x < 20) { return 20; }
			if (x > 380) { return 380; }
			return x;
		};
		user.x = setInRange(data.x);
		user.y = setInRange(data.y);

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
