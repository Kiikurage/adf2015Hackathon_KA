//左上座標と幅、高さ

//var canvas = document.getElementById('canvasField');

Canvas = function() {};

Canvas.fieldOx = 25;
Canvas.fieldOy = 25;
Canvas.fieldWidth = 1000;
Canvas.fieldHeight = 1000;

Canvas.goalSize = 100;
Canvas.barWidth = 30;
Canvas.sideLength = Canvas.fieldWidth/2 - Canvas.barWidth;


//フィールドを描画
Canvas.drawField = function(users, pads) {
	//if (!(this instanceof drawField)) return new drawField(socket);

	var canvas = document.getElementById('canvasField'),
		userRadius = User.RADIUS;

	if (canvas.getContext) {
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, Canvas.fieldWidth, Canvas.fieldHeight);

		//Draw Field
		//strokeRect(x, y, width, height)
		ctx.fillStyle = "black";
		ctx.fillRect(Canvas.fieldOx, Canvas.fieldOy, Canvas.fieldWidth, Canvas.fieldHeight);
		ctx.clearRect(Canvas.fieldOx + Canvas.barWidth , Canvas.fieldOy + Canvas.barWidth, Canvas.fieldWidth - 2*Canvas.barWidth, Canvas.fieldHeight - 2*Canvas.barWidth);

		//DrawGoals
		//上下
		ctx.clearRect(Canvas.fieldOx + Canvas.barWidth + Canvas.sideLength, Canvas.fieldOy, Canvas.goalSize, Canvas.barWidth);
		ctx.clearRect(Canvas.fieldOx + Canvas.barWidth + Canvas.sideLength, Canvas.fieldOy + Canvas.fieldHeight - Canvas.barWidth, Canvas.goalSize, Canvas.barWidth);
		//左右
		ctx.clearRect(Canvas.fieldOx, Canvas.fieldOy + Canvas.barWidth + Canvas.sideLength, Canvas.barWidth, Canvas.goalSize);
		ctx.clearRect(Canvas.fieldOx + Canvas.fieldWidth - Canvas.barWidth, Canvas.fieldOy + Canvas.barWidth + Canvas.sideLength, Canvas.barWidth, Canvas.goalSize);

		//Draw Cross
		ctx.beginPath();
		ctx.moveTo(Canvas.fieldOx, Canvas.fieldOy);
		ctx.lineTo(Canvas.fieldOx + Canvas.fieldWidth, Canvas.fieldOy + Canvas.fieldHeight);
		ctx.moveTo(Canvas.fieldOx + Canvas.fieldWidth, Canvas.fieldOy);
		ctx.lineTo(Canvas.fieldOx, Canvas.fieldOy + Canvas.fieldWidth);
		ctx.stroke();

		//clearRect(x, y, width, height)
		//ctx.clearRect(45,45,fieldWidth-100,fieldHeight-100);

		// ctx.strokeRect(50,50,50,50);
	}
	for (i = 0; i < 10; i++) {
		var x = Math.round(Math.random() * Canvas.fieldWidth - userRadius);
		var y = Math.round(Math.random() * (Canvas.fieldHeight - userRadius));
		Canvas.drawUser(x, y, i < 5 ? "blue" : "red");
	}
	pads.forEach(function(pad) {
		Canvas.drawPad(pad.x, pad.y);
	});
	//window.requestAnimationFrame(Canvas.drawField(users, pads));
};

//x,y <- UserPosition
Canvas.drawUser = function(x, y, color) {
	var canvas = document.getElementById('canvasField'),
		userRadius = User.RADIUS;

	if (canvas.getContext) {
		var ctx = canvas.getContext('2d');

		ctx.beginPath();
		ctx.arc(x, y, userRadius, 0, Math.PI * 2, true);
		//arc(x, y, radius, startAngle, endAngle, anticlockwise)
		ctx.fillStyle = color;
		ctx.fill();
		ctx.stroke();

	}
};

Canvas.drawPad = function(x, y) {
	var padRadius = Pad.RADIUS;
	var canvas = document.getElementById('canvasField');

	if (canvas.getContext) {
		var ctx = canvas.getContext('2d');

		ctx.beginPath();
		ctx.arc(x, y, padRadius, 0, Math.PI * 2, true);
		//arc(x, y, radius, startAngle, endAngle, anticlockwise)
		ctx.fillStyle = "green";
		ctx.fill();
		ctx.stroke();
	}
};
