//左上座標と幅、高さ

//var canvas = document.getElementById('canvasField');

Canvas = function() {};

Canvas.fieldOx = config.fieldOx;
Canvas.fieldOy = config.fieldOy;

Canvas.goalSize = config.goalSize;
Canvas.barWidth = config.barWidth;
Canvas.sideLength = (Game.WIDTH - Canvas.goalSize) / 2;

Canvas.colors = [
	'#F00',
	'#0F0',
	'#00F',
	'#FF0'
]

//フィールドを描画
Canvas.drawField = function(users, pads) {
	//if (!(this instanceof drawField)) return new drawField(socket);

	var canvas = document.getElementById('canvasField'),
		userRadius = User.RADIUS;

	if (canvas.getContext) {
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, Game.WIDTH + 2 * Canvas.barWidth, Game.HEIGHT + 2 * Canvas.barWidth);

		//Draw Field
		//strokeRect(x, y, width, height)
		ctx.fillStyle = "black";

		ctx.fillRect(Canvas.fieldOx - Canvas.barWidth, Canvas.fieldOy - Canvas.barWidth, Game.WIDTH + 2 * Canvas.barWidth, Game.HEIGHT + 2 * Canvas.barWidth);
		ctx.clearRect(Canvas.fieldOx, Canvas.fieldOy, Game.WIDTH, Game.HEIGHT);

		//DrawGoals
		//上下
		ctx.clearRect(Canvas.fieldOx + Canvas.sideLength, Canvas.fieldOy - Canvas.barWidth, Canvas.goalSize, Canvas.barWidth);
		ctx.clearRect(Canvas.fieldOx + Canvas.sideLength, Canvas.fieldOy + Game.HEIGHT, Canvas.goalSize, Canvas.barWidth);
		//左右
		ctx.clearRect(Canvas.fieldOx - Canvas.barWidth, Canvas.fieldOy + Canvas.sideLength, Canvas.barWidth, Canvas.goalSize);
		ctx.clearRect(Canvas.fieldOx + Game.WIDTH, Canvas.fieldOy + Canvas.sideLength, Canvas.barWidth, Canvas.goalSize);

		//Goal Area
		//arc(x, y, radius, startAngle, endAngle, anticlockwise) HELP
		ctx.beginPath();
		//上下
		ctx.moveTo(Canvas.fieldOx + Canvas.sideLength, Canvas.fieldOy);
		ctx.arc(Canvas.fieldOx + Canvas.sideLength + Canvas.goalSize / 2, Canvas.fieldOy, Canvas.goalSize / 2, 0, Math.PI, false);
		ctx.moveTo(Canvas.fieldOx + Canvas.sideLength, Canvas.fieldOy + Game.HEIGHT);
		ctx.arc(Canvas.fieldOx + Canvas.sideLength + Canvas.goalSize / 2, Canvas.fieldOy + Game.HEIGHT, Canvas.goalSize / 2, 0, Math.PI, true);

		//左右
		ctx.moveTo(Canvas.fieldOx, Canvas.fieldOy + Canvas.sideLength);
		ctx.arc(Canvas.fieldOx, Canvas.fieldOy + Canvas.sideLength + Canvas.goalSize / 2, Canvas.goalSize / 2, Math.PI / 2, -Math.PI / 2, true);
		ctx.moveTo(Canvas.fieldOx + Game.WIDTH, Canvas.fieldOy + Canvas.sideLength);
		ctx.arc(Canvas.fieldOx + Game.WIDTH, Canvas.fieldOy + Canvas.sideLength + Canvas.goalSize / 2, Canvas.goalSize / 2, Math.PI / 2, -Math.PI / 2, false);
		//ctx.stroke();
		//ctx.closePath();

		// ctx.beginPath();
		// ctx.moveTo(Canvas.fieldOx + Canvas.sideLength + Canvas.goalSize/2, Canvas.fieldOy - Canvas.barWidth);
		// ctx.lineTo(Canvas.fieldOx + Game.WIDTH, Canvas.fieldOy + Game.HEIGHT);
		// ctx.moveTo(Canvas.fieldOx + Game.WIDTH, Canvas.fieldOy);
		// ctx.lineTo(Canvas.fieldOx, Canvas.fieldOy + Game.WIDTH);
		// ctx.stroke();

		//Draw Cross
		//ctx.beginPath();
		ctx.moveTo(Canvas.fieldOx, Canvas.fieldOy);
		ctx.lineTo(Canvas.fieldOx + Game.WIDTH, Canvas.fieldOy + Game.HEIGHT);
		ctx.moveTo(Canvas.fieldOx + Game.WIDTH, Canvas.fieldOy);
		ctx.lineTo(Canvas.fieldOx, Canvas.fieldOy + Game.WIDTH);
		ctx.stroke();


		//clearRect(x, y, width, height)
		//ctx.clearRect(45,45,fieldWidth-100,fieldHeight-100);

		// ctx.strokeRect(50,50,50,50);
	}
	users.forEach(function(user) {
		Canvas.drawUser(user);
	});
	pads.forEach(function(pad) {
		Canvas.drawPad(pad);
	});
	//window.requestAnimationFrame(Canvas.drawField(users, pads));
};

//x,y <- UserPosition
Canvas.drawUser = function(user) {
	var canvas = document.getElementById('canvasField'),
		userRadius = User.RADIUS;

	x = user.x + Canvas.fieldOx;
	y = user.y + Canvas.fieldOy;

	if (canvas.getContext) {
		var ctx = canvas.getContext('2d');

		ctx.beginPath();
		ctx.arc(x, y, userRadius, 0, Math.PI * 2, true);
		//arc(x, y, radius, startAngle, endAngle, anticlockwise)
		ctx.fillStyle = Canvas.colors[user.teamId];
		ctx.fill();
		ctx.stroke();

	}
};

Canvas.drawPad = function(pad) {
	var padRadius = Pad.RADIUS;
	var canvas = document.getElementById('canvasField');

	x = pad.x + Canvas.fieldOx;
	y = pad.y + Canvas.fieldOy;

	if (canvas.getContext) {
		var ctx = canvas.getContext('2d');

		ctx.beginPath();
		ctx.arc(x, y, padRadius, 0, Math.PI * 2, true);
		//arc(x, y, radius, startAngle, endAngle, anticlockwise)
		ctx.fillStyle = '#000';
		ctx.fill();
		ctx.stroke();
	}
};
