var GUID = require('guid');

function User(socket, name, x, y, teamId) {
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

	/**
	 * チームID
	 * @type {string}
	 */
	this.teamId = teamId;

	this.initEventHandler_();
}

User.RADIUS = 20;

User.prototype.initEventHandler_ = function() {
	var self = this;

	this.socket.on('move', function(x, y, res) {
		self.x = x;
		self.y = y;
	});
};


module.exports = User;
