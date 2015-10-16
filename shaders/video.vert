uniform mat4 p_matrix;

attribute vec2 a_position;
attribute vec2 a_texCoord;

varying vec2 v_texCoord;

void main() {
	gl_Position = p_matrix * vec4(a_position, 0, 1);
	v_texCoord = a_texCoord;
}
