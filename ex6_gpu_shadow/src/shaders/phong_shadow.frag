// #TASK_FILE 3, 4, 5
// File for task 3, 4, 5
precision highp float;

varying vec3 v2f_normal;         // normal vector in camera coordinates
varying vec3 v2f_position_view;  // vertex position in camera coordinates
varying vec3 v2f_diffuse_color;  // Material's diffuse color, m_d
varying vec3 v2f_specular_color; // Material's specular color, m_s

uniform vec3 light_position; // light position in camera coordinates

uniform vec3 light_color;
uniform samplerCube shadow_cubemap;

// Material parameters
uniform float shininess;

void main() {
    // Normalize the interpolated normal
    vec3 N = -sign(dot(v2f_normal, v2f_position_view)) *  // Orient the normal so it always points opposite the camera rays (for backfaces)
             normalize(v2f_normal);

    vec3 color = vec3(0.0);
    /** Todo 4.2.2
    * Compute this light's diffuse and specular contributions.
    * You should be able to copy your phong lighting code from assignment 5 mostly as-is,
    * though notice that the light and view vectors need to be computed from scratch
    * here; this time, they are not passed from the vertex shader. Also, the light/material
	* colors have changed; see the Phong lighting equation in the handout if you need
	* a refresher to understand how to incorporate `light_color` (the diffuse and specular
	* colors of the light), `v2f_diffuse_color` and `v2f_specular_color`.
	*
	* To model the attenuation of a point light, you should scale the light
	* color by the inverse distance squared to the point being lit.
    *
    * The light should only contribute to this fragment if the fragment is not occluded
    * by another object in the scene. You need to check this by comparing the distance
    * from the fragment to the light against the distance recorded for this
    * light ray in the shadow map.
    *
    * To prevent "shadow acne" and minimize aliasing issues, we need a rather large
    * tolerance on the distance comparison. It's recommended to use a *multiplicative*
    * instead of additive tolerance: compare the fragment's distance to 1.01x the
    * distance from the shadow map.
    ***/

    // //ambient light  = Ia * ma = ambient * Il * ma
    // vec3 ma_md_ms = samplerCube(shadow_cubemap, v2f_tex_coord).rgb; //ma md or ms. vec 3 cuz for rgb
    // vec3 Il_times_ma_md_ms = vec3(light_color.r * ma_md_ms.r, light_color.g * ma_md_ms.g, light_color.b * ma_md_ms.b);

    // vec3 ambient_light = ambient * Il_times_ma_md_ms;

    // vec3 vLight = normalize(v2f_dir_to_light);
    // float dotNL = dot(normalize(v2f_normal), vLight);
    // vec3 r = 2.0 * dotNL * normalize(v2f_normal) - vLight;
    // vec3 v = normalize(v2f_dir_from_view);
    // vec3 diffuse_light = dotNL * Il_times_ma_md_ms;

    // vec3 intens = ambient_light + diffuse_light;

    // if (dot(r,v) > 0.0) {
    //     vec3 specular_light =  pow(dot(r, v), shininess) * Il_times_ma_md_ms;
    //     intens += specular_light;
    // }

    gl_FragColor = vec4(color, 1.); // output: RGBA in 0..1 range
}
