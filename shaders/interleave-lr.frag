precision mediump float;

uniform sampler2D rgb_image;
varying vec2 v_texCoord;

void main() {
	vec2 lhalf = vec2(v_texCoord.x * 0.5, v_texCoord.y);
	vec2 rhalf = vec2(0.5 + (v_texCoord.x * 0.5), v_texCoord.y);

	if (gl_FragCoord.y/2.0 - float(int(gl_FragCoord.y/2.0)) < 0.5)
		gl_FragColor = vec4(texture2D(rgb_image, lhalf).rgb, 1.0);
	else
		gl_FragColor = vec4(texture2D(rgb_image, rhalf).rgb, 1.0);
}
