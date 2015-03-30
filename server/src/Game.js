var User = require('./User.js'),
	Pad = require('./Pad.js');

var abs = Math.abs,
	sqrt = Math.sqrt,
	pow = Math.pow,
	teamMemberCounts = [0, 0, 0, 0],
	teamScores = [0, 0, 0, 0];

function Game() {
	if (!(this instanceof Game)) return new Game();

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

	this.io = io;
}

/**
 *	新規ユーザーを追加する
 */
Game.prototype.addUser = function(user) {
	//二重登録防止
	this.removeUser(user);

	this.users.push(user);

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
Game.prototype.addUserBySocket = function(socket, userName, x, y) {
	var newUser = new User(socket, userName, x, y);
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
	teamMemberCounts[removedUser.teamId]--;

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
Game.prototype.updatePadPositions = function() {
	var pads = this.pads,
		users = this.users,
		l, dAbs, dAbs1, dAbs2, ix, iy,
		width = Game.WIDTH,
		height = Game.HEIGHT,
		COLLISION_LENGTH2 = Math.pow(Pad.RADIUS + User.RADIUS, 2),
		PAD_COLLISION_LENGTH2 = Math.pow(Pad.RADIUS + Pad.RADIUS, 2),
		i, j, max, pad1, pad2;

	pads.forEach(function(pad) {
		//padの位置の更新
		pad.x += pad.vx * 0.1;
		pad.y += pad.vy * 0.1;

		//反射計算
		if (pad.x <= Pad.RADIUS) {
			// 左の壁にあたった
			pad.x = Pad.RADIUS;
			pad.vx *= -1;
			if (Canvas.sideLength <= pad.y && pad.y <= Canvas.sideLength + Canvas.goalSize) {
				teamScores[0]++;
				teamScores[1]++;
				teamScores[2]++;
			}
		}
		if (pad.y <= Pad.RADIUS) {
			// 上の壁にあたった
			pad.y = Pad.RADIUS;
			pad.vy *= -1;
			if (Canvas.sideLength <= pad.x && pad.x <= Canvas.sideLength + Canvas.goalSize) {
				teamScores[1]++;
				teamScores[2]++;
				teamScores[3]++;
			}
		}
		if (pad.x >= width - Pad.RADIUS) {
			// 右の壁にあたった
			pad.x = width - Pad.RADIUS;
			pad.vx *= -1;
			if (Canvas.sideLength <= pad.y && pad.y <= Canvas.sideLength + Canvas.goalSize) {
				teamScores[0]++;
				teamScores[2]++;
				teamScores[3]++;
			}
		}
		if (pad.y >= height - Pad.RADIUS) {
			// 左の壁にあたった
			pad.y = height - Pad.RADIUS;
			pad.vy *= -1;
			if (Canvas.sideLength <= pad.x && pad.x <= Canvas.sideLength + Canvas.goalSize) {
				teamScores[0]++;
				teamScores[1]++;
				teamScores[3]++;
			}
		}

		//ユーザーとの反射計算(あってるか謎)
		users.forEach(function(user) {
			if (Math.pow(pad.x - user.x, 2) + Math.pow(pad.y - user.y, 2) <= COLLISION_LENGTH2) {
				l = Math.sqrt(Math.pow(pad.x - user.x, 2) + Math.pow(pad.y - user.y, 2));
				ix = (pad.x - user.x) / l;
				iy = (pad.y - user.y) / l;
				dAbs = ((pad.x - user.x) * pad.vx + (pad.y - user.y) * pad.vy) / l * 2;
				pad.vx -= ix * dAbs;
				pad.vy -= iy * dAbs;
				pad.x = user.x + ix * Math.sqrt(COLLISION_LENGTH2) * 1.1;
				pad.y = user.y + iy * Math.sqrt(COLLISION_LENGTH2) * 1.1;
			}
		});
	});

	//パッド同士の衝突
	for (i = 0, max = pads.length; i < max; i++) {
		for (j = i + 1; j < max; j++) {
			if (i == j) continue;
			pad1 = pads[i];
			pad2 = pads[j];

			if (Math.pow(pad1.x - pad2.x, 2) + Math.pow(pad1.y - pad2.y, 2) <= PAD_COLLISION_LENGTH2) {
				l = Math.sqrt(Math.pow(pad1.x - pad2.x, 2) + Math.pow(pad1.y - pad2.y, 2));
				ix = (pad1.x - pad2.x) / l;
				iy = (pad1.y - pad2.y) / l;
				dAbs1 = ((pad1.x - pad2.x) * pad1.vx + (pad1.y - pad2.y) * pad1.vy) / l * 2;
				dAbs2 = ((pad2.x - pad1.x) * pad2.vx + (pad2.y - pad1.y) * pad2.vy) / l * 2;
				pad1.vx -= ix * dAbs1;
				pad1.vy -= iy * dAbs1;
				pad2.vx += ix * dAbs2;
				pad2.vy += iy * dAbs2;
				pad1.x = pad2.x + ix * Math.sqrt(PAD_COLLISION_LENGTH2) * 1.1;
				pad1.y = pad2.y + iy * Math.sqrt(PAD_COLLISION_LENGTH2) * 1.1;
			}
		}
	}

	this.io.emit('scoreUpdated', teamScores);
};

/**
 *	パッドの位置を配信する
 */
// Game.prototype.sendPadPosition = function() {
// 	var positionMap = {};
// 	this.pads.forEach(function(pad) {
// 		positionMap[pad.id] = {
// 			x: pad.x,
// 			y: pad.y
// 		}
// 	});
// 	this.emitAll('padsPosition', positionMap);
// };

module.exports = Game;
