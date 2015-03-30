function Pad(id, x, y, vx, vy) {
	if (Pad.getById(id)) return Pad.getById(id);
	Pad.records_[id] = this;

	this.id = id;
	this.x = x;
	this.y = y;
	this.vx = vx;
	this.vy = vy;
};

Pad.records_ = {};
Pad.RADIUS = 5;

Pad.prototype.getById = function(padId) {
	return this.records_[padId] || null;
};

Pad.prototype.removeById = function(padId) {
	var records = this.records_,
		removedPad = records[padId];

	records[padId] = null;

	return removedPad;
};

Pad.prototype.setPosition = function(x, y) {
	this.x = x;
	this.y = y;
};

Pad.prototype.setVelocity = function(vx, vy) {
	this.vx = vx;
	this.vy = vy;
};
/*
Pad.prototype.update = function() {
	this.x += this.vx;
	this.y += this.vy;
};*/
