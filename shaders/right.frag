precision mediump float;

uniform sampler2D rgb_image;
varying vec2 v_texCoord;

void main() {
	vec2 rhalf = vec2(0.5 + (v_texCoord.x * 0.5), v_texCoord.y);
	gl_FragColor = vec4(texture2D(rgb_image, rhalf).rgb, 1.0);
}
