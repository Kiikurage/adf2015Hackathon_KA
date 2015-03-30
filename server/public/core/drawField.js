const userRadius = 30;
const padRadius = 10;
//左上座標と幅、高さ
const fieldOx = 25;
const fieldOy = 25;
const fieldWidth = 1000;
const fieldHeight = 1000;

//var canvas = document.getElementById('canvasField');

//フィールドを描画
function drawField(users, pads) {
	//if (!(this instanceof drawField)) return new drawField(socket);

	var canvas = document.getElementById('canvasField');

	if (canvas.getContext) {
		var ctx = canvas.getContext('2d');

		//strokeRect(x, y, width, height)
		ctx.fillStyle = "yellow";
		ctx.strokeRect(fieldOx, fieldOy, fieldWidth, fieldHeight);
		ctx.beginPath();
		ctx.moveTo(fieldOx, fieldOy);
		ctx.lineTo(fieldOx + fieldWidth, fieldOy + fieldHeight);
		ctx.moveTo(fieldOx + fieldWidth, fieldOy);
		ctx.lineTo(fieldOx, fieldOy + fieldWidth);
		ctx.stroke();
		//clearRect(x, y, width, height)
		//ctx.clearRect(45,45,fieldWidth-100,fieldHeight-100);

		// ctx.strokeRect(50,50,50,50);
	}
	for (i = 0; i < 10; i++) {
		var x = Math.round(Math.random() * fieldWidth - userRadius);
		var y = Math.round(Math.random() * (fieldHeight - userRadius));
		drawUser(x, y, i < 5 ? "blue" : "red");
	}
	pads.forEach(function(pad) {
		drawPad(pad.x, pad.y);
	});
	// for (i = 0; i < 2; i++) {
	// 	var x = Math.round(Math.random() * fieldWidth - userRadius);
	// 	var y = Math.round(Math.random() * (fieldHeight - userRadius));
	// 	drawPad(x, y);
	// }
}

//x,y <- UserPosition
function drawUser(x, y, color) {
	var canvas = document.getElementById('canvasField');

	if (canvas.getContext) {
		var ctx = canvas.getContext('2d');

		ctx.beginPath();
		ctx.arc(x, y, userRadius, 0, Math.PI * 2, true);
		//arc(x, y, radius, startAngle, endAngle, anticlockwise)
		ctx.fillStyle = color;
		ctx.fill();
		ctx.stroke();

	}
}

function drawPad(x, y) {

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
}
