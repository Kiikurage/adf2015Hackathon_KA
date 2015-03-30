var GUID = require('guid');

function User(socket, name) {
	if (!(this instanceof User)) return new User(socket, name);

	/**
	 * ID
	 * @type {string}
	 */
	this.id = GUID.create();

	/**
	 * ソケット
	 * @type {Socket}
	 */
	this.socket = socket;

	/**
	 * ユーザー名
	 * @type {string}
	 */
	this.name = name;

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
}

User.RADIUS = 20;

User.prototype.emit = function(message, data) {
	return this.socket.emit(message, data);
};

User.prototype.on = function(message, callback) {
	return this.socket.on(message, callback);
};

User.prototype.off = function(message, callback) {
	return this.socket.removeListener(message, callback);
};


module.exports = User;
