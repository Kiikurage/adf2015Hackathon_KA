/**
 *	Application
 *	Singleton
 */
function Application() {

	/**
	 *	ソケット
	 *	@type {Socket}
	 */
	this.socket = io();

	/**
	 *	ゲーム入室フォーム
	 *	@type {HTMLFormElement}
	 */
	this.$entranceForm;

	/**
	 *	ゲーム入室フォーム
	 *	@type {HTMLFormElement}
	 */
	this.$userNameInput;

	/**
	 *	部屋のインスタンス
	 *	@type {Room}
	 */
	this.room;

	/**
	 *	自分自身のモデル
	 *	@type {User}
	 */
	this.me = new User(0, 'username', 0, 0, 1);

	this.initEventHandler_();
}

/**
 *	@type {Application}
 *	@private
 */
Application.instance_;

/**
 *	イベントハンドラを初期化する
 *	@private
 */
Application.prototype.initEventHandler_ = function() {
	this.$entranceForm = document.querySelector('#entranceForm');
	this.$userNameInput = document.querySelector('#userNameInput');
	this.$entranceForm.addEventListener('submit', this.onEntranceFormSubmit = this.onEntranceFormSubmit.bind(this));
	document.body.addEventListener('keydown', this.onKeydown = this.onKeydown.bind(this));
};

/**
 *	インスタンスを取得する
 *	@return {Application} インスタンス
 */
Application.getInstance = function() {
	if (Application.instance_) return Application.instance_;

	return Application.instance_ = new Application();
}

/**
 *	ゲームに参加する
 *	ゲームへの参加は非同期なので注意
 *	@param {string} userName ユーザー名
 */
Application.prototype.enterGame = function(userName) {
	var self = this;

	this.socket.emit('enterGame', userName, function(userId, userName) {
		self.me = new User(userId, userName, 0, 0, 0);
		self.room = new Room(self.socket);
	});
};

/**
 *	entranceFormのsubmitイベントに対するイベントハンドラ
 *	@param {Event} ev イベントオブジェクト
 */
Application.prototype.onEntranceFormSubmit = function(ev) {
	var userName = this.$userNameInput.value;

	this.enterGame(userName);

	ev.preventDefault();
	return false;
};

Application.prototype.onKeydown = function(ev) {
	var KEYCODE_LEFT = 37,
		KEYCODE_UP = 38,
		KEYCODE_RIGHT = 39,
		KEYCODE_DOWN = 40,
		me = this.me;

	switch (ev.which || ev.keyCode) {
		case KEYCODE_LEFT:
			me.setPosition(me.x - 10, me.y);
			break;

		case KEYCODE_UP:
			me.setPosition(me.x, me.y - 10);
			break;

		case KEYCODE_RIGHT:
			me.setPosition(me.x + 10, me.y);
			break;

		case KEYCODE_DOWN:
			me.setPosition(me.x, me.y + 10);
			break;
	}

	var payload = {
		x: me.x,
		y: me.y
	};
	this.socket.emit('userMoved', payload);
};

/**
 *	bootstrap
 */
window.addEventListener('DOMContentLoaded', function() {
	window.app = Application.getInstance();
});
