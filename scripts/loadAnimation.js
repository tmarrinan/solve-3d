function loadAnimation(ctx) {
	this.ctx = ctx;
	this.timestamp = null;
	this.t = 0;
}

loadAnimation.prototype.draw = function(timestamp) {
	if (this.timestamp !== null) this.t += timestamp - this.timestamp;

	var i;

	// clear canvas		
	this.ctx.clearRect(0,0, this.ctx.canvas.width, this.ctx.canvas.height);

	// circle of dots
	var minDim = Math.min(this.ctx.canvas.width, this.ctx.canvas.height);
	var radius  = 0.45 * minDim;
	var center = {x: this.ctx.canvas.width / 2, y: this.ctx.canvas.height / 2};

	var theta = 0;
	var x;
	var y;

	var highlight = parseInt(this.t / 100, 10) % 10;
	for (i=0; i<10; i++) {
		theta += 36 * Math.PI/180;
		x = center.x + radius * Math.cos(theta);
		y = center.y + radius * Math.sin(theta);

		if (i === highlight)
			this.ctx.fillStyle = "rgba( 82, 108, 112, 0.8)";
		else if ((i+1) % 10 === highlight)
			this.ctx.fillStyle = "rgba( 52,  69,  71, 0.8)";
		else
			this.ctx.fillStyle = "rgba( 37,  49,  51, 0.8)";

		this.ctx.beginPath();
		this.ctx.arc(x, y, 0.05 * minDim, 0, Math.PI*2, true);
		this.ctx.closePath();
		this.ctx.fill();
	}

	this.timestamp = timestamp;
}

loadAnimation.prototype.stop = function() {
	this.timestamp = null;
	this.t = 0;
}
