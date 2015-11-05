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
};

stereoVideo2D.prototype.draw = function() {
	if (this.video === null) return;

	switch (this.stereoMode) {
		case "anaglyph_rc-rl":
			this.drawAnaglyphRCRL();
			break;
		case "anaglyph_rc-lr":
			this.drawAnaglyphRCLR();
			break;
		case "anaglyph_rc-tb":
			this.drawAnaglyphRCTB();
			break;
		case "anaglyph_rc-bt":
			this.drawAnaglyphRCBT();
			break;
		case "anaglyph_gm-rl":
			this.drawAnaglyphGMRL();
			break;
		case "anaglyph_gm-lr":
			this.drawAnaglyphGMLR();
			break;
		case "anaglyph_gm-tb":
			this.drawAnaglyphGMTB();
			break;
		case "anaglyph_gm-bt":
			this.drawAnaglyphGMBT();
			break;
		case "anaglyph_ab-rl":
			this.drawAnaglyphABRL();
			break;
		case "anaglyph_ab-lr":
			this.drawAnaglyphABLR();
			break;
		case "anaglyph_ab-tb":
			this.drawAnaglyphABTB();
			break;
		case "anaglyph_ab-bt":
			this.drawAnaglyphABBT();
			break;
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

stereoVideo2D.prototype.processAnaglyph = function(leftEye, rightEye, colormode) {
	var idr, idg, idb;
	var r, g, b;
	var x = 0;
	var y = rightEye.width * rightEye.height;
	var index = 0;

	var tmpCanvas = document.createElement('canvas');
	var tmpCtx = tmpCanvas.getContext('2d');
	tmpCanvas.width  = nativeWidth;
	tmpCanvas.height = nativeHeight;

	tmpCtx.drawImage(this.video, 0, 0, nativeWidth, nativeHeight);
	var iData1 = tmpCtx.getImageData(rightEye.x, rightEye.y, rightEye.width, rightEye.height);
	var iData2 = tmpCtx.getImageData(leftEye.x, leftEye.y, leftEye.width, leftEye.height);
	var oData = tmpCtx.createImageData(rightEye.width, rightEye.height);

	if (colormode === "red-cyan") {
		idr = iData1;
		idg = iData2;
		idb = iData2;
	}
	else if (colormode === "green-magenta") {
		idr = iData2;
		idg = iData1;
		idb = iData2;
	}
	else if (colormode === "amber-blue") {
		idr = iData2;
		idg = iData2;
		idb = iData1;
	}

	for (x=0; x<y; x++) {
		g = idr.data[index + 1] + 0.45 * Math.max(0, idr.data[index + 0] - idr.data[index + 1]);
		b = idr.data[index + 2] + 0.25 * Math.max(0, idr.data[index + 0] - idr.data[index + 2]);
		r = g * 0.749 + b * 0.251;
		g = idg.data[index + 1] + 0.45 * Math.max(0, idg.data[index + 0] - idg.data[index + 1]);
		b = idb.data[index + 2] + 0.25 * Math.max(0, idb.data[index + 0] - idb.data[index + 2]);
		r = Math.min(Math.max(r, 0), 255);
		g = Math.min(Math.max(g, 0), 255);
		b = Math.min(Math.max(b, 0), 255);
		oData.data[index + 0] = r;
		oData.data[index + 1] = g;
		oData.data[index + 2] = b;
		oData.data[index + 3] = 255;
		index += 4;
	}

	tmpCtx.putImageData(oData, 0, 0);

	this.ctx.drawImage(tmpCanvas, 0, 0, rightEye.width, rightEye.height, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
};

stereoVideo2D.prototype.processAnaglyphCC = function(leftEye, rightEye, colormode) {
	var rIdx, gIdx, bIdx;
	var x = 0;
	var y = rightEye.width * rightEye.height;
	var index = 0;

	var tmpCanvas = document.createElement('canvas');
	var tmpCtx = tmpCanvas.getContext('2d');
	tmpCanvas.width  = nativeWidth;
	tmpCanvas.height = nativeHeight;

	tmpCtx.drawImage(this.video, 0, 0, nativeWidth, nativeHeight);
	var iData1 = tmpCtx.getImageData(rightEye.x, rightEye.y, rightEye.width, rightEye.height);
	var iData2 = tmpCtx.getImageData(leftEye.x, leftEye.y, leftEye.width, leftEye.height);
	var oData = tmpCtx.createImageData(rightEye.width, rightEye.height);

	if (colormode === "red-cyan") {
		rIdx = 2;
		gIdx = 1;
		bIdx = 0;
	}
	else if (colormode === "green-magenta") {
		rIdx = 0;
		gIdx = 2;
		bIdx = 1;
	}
	else if (colormode === "amber-blue") {
		rIdx = 1;
		gIdx = 0;
		bIdx = 2;
	}

	for (x=0; x<y; x++) {
		oData.data[index + rIdx] = iData2.data[index + rIdx];
		oData.data[index + gIdx] = iData2.data[index + gIdx];
		oData.data[index + bIdx] = parseInt(iData1.data[index + rIdx]*0.15 + iData1.data[index + gIdx]*0.15 + iData1.data[index + bIdx]*0.7, 10);
		oData.data[index + 3] = 255;
		index += 4;
	}

	tmpCtx.putImageData(oData, 0, 0);

	this.ctx.drawImage(tmpCanvas, 0, 0, rightEye.width, rightEye.height, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
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

stereoVideo2D.prototype.drawAnaglyphRCRL = function() {
	var halfWidth = parseInt(nativeWidth / 2, 10);

	var leftEye = {x: halfWidth, y: 0, width: halfWidth, height: nativeHeight};
	var rightEye = {x: 0, y: 0, width: halfWidth, height: nativeHeight};
	
	this.processAnaglyph(leftEye, rightEye, "red-cyan");
};

stereoVideo2D.prototype.drawAnaglyphRCLR = function() {
	var halfWidth = parseInt(nativeWidth / 2, 10);

	var leftEye = {x: 0, y: 0, width: halfWidth, height: nativeHeight};
	var rightEye = {x: halfWidth, y: 0, width: halfWidth, height: nativeHeight};
	
	this.processAnaglyph(leftEye, rightEye, "red-cyan");
};

stereoVideo2D.prototype.drawAnaglyphRCTB = function() {
	var halfHeight = parseInt(nativeHeight / 2, 10);

	var leftEye = {x: 0, y: 0, width: nativeWidth, height: halfHeight};
	var rightEye = {x: 0, y: halfHeight, width: nativeWidth, height: halfHeight};
	
	this.processAnaglyph(leftEye, rightEye, "red-cyan");
};

stereoVideo2D.prototype.drawAnaglyphRCBT = function() {
	var halfHeight = parseInt(nativeHeight / 2, 10);

	var leftEye = {x: 0, y: halfHeight, width: nativeWidth, height: halfHeight};
	var rightEye = {x: 0, y: 0, width: nativeWidth, height: halfHeight};
	
	this.processAnaglyph(leftEye, rightEye, "red-cyan");
};

stereoVideo2D.prototype.drawAnaglyphGMRL = function() {
	var halfWidth = parseInt(nativeWidth / 2, 10);

	var leftEye = {x: halfWidth, y: 0, width: halfWidth, height: nativeHeight};
	var rightEye = {x: 0, y: 0, width: halfWidth, height: nativeHeight};
	
	this.processAnaglyph(leftEye, rightEye, "green-magenta");
};

stereoVideo2D.prototype.drawAnaglyphGMLR = function() {
	var halfWidth = parseInt(nativeWidth / 2, 10);

	var leftEye = {x: 0, y: 0, width: halfWidth, height: nativeHeight};
	var rightEye = {x: halfWidth, y: 0, width: halfWidth, height: nativeHeight};
	
	this.processAnaglyph(leftEye, rightEye, "green-magenta");
};

stereoVideo2D.prototype.drawAnaglyphGMTB = function() {
	var halfHeight = parseInt(nativeHeight / 2, 10);

	var leftEye = {x: 0, y: 0, width: nativeWidth, height: halfHeight};
	var rightEye = {x: 0, y: halfHeight, width: nativeWidth, height: halfHeight};
	
	this.processAnaglyph(leftEye, rightEye, "green-magenta");
};

stereoVideo2D.prototype.drawAnaglyphGMBT = function() {
	var halfHeight = parseInt(nativeHeight / 2, 10);

	var leftEye = {x: 0, y: halfHeight, width: nativeWidth, height: halfHeight};
	var rightEye = {x: 0, y: 0, width: nativeWidth, height: halfHeight};
	
	this.processAnaglyph(leftEye, rightEye, "green-magenta");
};

stereoVideo2D.prototype.drawAnaglyphABRL = function() {
	var halfWidth = parseInt(nativeWidth / 2, 10);

	var leftEye = {x: halfWidth, y: 0, width: halfWidth, height: nativeHeight};
	var rightEye = {x: 0, y: 0, width: halfWidth, height: nativeHeight};
	
	this.processAnaglyphCC(leftEye, rightEye, "amber-blue");
};

stereoVideo2D.prototype.drawAnaglyphABLR = function() {
	var halfWidth = parseInt(nativeWidth / 2, 10);

	var leftEye = {x: 0, y: 0, width: halfWidth, height: nativeHeight};
	var rightEye = {x: halfWidth, y: 0, width: halfWidth, height: nativeHeight};
	
	this.processAnaglyphCC(leftEye, rightEye, "amber-blue");
};

stereoVideo2D.prototype.drawAnaglyphABTB = function() {
	var halfHeight = parseInt(nativeHeight / 2, 10);

	var leftEye = {x: 0, y: 0, width: nativeWidth, height: halfHeight};
	var rightEye = {x: 0, y: halfHeight, width: nativeWidth, height: halfHeight};
	
	this.processAnaglyphCC(leftEye, rightEye, "amber-blue");
};

stereoVideo2D.prototype.drawAnaglyphABBT = function() {
	var halfHeight = parseInt(nativeHeight / 2, 10);

	var leftEye = {x: 0, y: halfHeight, width: nativeWidth, height: halfHeight};
	var rightEye = {x: 0, y: 0, width: nativeWidth, height: halfHeight};
	
	this.processAnaglyphCC(leftEye, rightEye, "amber-blue");
};

stereoVideo2D.prototype.drawInterleaveRL = function() {
	var halfWidth = parseInt(nativeWidth / 2, 10);

	var leftEye = {x: halfWidth, y: 0, width: halfWidth, height: nativeHeight};
	var rightEye = {x: 0, y: 0, width: halfWidth, height: nativeHeight};
	
	this.processInterleave(leftEye, rightEye);
};

stereoVideo2D.prototype.drawInterleaveLR = function() {
	var halfWidth = parseInt(nativeWidth / 2, 10);

	var leftEye = {x: 0, y: 0, width: halfWidth, height: nativeHeight};
	var rightEye = {x: halfWidth, y: 0, width: halfWidth, height: nativeHeight};
	
	this.processInterleave(leftEye, rightEye);
};

stereoVideo2D.prototype.drawInterleaveTB = function() {
	var halfHeight = parseInt(nativeHeight / 2, 10);

	var leftEye = {x: 0, y: 0, width: nativeWidth, height: halfHeight};
	var rightEye = {x: 0, y: halfHeight, width: nativeWidth, height: halfHeight};
	
	this.processInterleave(leftEye, rightEye);
};

stereoVideo2D.prototype.drawInterleaveBT = function() {
	var halfHeight = parseInt(nativeHeight / 2, 10);

	var leftEye = {x: 0, y: halfHeight, width: nativeWidth, height: halfHeight};
	var rightEye = {x: 0, y: 0, width: nativeWidth, height: halfHeight};
	
	this.processInterleave(leftEye, rightEye);
};

stereoVideo2D.prototype.drawLeftHalf = function() {
	var halfWidth = parseInt(nativeWidth / 2, 10);
	this.ctx.drawImage(this.video, 0 , 0, halfWidth, nativeHeight, 0 , 0, this.ctx.canvas.width, this.ctx.canvas.height);
};

stereoVideo2D.prototype.drawRightHalf = function() {
	var halfWidth = parseInt(nativeWidth / 2, 10);
	this.ctx.drawImage(this.video, halfWidth , 0, halfWidth, nativeHeight, 0 , 0, this.ctx.canvas.width, this.ctx.canvas.height);
};

stereoVideo2D.prototype.drawTopHalf = function() {
	var halfHeight = parseInt(nativeHeight / 2, 10);
	this.ctx.drawImage(this.video, 0 , 0, nativeWidth, halfHeight, 0 , 0, this.ctx.canvas.width, this.ctx.canvas.height);
};

stereoVideo2D.prototype.drawBottomHalf = function() {
	var halfHeight = parseInt(nativeHeight / 2, 10);
	this.ctx.drawImage(this.video, 0 , halfHeight, nativeWidth, halfHeight, 0 , 0, this.ctx.canvas.width, this.ctx.canvas.height);
};

stereoVideo2D.prototype.drawWholeVideo = function() {
	this.ctx.drawImage(this.video, 0 , 0, this.ctx.canvas.width, this.ctx.canvas.height);
};
