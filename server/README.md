# それオレオンライン

## それオレとは

[それはオレの魚だ! - Amazon](http://www.amazon.co.jp/%E3%82%A2%E3%83%BC%E3%82%AF%E3%83%A9%E3%82%A4%E3%83%88-%E3%81%9D%E3%82%8C%E3%81%AF%E3%82%AA%E3%83%AC%E3%81%AE%E9%AD%9A%E3%81%A0-%E5%AE%8C%E5%85%A8%E6%97%A5%E6%9C%AC%E8%AA%9E%E7%89%88/dp/B005FEOYK8)

AI実装で出てきたペンギンのゲーム

## ソケット通信について

```javascript
//ソケット作成
var socket = io();

//サーバー側の特定のメッセージに反応
socket.on('joinNewUser', function(user){
	//メッセージに対するコールバック
});

//サーバーへメッセージを送信
socket.emit('move', 5, 8, function(responseData){
	//レスポンスに対するコールバック
});
```

---

### サーバーからのメッセージ

#### enterUser

他のユーザーがゲームへ入室したことを通知する。自分がゲームへ入室していないと通知されない。

##### コールバックの引数

|名前|型|意味|
|---|---|---|
|userId|string|ユーザーID|
|userName|string|ユーザー名|

```javascript
socket.ib('enterUser', 'kikurage', function(userId, userName){
	console.log('New user coming! ID: %s, NAME: %s', userId, userName);
});
```

#### leaveUser

他のユーザーがゲームから退室したことを通知する。自分がゲームへ入室していないと通知されない。

##### コールバックの引数

|名前|型|意味|
|---|---|---|
|userId|string|ユーザーID|
|userName|string|ユーザー名|

```javascript
socket.ib('enterUser', 'kikurage', function(userId, userName){
	console.log('User left! ID: %s, NAME: %s', userId, userName);
});
```

##### コールバックの引数

|名前|型|意味|
|---|---|---|
|userId|string|ユーザーID|
|userName|string|ユーザー名|

```javascript
socket.ib('enterUser', 'kikurage', function(userId, userName){
	console.log('New user coming! ID: %s, NAME: %s', userId, userName);
});
```

---

### サーバーへのメッセージ

#### enterGame

ゲームへ入室する

##### 引数

|名前|型|意味|
|---|---|---|
|userName|string|ユーザー名|

##### コールバックの引数

|名前|型|意味|
|---|---|---|
|userId|string|ユーザーID|
|userName|string|ユーザー名|

```javascript
socket.emit('enterGame', 'kikurage', function(userId, userName){
	console.log('you enter gameroom with ID: %s, NAME: %s', userId, userName);
});
```

#### getUserList

ユーザー一覧をリクエストする

##### 引数

なし

##### コールバックの引数

|名前|型|意味|
|---|---|---|
|userList|object|ユーザーのID:名前の辞書|

```javascript
socket.emit('getUserList', function(userList){
	Object.keys(object).forEach(function(userId){
		console.log('User >> %s: %s', userId, userList[userId]);
	});
});
```

#### leaveGame

ゲームを退出する

##### 引数

なし

```javascript
socket.emit('leaveGame');
```

##### 備考

このメソッドを呼ばずにブラウザを閉じるなどしソケットが切断されても、サーバー側で退出処理がなされる。
