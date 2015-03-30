function Room(socket, me) {
	/**
	 *  ソケット
	 *	@type {Socket}
	 */
	this.socket = socket;

	this.me = me;

	this.game = Game.getInstance();
	this.game.me = me;

	this.users = [];

	this.initEventHandler_();
	this.updateUserList();
}

/**
 *	イベントハンドラを初期化する
 *	@private
 */
Room.prototype.initEventHandler_ = function() {
	this.socket.on('enterUser', this.onEnterUser = this.onEnterUser.bind(this));
	this.socket.on('leaveUser', this.onLeaveUser = this.onLeaveUser.bind(this));
	this.socket.on('userMoved', this.onUserMoved = this.onUserMoved.bind(this));
};

/**
 *　ユーザー一覧を更新する
 */
Room.prototype.updateUserList = function() {
	var self = this;

	this.socket.emit('getUserList', function(userList) {
		var users = [];

		Object.keys(userList).forEach(function(userId) {
			var userName = userList[userId],
				user = new User(userId, userName);

			users.push(user);
		});

		self.users = users;
	});

};

/**
 *	サーバーからのenterUserメッセージに対するハンドラ
 *	@param {string} userId ユーザーのID
 *	@param {string} userName ユーザーの名前
 *	@param {number} x 位置
 *	@param {number} y 位置
 */
Room.prototype.onEnterUser = function(data) {
	var newUser = new User(data.user.id, data.user.name, data.pos.x, data.pos.y);
	this.users.push(newUser);
};

/**
 *	サーバーからのleaveUserメッセージに対するハンドラ
 *	@param {string} userId ユーザーのID
 */
Room.prototype.onLeaveUser = function(userId, userName) {
	var leftUser = User.removeById(userId),
		index;
	if (!leftUser) return

	var index = this.users.indexOf(leftUser);

	if (index !== -1) {
		this.users.splice(index, 1);
	}
};

/**
 *	サーバーからの userMoved メッセージに対するハンドラ
 *
 */
Room.prototype.onUserMoved = function(data) {
	var movedUser = User.getById(data.userId);
	if (!movedUser || movedUser.id === this.me.id) return

	movedUser.x = data.x;
	movedUser.y = data.y;
};
