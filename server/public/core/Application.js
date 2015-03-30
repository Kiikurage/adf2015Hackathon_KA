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
	document.body.addEventListener('keyup', this.onKeyUp = this.onKeyUp.bind(this));
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

	var x = Math.floor(Math.random() * 400);
	var y = Math.floor(Math.random() * 400);

	this.socket.emit('enterGame', userName, x, y, function(userId, userName) {
		document.querySelector('#entranceForm').parentNode.removeChild(document.querySelector('#entranceForm'));
		self.me = new User(userId, userName, x, y, 0);
		self.room = new Room(self.socket, self.me);
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

Application.prototype.onKeyUp = function(ev) {
	if (this.room && this.room.game) {
		this.room.game.onKeyUp(ev.which || ev.keyCode);
	}
};

Application.prototype.onKeydown = function(ev) {
	if (this.room && this.room.game) {
		this.room.game.onKeyDown(ev.which || ev.keyCode);
	}

	ev.stopPropagation();
};

/**
 *	bootstrap
 */
window.addEventListener('DOMContentLoaded', function() {
	window.app = Application.getInstance();
});
