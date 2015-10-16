precision mediump float;

uniform sampler2D rgb_image;
varying vec2 v_texCoord;

void main() {
	vec2 bhalf = vec2(v_texCoord.x, 0.5 + (v_texCoord.y * 0.5));
	gl_FragColor = vec4(texture2D(rgb_image, bhalf).rgb, 1.0);
}
