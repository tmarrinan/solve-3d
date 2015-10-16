precision mediump float;

uniform sampler2D rgb_image;
varying vec2 v_texCoord;

void main() {
	vec2 lhalf = vec2(v_texCoord.x * 0.5, v_texCoord.y);
	vec2 rhalf = vec2(0.5 + (v_texCoord.x * 0.5), v_texCoord.y);

	vec3 rgbl = texture2D(rgb_image, rhalf).rgb;
	vec3 rgbr = texture2D(rgb_image, lhalf).rgb;
	float g = rgbr.g + 0.45 * max(0.0, rgbr.r - rgbr.g);
	float b = rgbr.b + 0.25 * max(0.0, rgbr.r - rgbr.b);
	float r = g * 0.749 + b * 0.251;
	g = rgbl.g + + 0.45 * max(0.0, rgbl.r - rgbl.g);
	b = rgbl.b + + 0.25 * max(0.0, rgbl.r - rgbl.b);

	gl_FragColor = vec4(clamp(r, 0.0, 1.0), clamp(g, 0.0, 1.0), clamp(b, 0.0, 1.0), 1.0);
}
