var User = require('./User.js'),
	Pad = require('./Pad.js');

var abs = Math.abs,
	sqrt = Math.sqrt,
	pow = Math.power,
	teamMemberCounts = [0, 0, 0, 0],
	teamScores = [0, 0, 0, 0];

function Game() {
	if (!(this instanceof Game)) return new Game(socket);

	/**
	 *	フィールド横幅
	 *	@type {number}
	 */
	this.width;

	/**
	 *	フィールド縦の長さ
	 *	@type {number}
	 */
	this.height;

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

	user.x = 0;
	user.y = 0;

	var i, minI, minTeamMemberCount = 99999;
	for (i = 0; i < 4; i++) {
		if (teamMemberCounts[i] < minTeamMemberCount) {
			minTeamMemberCount = teamMemberCounts[i];
			minI = i;
		}
	}
	user.teamId = minI;
	teamMemberCounts[minI]++;

	user.socket.broadcast.emit('enterUser', {
		userId: user.id,
		name: user.name,
		x: user.x,
		y: user.y,
		teamId: user.teamId
	});
};

/**
 *	当該ソケットのユーザーを新規追加する
 *	@param {Socket} socket ソケット
 *	@param {string} userName ユーザー名
 *	@retrun {User} 作成されたユーザー
 */
Game.prototype.addUserBySocket = function(socket, userName) {
	var newUser = new User(socket, userName, 0, 0);
	this.addUser(newUser);

	return newUser;
};

/**
 *	ユーザーを削除する
 */
Game.prototype.removeUser = function(user) {
	var index = this.users.indexOf(user);
	if (index === -1) return;

	var removedUser = this.users.splice(index, 1)[0];
	this.teamMemberCounts[removedUser.team]--;

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
		if (users[i].socket.id === socket.id) return users[i];
	}

	return null;
};

/**
 *	ユーザーの一覧を取得する
 */
Game.prototype.getUsers = function() {
	return this.users.map(function(user) {
		return {
			userId: user.id,
			name: user.name,
			x: user.x,
			y: user.y,
			teamId: user.teamId
		};
	});
};

/**
 *	パッドの位置計算
 */
Game.prototype.updatePadsPosition = function() {
	var pads = this.pads,
		users = this.users,
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
		if (pad.x >= this.width - Pad.RADIUS) {
			pad.x = this.width - Pad.RADIUS;
			pad.vx *= -1;
		}
		if (pad.y >= this.height - Pad.RADIUS) {
			pad.y = this.height - Pad.RADIUS;
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
	// this.users.forEach(function(user) {
	// 	user.socket.emit.apply(user, args);
	// });
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
