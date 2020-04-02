// #TASK_FILE 3
// File for task 3
precision mediump float;

varying vec2 v2f_tex_coord;
varying vec3 v2f_normal; // normal vector in camera coordinates
varying vec3 v2f_dir_to_light; // direction to light source
varying vec3 v2f_dir_from_view; // viewing vector (from eye to vertex in view coordinates)


uniform vec3  light_color;
uniform float ambient;
uniform float shininess;

uniform sampler2D texture_base_color;

void main() {

	// TODO 3.2: apply the phong lighting model
	/**
    *  Implement the Phong shading model by using the passed
    *  variables and write the resulting color to `color`.
    *  `texture_base_color` should be used as material parameter for ambient, diffuse and specular lighting.
    * Hints:
    * - The texture(texture, 2d_position) returns a 4-vector (rgba). You can use
    * `texture(...).r` to get just the red component or `texture(...).rgb` to get a vec3 color
    * value
     */

    //ambient light  = Ia * ma = ambient * Il * ma
    vec3 ma_md_ms = texture2D(texture_base_color, v2f_tex_coord).rgb; //ma md or ms. vec 3 cuz for rgb
    vec3 Il_times_ma_md_ms = vec3(light_color.r * ma_md_ms.r, light_color.g * ma_md_ms.g, light_color.b * ma_md_ms.b);

    vec3 ambient_light = ambient * Il_times_ma_md_ms;

    vec3 vLight = normalize(v2f_dir_to_light);
    float dotNL = dot(v2f_normal, vLight);
    vec3 r = 2.0 * dotNL * v2f_normal - vLight;
    vec3 v = normalize(v2f_dir_from_view);
    vec3 diffuse_light = dotNL * Il_times_ma_md_ms;

    vec3 intens = ambient_light + diffuse_light;

    if (dot(r,v) > 0.0) {
        vec3 specular_light =  pow(dot(r, v), shininess) * Il_times_ma_md_ms;
        intens += specular_light;
    }

	gl_FragColor = vec4(intens, 1.); // output: RGBA in 0..1 range
}
