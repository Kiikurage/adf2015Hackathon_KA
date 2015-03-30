function User(id, name, x, y, teamId) {
	if (User.getById(id)) return User.getById(id);
	User.records_[id] = this;

	/**
	 * ID
	 * @type {string}
	 */
	this.id = id;

	/**
	 * ユーザー名
	 * @type {string}
	 */
	this.name = name;

	this.x = x;
	this.y = y;
	this.teamId = teamId;
}

/**
 *	レコードの一覧
 *	@type {Object<string, User>}
 *	@private_
 */
User.records_ = {};

/**
 *	半径
 *	@type {number}
 */
User.RADIUS = 20;

User.SPEED = 50;


User.prototype.setPosition = function(x, y) {
	this.x = x;
	this.y = y;
};

/**
 *	IDを指定してモデルを取り出す
 *	@param {string} userId ID
 *	@return {User} ユーザーモデルまたはnull
 */
User.getById = function(userId) {
	return this.records_[userId] || null;
};

/**
 *	IDを指定してモデルを消す
 *	@param {string} userId ID
 *	@return {User} 削除されたユーザーモデルまたはnull
 */
User.removeById = function(userId) {
	var records = this.records_,
		removedUser = records[userId];

	records[userId] = null;

	return removedUser;
};

User.prototype.setPosition = function(x, y) {
	this.x = x;
	this.y = y;
	return [x, y];
};
