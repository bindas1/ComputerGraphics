// #TASK_FILE 3
// File for task 3

//=============================================================================
//
//   Exercise code for the lecture "Introduction to Computer Graphics"
//     by Prof. Mario Botsch, Bielefeld University
//
//   Copyright (C) by Computer Graphics Group, Bielefeld University
//
//=============================================================================

precision mediump float;

varying vec2 v2f_tex_coord;
varying vec3 v2f_normal; // normal vector in camera coordinates
varying vec3 v2f_dir_to_light; // direction to light source
varying vec3 v2f_dir_from_view; // viewing vector (from eye to vertex in view coordinates)

uniform sampler2D texture_surface_day;
uniform sampler2D texture_surface_night;
uniform sampler2D texture_clouds;
uniform sampler2D texture_gloss;
uniform float sim_time;

uniform vec3  light_color;
uniform float ambient;
uniform float shininess;

void main()
{

	/** TODO 3.3:
    * - Copy your working code from the fragment shader of your Phong shader use it as
    * starting point
    * - instead of using a single texture, use the four texures `texture_surface_day`, `texture_surface_night`,
    * `texture_clouds` and `texture_gloss` and mix them for enhanced effects
    * Hints:
    * - cloud and gloss textures are just greyscales. So you'll just need one color-
    * component.
    * - The texture(texture, 2d_position) returns a 4-vector (rgba). You can use
    * `texture(...).r` to get just the red component or `texture(...).rgb` to get a vec3 color
    * value
    * - use mix(vec3 a,vec3 b, s) = a*(1-s) + b*s for linear interpolation of two colors
     */

    //day
    //ambient
    //ambient = Ia * ma = ambient * Il * ma
    vec3 m_day = texture2D(texture_surface_day, v2f_tex_coord).rgb;
    vec3 Il_times_m_day = vec3(light_color.r * m_day.r, light_color.g * m_day.g, light_color.b * m_day.b);
    vec3 ambient_light = ambient * Il_times_m_day;

    //diffuse
    vec3 vLight = normalize(v2f_dir_to_light);
    float dotNL = dot(normalize(v2f_normal), vLight);
    vec3 diffuse_light = dotNL * Il_times_m_day;

    vec3 intens = ambient_light + diffuse_light;

    //specular
    vec3 r = 2.0 * dotNL * normalize(v2f_normal) - vLight;
    vec3 v = normalize(v2f_dir_from_view);
    vec3 Il_times_m_s = light_color;
    if (dot(r,v) > 0.0) {
        float gloss = texture2D(texture_gloss, v2f_tex_coord)[0]; //the gloss is cond for specular
        float clouds = texture2D(texture_clouds, v2f_tex_coord)[0]; //lin interpolate
        vec3 specular_light =  pow(dot(r, v), shininess) * Il_times_m_s;
        vec3 specular_light_after_clouds = mix(specular_light, vec3(0,0,0), clouds) * gloss;
        intens += specular_light_after_clouds;
    }

	gl_FragColor = vec4(intens, 1.); // output: RGBA in 0..1 range

    // float gloss = texture2D(texture_gloss, v2f_tex_coord)[0];
    // if (gloss != 1.0 && gloss != 0.0){ //no specular
    //     gl_FragColor = vec4(0., 0., 0., 1.);
    // } else { //specular
    //     gl_FragColor = vec4(255., 0., 0., 1.);
    // }
	// vec3 color_from_texture = texture2D(texture_surface_day, v2f_tex_coord).rgb;
	// gl_FragColor = vec4(color_from_texture, 1.); // output: RGBA in 0..1 range
}
