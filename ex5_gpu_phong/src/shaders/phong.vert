// #TASK_FILE 3
// File for task 3

// Vertex attributes, specified in the "attributes" entry of the pipeline
attribute vec3 position;
attribute vec2 tex_coord;
attribute vec3 normal;

// Per-vertex outputs passed on to the fragment shader
varying vec2 v2f_tex_coord;
varying vec3 v2f_normal; // normal vector in camera coordinates
varying vec3 v2f_dir_to_light; // direction to light source
varying vec3 v2f_dir_from_view; // viewing vector (from eye to vertex in view coordinates)

// Global variables specified in "uniforms" entry of the pipeline

uniform mat4 mat_mvp;
uniform mat4 mat_model_view;
uniform mat3 mat_normals; // mat3 not 4, because normals are only rotated and not translated

// normal matrix defines the transformation of the object’s normals
// from the model coordinate system to the view coordinate system.

uniform vec4 light_position; //in camera space coordinates already

void main() {
	v2f_tex_coord = tex_coord;

	/** TODO 3.2:
	Setup all outgoing variables so that you can compute in the fragmend shader
    the phong lighting. You will need to setup all the uniforms listed above, before you
    can start coding this shader.

    Hint: Compute the vertex position, normal and light_position in eye space.
    Hint: Write the final vertex position to gl_Position
    */
	// viewing vector (from camera to vertex in view coordinates), camera is at vec3(0, 0, 0) in cam coords
	v2f_dir_from_view = mat_normals * position;//v
	// direction to light source
	v2f_dir_to_light = vec3(light_position[0],light_position[1],light_position[2]) ; //r
	// transform normal to camera coordinates
	v2f_normal = mat_normals * normal; //n

	gl_Position = mat_mvp * vec4(position, 1); // TODO apply mvp matrix
}
