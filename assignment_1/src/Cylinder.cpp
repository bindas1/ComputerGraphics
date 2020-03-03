//=============================================================================
//
//   Exercise code for the lecture
//   "Introduction to Computer Graphics"
//   by Prof. Dr. Mario Botsch, Bielefeld University
//
//   Copyright (C) Computer Graphics Group, Bielefeld University.
//
//=============================================================================

//== INCLUDES =================================================================

#include "Cylinder.h"
#include "SolveQuadratic.h"

#include <array>
#include <cmath>

//== IMPLEMENTATION =========================================================

bool
Cylinder::
intersect(const Ray&  _ray,
          vec3&       _intersection_point,
          vec3&       _intersection_normal,
          double&     _intersection_t) const
{
    /** \todo
     * - compute the first valid intersection `_ray` with the cylinder
     *   (valid means in front of the viewer: t > 0)
     * - store intersection point in `_intersection_point`
     * - store ray parameter in `_intersection_t`
     * - store normal at _intersection_point in `_intersection_normal`.
     * - return whether there is an intersection with t > 0
    */
    

    vec3 v = _ray.direction;
    vec3 temp_v = (v - dot(v, axis) * axis); 	
    int big_a = dot(temp_v, temp_v);
    vec3 left = v-dot(v, axis)*axis;
    vec3 delta_p = _ray.origin - center;
    vec3 right = delta_p - dot(delta_p, axis) * axis;
    int big_b = 2 *dot(left, right);
    vec3 temp_v2 = delta_p - dot(delta_p, axis)*axis;
    int big_c = dot(temp_v2, temp_v2) - radius*radius;

    std::array<double, 2> t;
    size_t number_of_solutions = solveQuadratic(
        big_a,
	big_b,
	big_c,
	t // where to store solutions
    );

    
    //    //vec3 d = _ray.direction;
//    vec3 o = _ray.origin;
//    vec3 c = center;
//    vec3 a = axis; //todo make unitary 
//    double r = radius;
//    double h = height;
//
//
//    vec3 b = dot((o-c), a)*a ;//+ c;
//    
//    const vec3 d = _ray.direction;
//    const vec3 ob = _ray.origin - b;
//
//    std::array<double, 2> t;
//    size_t number_of_solutions = solveQuadratic(
//        dot(d, d), // t^2 * ||d||^2
//        2 * dot(d, ob), // t * (2d dot (o - c))
//        dot(ob, ob) - radius * radius, // ||o-c||^2 - r^2
//        t // where to store solutions
//    );
//    
    // Initialize the intersection distance to "infinity" (indicating no intersection)
    _intersection_t = NO_INTERSECTION;
    
    // Find the closest valid (in front of the viewer) intersection, if one exists
    for (size_t i = 0; i < number_of_solutions; i++) {
        const double t_solution = t[i];
        // t <= 0 means the intersection is behind the camera
        if ((t_solution > 0) && (t_solution < _intersection_t))
        _intersection_t = t_solution;
    }
   
    // Nothing to do if we don't have an intersection...
    if (_intersection_t == NO_INTERSECTION) return false;
    // Otherwise, calculate information about the intersection
    _intersection_point = _ray.origin + _intersection_t*_ray.direction; 
    _intersection_normal = _intersection_point - center;

    return true;
}
