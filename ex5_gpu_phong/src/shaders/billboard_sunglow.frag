// #TASK_FILE 3
// File for task 3

precision mediump float;
const vec3 glow_color = vec3(1.0, 0.5, 0.0);
// Per-vertex outputs passed on to the fragment shader
varying vec2 v2f_tex_coord;

void main()
{
    gl_FragColor = vec4(glow_color, 1./ exp(3.3 * length(v2f_tex_coord)));
}
