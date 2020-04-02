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

//         vec3 intens = _material.ambient * ambience;

//     for(auto l:lights){
//         vec3 vLight = normalize(l.position-_point);
//         const double dotNL = dot(_normal, vLight);
//         vec3 r = 2 * _normal * dotNL - vLight;
//         vec3 v = normalize(camera.eye - _point);
//         vec3 diffuse_part = _material.diffuse * dotNL;
//         vec3 specular_part = _material.specular * pow(dot(r, v), _material.shininess);
//         Object_ptr object;
//         vec3 p, n;
//         double t;
//         const Ray shadowRay = Ray(_point + 0.01*vLight, vLight);

//         if(dotNL > 0) {
//             if(!intersect(shadowRay, object, p, n, t) || t > norm(camera.eye - _point) )
//                 intens += l.color * diffuse_part;
//                 if (dot(r,v) > 0)
//                         intens += l.color * specular_part;
//         }
//     }
//     // visualize the normal as a RGB color for now.
//     vec3 color = intens;

//     return color;
// }

    vec3 intens = texture_base_color.ambient * ambient;
    vec3 vLight = normalize(v2f_dir_to_light);
    float dotNL = dot(v2f_normal, vLight);
    vec3 r = 2 * v2f_normal * dotNL - vLight;
    vec3 v = normalize(v2f_dir_from_view);
    vec3 diffuse_part = texture_base_color.diffuse * dotNL;
    vec3 specular_part = texture_base_color.specular * pow(dot(r, v), shininess);
    intens += light_color * diffuse_part;
    if (dot(r,v) > 0) {
        intens += light_color * specular_part;
    }

	gl_FragColor = vec4(intens, 1.); // output: RGBA in 0..1 range
}
