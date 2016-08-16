function initCanvas() {
	var container = document.getElementsByClassName("container")[0];

	var canvas = document.createElement("canvas");

	canvas.width = w = innerWidth;
	canvas.height = h = innerHeight;

	container.appendChild(canvas);

	ctx = canvas.getContext("2d");
}

function getQueue(start, y, step, height, limit, fn) {
	var queue = [];

	var count = start;

	while (queue.push(fn(count) * height + y) < limit) {
		count += step;
	}

	return queue;
}

function getColorQueue(limit) {
	var frequency = .3;

	var queue = [];

	var c = 0;

	while (c++ < limit) {
    	r = Math.round(Math.sin(frequency * c + 0) * 127 + 128);
   		g = Math.round(Math.sin(frequency * c + 2) * 127 + 128);
   		b = Math.round(Math.sin(frequency * c + 4) * 127 + 128);

   		queue.push(
			"rgba(" 
			+ r + "," 
			+ g + "," 
			+ b + ",0.8)"
		);
	}

	return queue;
}

function renderCurve(queue, colorQueue, ctx, step) {
	var y = 0;

	var x = 0;

	ctx.strokeStyle = "#fff";

	while ((y = queue.shift()) != undefined) {
		x += step;

		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(
			x + step,
			queue[0] || y
		);
		ctx.stroke();

		ctx.fillStyle = colorQueue.shift();

		ctx.fillRect(
			x - 4,
			y - 4,
			7,
			7
		);
	}
}

function curve(height, width, step, limit, ctx, fn) {
	ctx.fillStyle = "#222";

	ctx.fillRect(0, 0, w, h);

	var q = getQueue(0, h / 2, step, height, limit, fn);
	var c = getColorQueue(limit);

	renderCurve(q, c, ctx, width);
}

initCanvas();

function newCurve() {
	var args = [];

	args.push(Number(document.getElementById("input_height").value));
	args.push(Number(document.getElementById("input_width").value));
	args.push(Number(document.getElementById("input_step").value));
	args.push(Number(document.getElementById("input_limit").value));

	args.push(ctx);
	args.push(Math[document.getElementById("input_fn").value.toLowerCase()]);

	curve.apply(this, args);
}

newCurve();