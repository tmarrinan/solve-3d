"use strict";

function stereoVideo2D(ctx) {
	this.ctx = ctx;
	this.video = null;
	this.stereoMode = "whole";
}

stereoVideo2D.prototype.resize = function() {
	
};

stereoVideo2D.prototype.initTextures = function(videoElement) {
	this.video = videoElement;
};

stereoVideo2D.prototype.updateTextures = function(videoElement) {
	this.video = videoElement;
};

stereoVideo2D.prototype.updateStereoMode = function(mode) {
	this.stereoMode = mode;
	if (this.video !== null) this.draw();
};

stereoVideo2D.prototype.draw = function() {
	switch (this.stereoMode) {
		case "interleave-rl":
			this.drawInterleaveRL();
			break;
		case "interleave-lr":
			this.drawInterleaveLR();
			break;
		case "interleave-tb":
			this.drawInterleaveTB();
			break;
		case "interleave-bt":
			this.drawInterleaveBT();
			break;
		case "left":
			this.drawLeftHalf();
			break;
		case "right":
			this.drawRightHalf();
			break;
		case "top":
			this.drawTopHalf();
			break;
		case "bottom":
			this.drawBottomHalf();
			break;
		case "whole":
			this.drawWholeVideo();
			break;
	}
};

stereoVideo2D.prototype.processInterleave = function(leftEye, rightEye) {
	// draw right eye
	this.ctx.drawImage(this.video, rightEye.x , rightEye.y, rightEye.width, rightEye.height, 0 , 0, this.ctx.canvas.width, this.ctx.canvas.height);

	// clip path - show only even lines
	this.ctx.save();

	this.ctx.lineWidth = 1;
	this.ctx.beginPath();
	for (var i=0; i<this.ctx.canvas.height; i+=2) {
		this.ctx.moveTo(0, i);
		this.ctx.lineTo(this.ctx.canvas.width, i);
		this.ctx.lineTo(this.ctx.canvas.width, i+1);
		this.ctx.lineTo(0, i+1);
	}
	this.ctx.closePath();
	this.ctx.clip();

	// draw left eye
	this.ctx.drawImage(this.video, leftEye.x , leftEye.y, leftEye.width, leftEye.height, 0 , 0, this.ctx.canvas.width, this.ctx.canvas.height);

	// reset clip to default
	this.ctx.restore();
};

stereoVideo2D.prototype.drawInterleaveRL = function() {
	var halfWidth = parseInt(this.video.videoWidth / 2, 10);

	var leftEye = {x: halfWidth, y: 0, width: halfWidth, height: this.video.videoHeight};
	var rightEye = {x: 0, y: 0, width: halfWidth, height: this.video.videoHeight};
	
	this.processInterleave(leftEye, rightEye);
};

stereoVideo2D.prototype.drawInterleaveLR = function() {
	var halfWidth = parseInt(this.video.videoWidth / 2, 10);

	var leftEye = {x: 0, y: 0, width: halfWidth, height: this.video.videoHeight};
	var rightEye = {x: halfWidth, y: 0, width: halfWidth, height: this.video.videoHeight};
	
	this.processInterleave(leftEye, rightEye);
};

stereoVideo2D.prototype.drawInterleaveTB = function() {
	var halfHeight = parseInt(this.video.videoHeight / 2, 10);

	var leftEye = {x: 0, y: 0, width: this.video.videoWidth, height: halfHeight};
	var rightEye = {x: 0, y: halfHeight, width: this.video.videoWidth, height: halfHeight};
	
	this.processInterleave(leftEye, rightEye);
};

stereoVideo2D.prototype.drawInterleaveBT = function() {
	var halfHeight = parseInt(this.video.videoHeight / 2, 10);

	var leftEye = {x: 0, y: halfHeight, width: this.video.videoWidth, height: halfHeight};
	var rightEye = {x: 0, y: 0, width: this.video.videoWidth, height: halfHeight};
	
	this.processInterleave(leftEye, rightEye);
};

stereoVideo2D.prototype.drawLeftHalf = function() {
	var halfWidth = parseInt(this.video.videoWidth / 2, 10);
	this.ctx.drawImage(this.video, 0 , 0, halfWidth, this.video.videoHeight, 0 , 0, this.ctx.canvas.width, this.ctx.canvas.height);
};

stereoVideo2D.prototype.drawRightHalf = function() {
	var halfWidth = parseInt(this.video.videoWidth / 2, 10);
	this.ctx.drawImage(this.video, halfWidth , 0, halfWidth, this.video.videoHeight, 0 , 0, this.ctx.canvas.width, this.ctx.canvas.height);
};

stereoVideo2D.prototype.drawTopHalf = function() {
	var halfHeight = parseInt(this.video.videoHeight / 2, 10);
	this.ctx.drawImage(this.video, 0 , 0, this.video.videoWidth, halfHeight, 0 , 0, this.ctx.canvas.width, this.ctx.canvas.height);
};

stereoVideo2D.prototype.drawBottomHalf = function() {
	var halfHeight = parseInt(this.video.videoHeight / 2, 10);
	this.ctx.drawImage(this.video, 0 , halfHeight, this.video.videoWidth, halfHeight, 0 , 0, this.ctx.canvas.width, this.ctx.canvas.height);
};

stereoVideo2D.prototype.drawWholeVideo = function() {
	this.ctx.drawImage(this.video, 0 , 0, this.ctx.canvas.width, this.ctx.canvas.height);
};
