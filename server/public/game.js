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

Game.prototype.update =  function() {

};
