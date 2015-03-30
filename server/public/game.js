/**
 *	Game
 *	Singleton
 */

var abs = Math.abs,
	sqrt = Math.sqrt,
	pow = Math.pow;

function Game(width, height) {
	this.canvas;
	this.users = [];
	this.pads = [
		new Pad(0, 0, 0, 1, 1),
		new Pad(0, 0, 10, 1, 1),
		new Pad(0, 10, 0, 1, 1),
		new Pad(0, 10, 10, 1, 1)
	];
	this.width = width;
	this.height = height;

	setInterval(function() {
		this.update();
	}.bind(this), 60);
};

Game.instance_;

Game.getInstance = function() {
	if (Game.instance_) return Game.instance_;
	return Game.instance_ = new Game();
};

Game.prototype.update = function() {
	this.updatePadPositions();
	Canvas.drawField(this.users, this.pads);
};

Game.prototype.updatePadPositions = function() {
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
		users.forEach(function(user) {
			if (pow(pad.x - user.x, 2) + pow(pad.y - user.y, 2) <= COLLISTION_LENGTH2) {
				l = sqrt(pow(pad.x - user.x, 2) + pow(pad.y - user.y, 2));
				ix = (pad.x - user.x) / l;
				iy = (pad.y - user.y) / l;
				dAbs = ((pad.x - user.x) * user.vx + (pad.y - user.y) * user.vy) / l * 2;
				pad.vx += ix * dAbas;
				pad.vy += iy * dAbas;
			}
		});
	});
};
