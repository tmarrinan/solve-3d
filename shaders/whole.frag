precision mediump float;

uniform sampler2D rgb_image;
varying vec2 v_texCoord;

void main() {
	gl_FragColor = vec4(texture2D(rgb_image, v_texCoord).rgb, 1.0);
}
