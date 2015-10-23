precision mediump float;

uniform sampler2D rgb_image;
varying vec2 v_texCoord;

void main() {
	vec2 thalf = vec2(v_texCoord.x, v_texCoord.y * 0.5);
	vec2 bhalf = vec2(v_texCoord.x, 0.5 + (v_texCoord.y * 0.5));

	vec3 rgbl = texture2D(rgb_image, thalf).rgb;
	vec3 rgbr = texture2D(rgb_image, bhalf).rgb;
	float g = rgbl.g + 0.45 * max(0.0, rgbl.r - rgbl.g);
	float b = rgbl.b + 0.25 * max(0.0, rgbl.r - rgbl.b);
	float r = g * 0.749 + b * 0.251;
	g = rgbr.g + 0.45 * max(0.0, rgbr.r - rgbr.g);
	b = rgbl.b + 0.25 * max(0.0, rgbl.r - rgbl.b);

	gl_FragColor = vec4(clamp(r, 0.0, 1.0), clamp(g, 0.0, 1.0), clamp(b, 0.0, 1.0), 1.0);
}