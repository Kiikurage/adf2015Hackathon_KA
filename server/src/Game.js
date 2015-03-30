var User = require('./User.js'),
	Field = require('./Field.js'),
	Pad = require('./Pad.js');

var abs = Math.abs,
	sqrt = Math.sqrt,
	pow = Math.power;

function Game() {
	if (!(this instanceof Game)) return new Game(socket);

	/**
	 *	フィールド
	 *	@type {Field}
	 */
	this.field;

	/**
	 *	ユーザーの一覧
	 *	@type {Array<User>}
	 */
	this.users = [];

	/**
	 *	パッドの一覧
	 *	@type {Array<Pad>}
	 */
	this.pads = [];

	setInterval(this.sendPadPosition = this.sendPadPosition.bind(this), 5000);
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

/**
 *	パッドの位置計算
 */
Game.prototype.updatePadsPosition = function() {
	var pads = this.pads,
		users = this.users,
		field = this.field,
		l, dAbs, ix, iy,
		COLLISTION_LENGTH2 = pow(Pad.RADIUS + User.RADIUS, 2);

	pads.forEach(function(pad) {
		//padの位置の更新
		pad.x += pad.vx;
		pad.y += pad.vy;

		//反射計算
		if (pad.x <= Pad.RADIUS) {
			pad.x = Pad.RADIUS;
			pad.vx *= -1;
		}
		if (pad.y <= Pad.RADIUS) {
			pad.y = Pad.RADIUS;
			pad.vy *= -1;
		}
		if (pad.x >= field.width - Pad.RADIUS) {
			pad.x = field.width - Pad.RADIUS;
			pad.vx *= -1;
		}
		if (pad.y >= field.height - Pad.RADIUS) {
			pad.y = field.height - Pad.RADIUS;
			pad.vy *= -1;
		}

		//ユーザーとの反射計算(あってるか謎)
		if (pow(pad.x - user.x, 2) + pow(pad.y - user.y, 2) <= COLLISTION_LENGTH2) {
			l = sqrt(pow(pad.x - user.x, 2) + pow(pad.y - user.y, 2));
			ix = (pad.x - user.x) / l;
			iy = (pad.y - user.y) / l;
			dAbs = ((pad.x - user.x) * user.vx + (pad.y - user.y) * user.vy) / l * 2;
			pad.vx += ix * dAbas;
			pad.vy += iy * dAbas;
		}
	});
};

/**
 *	全ユーザーに配信する
 *	@param {string} message メッセージ
 *	@param {*} data データ
 */
Game.prototype.emitAll = function(message, data) {
	var args = arguments;
	this.users.forEach(function(user) {
		user.emit.apply(user, args);
	});
};

/**
 *	パッドの位置を配信する
 */
Game.prototype.sendPadPosition = function() {
	var positionMap = {};
	this.pads.forEach(function(pad) {
		positionMap[pad.id] = {
			x: pad.x,
			y: pad.y
		}
	});
	this.emitAll('padsPosition', positionMap);
};

/**
 *	更新処理
 */
Game.prototype.update = function() {
	this.updatePadsPosition();
};



module.exports = Game;
