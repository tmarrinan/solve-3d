"use strict";

function stereoVideoWebGL(ctx) {
	if (ctx === undefined || ctx === null) return;

	this.gl = ctx;
	this.shaderProgram = null;
	this.pMatrix = null;
	this.rgbaTexture = null;
	this.vertexPositionBuffer = null;
	this.vertexTextureCoordBuffer = null;
	this.vertexIndexBuffer = null;

	this.gl.clearColor(0.5, 0.5, 0.5, 1.0);

	this.pMatrix = mat4.create();
	this.initBuffers();

	this.program = "whole";
	this.shaderPrograms = {
		"anaglyph_rc-rl": null,
		"anaglyph_rc-lr": null,
		"anaglyph_rc-tb": null,
		"anaglyph_rc-bt": null,
		"anaglyph_gm-rl": null,
		"anaglyph_gm-lr": null,
		"anaglyph_gm-tb": null,
		"anaglyph_gm-bt": null,
		"anaglyph_ab-rl": null,
		"anaglyph_ab-lr": null,
		"anaglyph_ab-tb": null,
		"anaglyph_ab-bt": null,
		"interleave-rl": null,
		"interleave-lr": null,
		"interleave-tb": null,
		"interleave-bt": null,
		"left": null,
		"right": null,
		"top": null,
		"bottom": null,
		"whole": null
	};
	for (var key in this.shaderPrograms) {
		this.initShaders(key);
	}
}

stereoVideoWebGL.prototype.resize = function() {
	mat4.ortho(-1.0, 1.0, -1.0, 1.0, -1, 1, this.pMatrix);
	if (this.shaderPrograms[this.program] !== null) {
		this.gl.uniformMatrix4fv(this.shaderPrograms[this.program].pMatrixUniform, false, this.pMatrix);
	}
	this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
};

stereoVideoWebGL.prototype.initShaders = function(type) {
	var vertexShader = null;
	var fragmentShader = null;
	var _this = this;
	console.log("Compiling shader: " + type);
	httpGet("shaders/video.vert", function(err, text) {
		if (err) throw new Error("Unable to access shader: \"shaders/video.vert\"");
		vertexShader = _this.compileShader(text, _this.gl.VERTEX_SHADER);
		if (fragmentShader !== null) _this.createShaderProgram(type, vertexShader, fragmentShader);
	});
	httpGet("shaders/" + type + ".frag", function(err, text) {
		if (err) throw new Error("Unable to access shader: \"shaders/" + type + ".frag\"");
		fragmentShader = _this.compileShader(text, _this.gl.FRAGMENT_SHADER);
		if (vertexShader !== null) _this.createShaderProgram(type, vertexShader, fragmentShader);
	});
};

stereoVideoWebGL.prototype.createShaderProgram = function(type, vertexShader, fragmentShader) {
	var shaderProgram = this.gl.createProgram();
	this.gl.attachShader(shaderProgram, vertexShader);
	this.gl.attachShader(shaderProgram, fragmentShader);
	this.gl.linkProgram(shaderProgram);

	// If creating the shader program failed, alert
	if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
		throw new Error("Unable to initialize the shader program");
	}

	// set vertex array
	shaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(shaderProgram, "a_position");
	this.gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
	// set texture coord array
	shaderProgram.textureCoordAttribute = this.gl.getAttribLocation(shaderProgram, "a_texCoord");
	this.gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

	// set view matrix
	shaderProgram.pMatrixUniform = this.gl.getUniformLocation(shaderProgram, "p_matrix");

	// set image texture
	shaderProgram.samplerUniform1 = this.gl.getUniformLocation(shaderProgram, "rgb_image");

	this.shaderPrograms[type] = shaderProgram;
	if (allNonNullDict(this.shaderPrograms)) {
		console.log("All Shaders Compiled!");
		this.gl.useProgram(this.shaderPrograms[this.program]);
		this.gl.uniformMatrix4fv(this.shaderPrograms[this.program].pMatrixUniform, false, this.pMatrix);
	}
};

stereoVideoWebGL.prototype.compileShader = function (source, type) {
	// Create the shader object
	var shader = this.gl.createShader(type);
	// Send the source to the shader object
	this.gl.shaderSource(shader, source);
	// Compile the shader program
	this.gl.compileShader(shader);
	// See if it compiled successfully
	if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
		throw new Error("An error occurred compiling the shader: " + this.gl.getShaderInfoLog(shader));
	}
	return shader;
 };

stereoVideoWebGL.prototype.initBuffers = function() {
	// vertices
	this.vertexPositionBuffer = this.gl.createBuffer();
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
	var vertices = [
		-1.0, -1.0,
		 1.0, -1.0,
		-1.0,  1.0,
		 1.0,  1.0
	];
	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
	this.vertexPositionBuffer.itemSize = 2;
	this.vertexPositionBuffer.numItems = 4;

	// texture
	this.vertexTextureCoordBuffer = this.gl.createBuffer();
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
	var textureCoords = [
		0.0,  1.0,
		1.0,  1.0,
		0.0,  0.0,
		1.0,  0.0
	];
	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(textureCoords), this.gl.STATIC_DRAW);
	this.vertexTextureCoordBuffer.itemSize = 2;
	this.vertexTextureCoordBuffer.numItems = 4;

	// faces of triangles
	this.vertexIndexBuffer = this.gl.createBuffer();
	this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
	var vertexIndices = [0, 1, 2,   2, 1, 3];
	this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), this.gl.STATIC_DRAW);
	this.vertexIndexBuffer.itemSize = 1;
	this.vertexIndexBuffer.numItems = 6;
};

stereoVideoWebGL.prototype.initTextures = function(videoElement) {
	this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false);
	this.rgbaTexture = this.gl.createTexture();

	this.gl.bindTexture(this.gl.TEXTURE_2D, this.rgbaTexture);
	this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, videoElement);

	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

	this.gl.bindTexture(this.gl.TEXTURE_2D, null);
};

stereoVideoWebGL.prototype.updateTextures = function(videoElement) {
	if (this.rgbaTexture === null) return;
	
	this.gl.bindTexture(this.gl.TEXTURE_2D, this.rgbaTexture);
	this.gl.texSubImage2D(this.gl.TEXTURE_2D, 0, 0, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, videoElement);
	this.gl.bindTexture(this.gl.TEXTURE_2D, null);
};

stereoVideoWebGL.prototype.updateStereoMode = function(mode) {
	this.program = mode;
	this.gl.useProgram(this.shaderPrograms[this.program]);
	this.gl.uniformMatrix4fv(this.shaderPrograms[this.program].pMatrixUniform, false, this.pMatrix);
};

stereoVideoWebGL.prototype.draw = function() {
	this.gl.clear(this.gl.COLOR_BUFFER_BIT);

	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
	this.gl.vertexAttribPointer(this.shaderPrograms[this.program].vertexPositionAttribute, this.vertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
	this.gl.vertexAttribPointer(this.shaderPrograms[this.program].textureCoordAttribute, this.vertexTextureCoordBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

	this.gl.activeTexture(this.gl.TEXTURE0);
	this.gl.bindTexture(this.gl.TEXTURE_2D, this.rgbaTexture);
	this.gl.uniform1i(this.shaderPrograms[this.program].samplerUniform1, 0);

	this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
	this.gl.drawElements(this.gl.TRIANGLES, this.vertexIndexBuffer.numItems, this.gl.UNSIGNED_SHORT, 0);
};

