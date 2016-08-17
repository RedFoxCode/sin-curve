function initCanvas() {
	var container = document.getElementsByClassName("container")[0];

	canvas = document.createElement("canvas");

	canvas.width = w = innerWidth;
	canvas.height = h = innerHeight;

	container.appendChild(canvas);

	ctx = canvas.getContext("2d");

	ctx.shadowBlur = 5;
	ctx.shadowColor = "#000";
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


	while ((y = queue.shift()) != undefined) {
		x += step;

		if ((y > h) || (y < 0))
			continue;

		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(
			x + step,
			queue[0] || y
		);
		ctx.stroke();

		ctx.fillStyle = ctx.strokeStyle = colorQueue.shift();

		ctx.fillRect(
			x - 4,
			y - 4,
			7,
			7
		);

		if (x > w) 
			break;
	}
}

function curve(height, width, step, limit, ctx, fn, start) {
	ctx.fillStyle = "#222";

	ctx.fillRect(0, 0, w, h);

	var q = getQueue(start, h / 2, step, height, limit, fn);
	var c = getColorQueue(limit);

	renderCurve(q, c, ctx, width);
}

initCanvas();

function newCurve() {
	if (this != window) {
		kWidth = 1;
		kX = 0;
	}

	var args = [];

	args.push(Number(document.getElementById("input_height").value));
	args.push(Number(document.getElementById("input_width").value) * kWidth);
	args.push(Number(document.getElementById("input_step").value));
	args.push(Number(document.getElementById("input_limit").value));

	args.push(ctx);
	args.push(Math[document.getElementById("input_fn").value.toLowerCase()]);

	args.push(kX);

	curve.apply(this, args);
}

var kWidth = 1;

var kX = 0;

canvas.addEventListener("mousewheel", function(e) {
	kWidth += -e.deltaY / 1000;

	newCurve();
});

canvas.addEventListener("mousedown", function(e){
    kX += -(e.clientX > w / 2) || 1;

    newCurve();
});


newCurve();