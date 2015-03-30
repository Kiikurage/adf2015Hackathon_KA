var User = require('./User.js'),
	Field = require('./Field.js'),
	Pad = require('./Pad.js');

var abs = Math.abs,
	sqrt = Math.sqrt,
	pow = Math.power;

function Team() {
	if (!(this instanceof Team)) return new Team(socket);

	/**
	 *	チームカラー
	 *	@type {number}
	 */
	this.color;

	/**
	 *	チームカラー
	 *	@type {number}
	 */
	this.color;

	/**
	 *	得点
	 *	@type {number}
	 */
	this.point = 0;
}
