/**
 *	Game
 *	Singleton
 */

function Game(x, y) {
	this.canvas;
	this.users = [];
	this.pads = [];
	this.x = x;
	this.y = y;
};

Game.instance_;

Game.getInstance = function() {
	if (Game.instance_) return Game.instance_;
	return Game.instance_ = new Game();
};

Game.prototype.update = function() {
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
