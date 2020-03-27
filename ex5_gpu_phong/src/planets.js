// #TASK_FILE 1, 2, 3
// File for task 1, 2, 3
const PIPELINE_CACHE = {};

/*
Caches pipelines by name.
`key` - name of the current pipeline
`construction_func` - function to construct the given pipeline if not found in cache
*/
function cached_pipeline(key, construction_func) {
	if(!(key in PIPELINE_CACHE)) {
		try {
			PIPELINE_CACHE[key] = construction_func();
		} catch (e) {
			console.error('Error in construction of pipeline', key, e);
		}
	}
	return PIPELINE_CACHE[key];
}

class Actor {
	init_pipeline(regl, resources) {
		throw Error('Not implemented: Actor.init_pipeline');
	}

	constructor({}, regl, resources) {
		this.mat_model_to_world = mat4.create();
		this.mat_mvp = mat4.create();

		this.init_pipeline(regl, resources);
	}

	calculate_model_matrix(sim_time) {
		throw Error('Not implemented: Actor.calculate_model_matrix');
	}

	draw({mat_projection, mat_view, light_position_cam, sim_time}) {
		throw Error('Not implemented: Actor.draw');
	}
}

class PlanetActor extends Actor {
	init_pipeline(regl, resources) {
		// create pipeline only if it doesn't exist
		// if pipeline not found under that key, the arrow-function is used to create it
		this.pipeline = cached_pipeline('unshaded', () => regl({
			attributes: {
				position: resources.mesh_uvsphere.vertex_positions,
				tex_coord: resources.mesh_uvsphere.vertex_tex_coords,
			},
			// Faces, as triplets of vertex indices
			elements: resources.mesh_uvsphere.faces,

			// Uniforms: global data available to the shader
			uniforms: {
				mat_mvp: regl.prop('mat_mvp'),
				texture_base_color: regl.prop('tex_base_color'),
			},

			vert: resources.shader_unshaded_vert,
			frag: resources.shader_unshaded_frag,
		}));
	}

	constructor({name, orbits, texture, size, rotation_speed, orbit_radius, orbit_speed, orbit_phase, ...rest}, regl, resources) {
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Unpacking_fields_from_objects_passed_as_function_parameter

		super(rest, regl, resources);

		this.name = name;
		this.orbits = orbits;
		this.texture = texture;
		this.size = size;
		this.rotation_speed = rotation_speed;
		this.orbit_radius = orbit_radius;
		this.orbit_speed = orbit_speed;
		this.orbit_phase = orbit_phase;
	}

	calculate_model_matrix({sim_time}) {
		const M_orbit = mat4.create();

		const angle_spin = sim_time * this.rotation_speed

		const mat_rotZ = mat4.fromZRotation(mat4.create(), angle_spin)

		const mat_scale = mat4.fromScaling(mat4.create(), [this.size, this.size, this.size])

		if(this.orbits !== null) {
			// Parent's translation
			const parent_translation_v = mat4.getTranslation([0, 0, 0], this.orbits.mat_model_to_world);
            const mat_trans_parent = mat4.fromTranslation(mat4.create(), parent_translation_v)

			const angle_orbit = sim_time * this.orbit_speed + this.orbit_phase

			const mat_rotOrbit = mat4.fromZRotation(mat4.create(), angle_orbit)

			const radius = this.orbit_radius

			const mat_trans_around_parent = mat4.fromTranslation(mat4.create(), [radius, 0, 0] )

			mat4_matmul_many(M_orbit, mat_trans_parent, mat_rotOrbit, mat_trans_around_parent);

			// Orbit around the parent
		}

		// Store the combined transform in actor.mat_model_to_world
		mat4_matmul_many(this.mat_model_to_world, M_orbit, mat_rotZ, mat_scale);
	}

	draw({mat_projection, mat_view}) {
		mat4_matmul_many(this.mat_mvp, mat_projection, mat_view, this.mat_model_to_world);

		this.pipeline({
			mat_mvp: this.mat_mvp,
			tex_base_color: this.texture,
		});
	}
}


class PhongActor extends PlanetActor {
	init_pipeline(regl, resources) {
		// create pipeline only if it doesn't exist
		// if pipeline not found under that key, the arrow-function is used to create it
		this.pipeline = cached_pipeline('phong', () => regl({
			// Vertex attributes
			attributes: {
				position: resources.mesh_uvsphere.vertex_positions,
				tex_coord: resources.mesh_uvsphere.vertex_tex_coords,
				normal: resources.mesh_uvsphere.vertex_normals,
			},
			// Faces, as triplets of vertex indices
			elements: resources.mesh_uvsphere.faces,

			// Uniforms: global data available to the shader
			uniforms: {
				mat_mvp: regl.prop('mat_mvp'),
				mat_model_view: regl.prop('mat_model_view'),
				mat_normals: regl.prop('mat_normals'),

				light_position: regl.prop('light_position'),
				texture_base_color: regl.prop('tex_base_color'),

				shininess: regl.prop('shininess'),
				ambient :regl.prop('ambient'),
				light_color :regl.prop('light_color'),
			},

			vert: resources.shader_phong_vert,
			frag: resources.shader_phong_frag,
		}));
	}

	constructor(cfg, regl, resources) {
		super(cfg, regl, resources);

		this.mat_model_view = mat4.create();
		this.mat_normals = mat3.create();

		this.shininess = cfg.shininess;
		this.ambient = cfg.ambient;
	}

	// init_pipeline(regl, resources) {
	// 	this.pipeline = PhongActor.build_pipeline(regl, resources);
	// }

	draw({mat_projection, mat_view, light_position_cam, sim_time}) {

		mat4_matmul_many(this.mat_model_view, mat_view, this.mat_model_to_world);
		mat4_matmul_many(this.mat_mvp, mat_projection, this.mat_model_view);

		mat3.fromMat4(this.mat_normals, this.mat_model_view);
		mat3.transpose(this.mat_normals, this.mat_normals);
		mat3.invert(this.mat_normals, this.mat_normals);

		this.pipeline({
			mat_mvp: this.mat_mvp,
			mat_model_view: this.mat_model_view,
			mat_normals: this.mat_normals,

			tex_base_color: this.texture,

			light_position: light_position_cam,

			shininess: this.shininess,
			ambient : this.ambient,
			light_color : this.light_color,

			sim_time: sim_time, // this uniform will be used for earth shader
		});
	}
}

/*
	Implements the special shading for Earth
*/
class EarthActor extends PhongActor {

	init_pipeline(regl, resources) {
		this.pipeline = cached_pipeline('earth', () => regl({
			// Vertex attributes
			attributes: {
				position: resources.mesh_uvsphere.vertex_positions,
				tex_coord: resources.mesh_uvsphere.vertex_tex_coords,
				normal: resources.mesh_uvsphere.vertex_normals,
			},
			// Faces, as triplets of vertex indices
			elements: resources.mesh_uvsphere.faces,

			// Uniforms: global data available to the shader
			uniforms: {
				mat_mvp: regl.prop('mat_mvp'),
				mat_model_view: regl.prop('mat_model_view'),
				mat_normals: regl.prop('mat_normals'),

				light_position: regl.prop('light_position'),

				texture_surface_day: resources.tex_earth_day,
				texture_surface_night: resources.tex_earth_night,
				texture_gloss: resources.tex_earth_gloss,
				texture_clouds: resources.tex_earth_clouds,

				shininess: regl.prop('shininess'),
				ambient :regl.prop('ambient'),
				light_color :regl.prop('light_color'),

				sim_time: regl.prop('sim_time'),
			},

			vert: resources.shader_phong_vert, // using phont.vert for Earth too!
			frag: resources.shader_earth_frag,
		}));
	}

}


class SunBillboardActor extends Actor {
	init_pipeline(regl, resources) {
		this.pipeline = cached_pipeline('sun billboard', () => regl({
			// Vertex attributes
			attributes: {
				// 4 vertices with 3 coordinates each
				position: [
					[-1, -1, 0],
					[1, -1, 0],
					[1, 1, 0],
					[-1, 1, 0],
				],
			},

			// Faces, as triplets of vertex indices
			elements: [
				[0, 1, 2], // top right
				[0, 2, 3], // bottom left
			],

			uniforms: {
				mat_mvp: regl.prop('mat_mvp'),
			},

			vert: resources.shader_billboard_vert,
			frag: resources.shader_billboard_frag,

			// TODO 3.1.3: understand the blending mechanism and fill up the blender block
			// For rendering transparent objects and blending it with the background color, please refer to https://learnopengl.com/Advanced-OpenGL/Blending
			// For using the regl blending API, please refer to https://github.com/regl-project/regl/blob/master/API.md#blending
			blend : {
				enable: true,
				func: {
					srcRGB: 'src alpha',
					srcAlpha: 1,
					dstRGB: 'one minus src alpha',
					dstAlpha: 1
				},
				equation: {
					rgb: 'add',
					alpha: 'add'
				}
			}
		}));
	}

	constructor({size, ...rest}, regl, resources) {
		super(rest, regl, resources);

		this.size = size;
		this.mat_scale = mat4.fromScaling(mat4.create(), [this.size, this.size, this.size]);
	}

	calculate_model_matrix({camera_position}) {
		// TODO 3.1.1: Compute the this.mat_model_to_world, which makes the normal of the billboard always point to our eye.

		// const draw_info = {
		// 	sim_time: sim_time,
		// 	mat_view: mat_view,
		// 	mat_projection: mat_projection,
		// 	light_position_cam: light_position_cam,
		// 	camera_position: camera_position,
		// }

		let nb = vec3.normalize(vec3.create(), camera_position)
		// let z = vec3.fromValues(0,0,1)
		let y = vec3.fromValues(0,1,0)
		let x = vec3.fromValues(1,0,0)

		// let cam_angle_z = Math.PI * 0.2; // in radians!
		// let cam_angle_y = -Math.PI / 6; // in radians!

		// let cam_angle_z = Math.acos(vec3.dot(nb, z))
		let cam_angle_y = Math.acos(vec3.dot(nb, y))
		let cam_angle_x = Math.acos(vec3.dot(nb, x))

		let mat_rotX = mat4.fromXRotation(mat4.create(), cam_angle_x)
		let mat_rotY = mat4.fromYRotation(mat4.create(), cam_angle_y)
		// let mat_rotZ = mat4.fromZRotation(mat4.create(), cam_angle_z)
		// let mat_trans = mat4.fromTranslation(mat4.create(), [1, 0, 0] )

		const look_at = mat4.lookAt(mat4.create(),
		camera_position, // camera position in world coord
		[0, 0, 0], // view target point
		[0, 0, 1], // up vector
	);

		mat4_matmul_many(this.mat_model_to_world, look_at, mat_rotY, mat_rotX); // edit this

		// mat4.identity(this.mat_model_to_world)

	}

	draw({mat_projection, mat_view}) {
		mat4_matmul_many(this.mat_mvp, mat_projection, mat_view, this.mat_model_to_world);

		this.pipeline({
			mat_mvp: this.mat_mvp,
		});
	}
}
