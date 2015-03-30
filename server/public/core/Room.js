function Room(socket) {
	/**
	 *  ソケット
	 *	@type {Socket}
	 */
	this.socket = socket;

	this.game = Game.getInstance();

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
};

/**
 *　ユーザー一覧を更新する
 */
Room.prototype.updateUserList = function() {
	this.socket.emit('getUserList', function(userList) {
		Object.keys(userList).forEach(function(userId) {
			var userName = userList[userId],
				user = new User(userId, userName);

			if (userId === app.me.id) return;

			console.log('getUserList >> %s: %s', userId, userName);
		});
	});
};

/**
 *	サーバーからのenterUserメッセージに対するハンドラ
 *	@param {string} userId ユーザーのID
 *	@param {string} userName ユーザーの名前
 */
Room.prototype.onEnterUser = function(userId, userName) {
	var newUser = new User(userId, userName);

	console.log('onEnterUser >> %s: %s', userId, userName);
};

/**
 *	サーバーからのleaveUserメッセージに対するハンドラ
 *	@param {string} userId ユーザーのID
 */
Room.prototype.onLeaveUser = function(userId, userName) {
	var leftUser = User.removeById(userId);
	if (!leftUser) return

	console.log('onLeaveUser >> %s: %s', userId, userName);
};
