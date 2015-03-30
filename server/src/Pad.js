var GUID = require('guid'),
	Game = require('./Game.js');

function Pad(id, x, y, vx, vy) {
	if (!(this instanceof Pad)) return new Pad(socket, name);

	/**
	 * ID
	 * @type {string}
	 */
	this.id = id || GUID.create();

	/**
	 * 位置x
	 * @type {number}
	 */
	this.x = x;

	/**
	 * 位置y
	 * @type {number}
	 */
	this.y = y;

	/**
	 * スピードx
	 * @type {number}
	 */
	this.vx = vx;

	/**
	 * スピードy
	 * @type {number}
	 */
	this.vy = vy;
}

/**
 *	パッドの半径
 *	@const {number}
 */
Pad.RADIUS = 5;

Pad.prototype.emit = function(message, data) {
	return this.io.emit(message, data);
};

Pad.prototype.on = function(message, callback) {
	return this.io.on(message, callback);
};

Pad.prototype.off = function(message, callback) {
	return this.io.removeListener(message, callback);
};

module.exports = Pad;
