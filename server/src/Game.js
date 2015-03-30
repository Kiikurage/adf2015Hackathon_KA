var User = require('./User.js');

function Game() {
	if (!(this instanceof Game)) return new Game(socket);

	this.users = [];
}

/**
 *	新規ユーザーを追加する
 */
Game.prototype.addUser = function(user) {
	//二重登録防止
	this.removeUser(user);

	this.users.push(user);
	console.log('Game: add user');
	console.log(user);

	user.socket.broadcast.emit('enterUser', user.id, user.name);
};

/**
 *	当該ソケットのユーザーを新規追加する
 *	@param {Socket} socket ソケット
 *	@param {string} userName ユーザー名
 *	@retrun {User} 作成されたユーザー
 */
Game.prototype.addUserBySocket = function(socket, userName) {
	var newUser = new User(socket, userName);
	this.addUser(newUser);

	return newUser;
};

/**
 *	ユーザーを削除する
 */
Game.prototype.removeUser = function(user) {
	var index = this.users.indexOf(user);
	if (index === -1) return;

	this.users.splice(index, 1);
	console.log('Game: remove user');
	console.log(user);

	user.socket.broadcast.emit('leaveUser', user.id, user.name);
};

/**
 *	当該ソケットを持つユーザーを削除する
 *	@param {Socket} socket ソケット
 *	@retrun {User} 削除されたユーザー
 */
Game.prototype.removeUserBySocket = function(socket) {
	var leftUser = this.getUserBySocket(socket);
	if (!leftUser) return null;

	this.removeUser(leftUser);
	return leftUser;
};

/**
 *	Socketからユーザーを識別する
 */
Game.prototype.getUserBySocket = function(socket) {
	var users = this.users,
		i, max;

	for (i = 0, max = users.length; i < max; i++) {
		if (users[i].socket === socket) return users[i];
	}

	return null;
};

/**
 *	ユーザーの辞書を取得する
 */
Game.prototype.getUserList = function() {
	return this.users.reduce(function(userList, user) {
		userList[user.id] = user.name
		return userList;
	}, {});
};

module.exports = Game;
