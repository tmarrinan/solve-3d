precision mediump float;

uniform sampler2D rgb_image;
varying vec2 v_texCoord;

void main() {
	vec2 thalf = vec2(v_texCoord.x, v_texCoord.y * 0.5);
	vec2 bhalf = vec2(v_texCoord.x, 0.5 + (v_texCoord.y * 0.5));

	vec3 rgbl = texture2D(rgb_image, bhalf).rgb;
	vec3 rgbr = texture2D(rgb_image, thalf).rgb;

	vec3 coeff = vec3(0.15, 0.15, 0.7);
	vec3 col = vec3(rgbl.r, rgbl.g, dot(rgbr, coeff));

	gl_FragColor = vec4(col, 1.0);
}
