precision mediump float;

uniform sampler2D rgb_image;
varying vec2 v_texCoord;

void main() {
	vec2 thalf = vec2(v_texCoord.x, v_texCoord.y * 0.5);
	vec2 bhalf = vec2(v_texCoord.x, 0.5 + (v_texCoord.y * 0.5));

	if (gl_FragCoord.y/2.0 - float(int(gl_FragCoord.y/2.0)) < 0.5)
		gl_FragColor = vec4(texture2D(rgb_image, thalf).rgb, 1.0);
	else
		gl_FragColor = vec4(texture2D(rgb_image, bhalf).rgb, 1.0);
}
