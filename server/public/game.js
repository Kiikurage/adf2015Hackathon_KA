/**
 *	Game
 *	Singleton
 */

var abs = Math.abs,
	sqrt = Math.sqrt,
	pow = Math.pow;

function Game() {
	this.pads = [
		new Pad(0, 0, 0, 40, 24),
		new Pad(1, 0, 50, 53, 10),
		new Pad(2, 50, 0, 23, 27),
		new Pad(3, 50, 50, -25, 28)
	];
	for (i = 0; i < 10; i++) {
		p = Math.random() * 2 * Math.PI;
		this.pads.push(new Pad(i, Math.random() * Game.WIDTH, Math.random() * Game.HEIGHT, Math.cos(p) * 100, Math.sin(p) * 100));
	}

	this.me;

	this.flagLeftKey = false;
	this.flagUpKey = false;
	this.flagRightKey = false;
	this.flagDownKey = false;

	setInterval(function() {
		this.update();
	}.bind(this), 16);
};

Game.WIDTH = 400;
Game.HEIGHT = 400;

Game.instance_;

Game.getInstance = function() {
	if (Game.instance_) return Game.instance_;
	return Game.instance_ = new Game();
};

Game.prototype.onKeyDown = function(keyCode) {
	var KEYCODE_LEFT = 37,
		KEYCODE_UP = 38,
		KEYCODE_RIGHT = 39,
		KEYCODE_DOWN = 40;

	switch (keyCode) {
		case KEYCODE_LEFT:
			this.flagLeftKey = true;
			break;

		case KEYCODE_UP:
			this.flagUpKey = true;
			break;

		case KEYCODE_RIGHT:
			this.flagRightKey = true;
			break;

		case KEYCODE_DOWN:
			this.flagDownKey = true;
			break;
	}
};

Game.prototype.onKeyUp = function(keyCode) {
	var KEYCODE_LEFT = 37,
		KEYCODE_UP = 38,
		KEYCODE_RIGHT = 39,
		KEYCODE_DOWN = 40;

	switch (keyCode) {
		case KEYCODE_LEFT:
			this.flagLeftKey = false;
			break;

		case KEYCODE_UP:
			this.flagUpKey = false;
			break;

		case KEYCODE_RIGHT:
			this.flagRightKey = false;
			break;

		case KEYCODE_DOWN:
			this.flagDownKey = false;
			break;
	}
};

Game.prototype.update = function() {
	this.updateUserPositions();
	this.updatePadPositions();
	Canvas.drawField(app.room.users, this.pads);
};

Game.prototype.updateUserPositions = function() {
	var me = this.me;

	if (this.flagLeftKey) me.x -= User.SPEED * 0.1;
	if (this.flagUpKey) me.y -= User.SPEED * 0.1;
	if (this.flagRightKey) me.x += User.SPEED * 0.1;
	if (this.flagDownKey) me.y += User.SPEED * 0.1;

	if (this.flagLeftKey || this.flagUpKey || this.flagRightKey || this.flagDownKey) {
		var payload = {
			x: me.x,
			y: me.y
		};
		app.socket.emit('userMoved', payload);
	}
};

Game.prototype.updatePadPositions = function() {
	var pads = this.pads,
		users = app.room.users,
		l, dAbs, dAbs1, dAbs2, ix, iy,
		width = Game.WIDTH,
		height = Game.HEIGHT,
		COLLISION_LENGTH2 = pow(Pad.RADIUS + User.RADIUS, 2),
		PAD_COLLISION_LENGTH2 = pow(Pad.RADIUS + Pad.RADIUS, 2),
		i, j, max, pad1, pad2;

	pads.forEach(function(pad) {
		//padの位置の更新
		pad.x += pad.vx * 0.1;
		pad.y += pad.vy * 0.1;

		//反射計算
		if (pad.x <= Pad.RADIUS) {
			pad.x = Pad.RADIUS;
			pad.vx *= -1;
		}
		if (pad.y <= Pad.RADIUS) {
			pad.y = Pad.RADIUS;
			pad.vy *= -1;
		}
		if (pad.x >= width - Pad.RADIUS) {
			pad.x = width - Pad.RADIUS;
			pad.vx *= -1;
		}
		if (pad.y >= height - Pad.RADIUS) {
			pad.y = height - Pad.RADIUS;
			pad.vy *= -1;
		}

		//ユーザーとの反射計算(あってるか謎)
		users.forEach(function(user) {
			if (pow(pad.x - user.x, 2) + pow(pad.y - user.y, 2) <= COLLISION_LENGTH2) {
				l = sqrt(pow(pad.x - user.x, 2) + pow(pad.y - user.y, 2));
				ix = (pad.x - user.x) / l;
				iy = (pad.y - user.y) / l;
				dAbs = ((pad.x - user.x) * pad.vx + (pad.y - user.y) * pad.vy) / l * 2;
				pad.vx -= ix * dAbs;
				pad.vy -= iy * dAbs;
				pad.x = user.x + ix * sqrt(COLLISION_LENGTH2) * 1.1;
				pad.y = user.y + iy * sqrt(COLLISION_LENGTH2) * 1.1;
			}
		});
	});

	//パッド同士の衝突
	for (i = 0, max = pads.length; i < max; i++) {
		for (j = i + 1; j < max; j++) {
			if (i == j) continue;
			pad1 = pads[i];
			pad2 = pads[j];

			if (pow(pad1.x - pad2.x, 2) + pow(pad1.y - pad2.y, 2) <= PAD_COLLISION_LENGTH2) {
				l = sqrt(pow(pad1.x - pad2.x, 2) + pow(pad1.y - pad2.y, 2));
				ix = (pad1.x - pad2.x) / l;
				iy = (pad1.y - pad2.y) / l;
				dAbs1 = ((pad1.x - pad2.x) * pad1.vx + (pad1.y - pad2.y) * pad1.vy) / l * 2;
				dAbs2 = ((pad2.x - pad1.x) * pad2.vx + (pad2.y - pad1.y) * pad2.vy) / l * 2;
				pad1.vx -= ix * dAbs1;
				pad1.vy -= iy * dAbs1;
				pad2.vx += ix * dAbs2;
				pad2.vy += iy * dAbs2;
				pad1.x = pad2.x + ix * sqrt(PAD_COLLISION_LENGTH2) * 1.1;
				pad1.y = pad2.y + iy * sqrt(PAD_COLLISION_LENGTH2) * 1.1;
			}
		}
	}
};
