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
    

    const vec3 d = _ray.direction;
    const vec3 a = axis; 
    const vec3 o = _ray.origin;
    const vec3 c = center;
    const double r = radius;
    const vec3 projonaxis = dot(o - c, a)*a; 
    const vec3 verticalv = dot(d,a)*a;

    std::array<double, 2> t;
    size_t number_of_solutions = solveQuadratic(
        dot(d - verticalv, d - verticalv),
	2*dot(d-verticalv,(o-c)-projonaxis),
	dot((o-c)-projonaxis, (o-c)-projonaxis) - r*r,
	t // where to store solutions
    );

    // Initialize the intersection distance to "infinity" (indicating no intersection)
    _intersection_t = NO_INTERSECTION;
    
    // Find the closest valid (in front of the viewer) intersection, if one exists

    for (size_t i = 0; i < number_of_solutions; i++) {
      const vec3 VXonAxis = dot(_ray(t[i]) - c,a) * a;
      const double lengthofVX = norm(VXonAxis);
      if (t[i] > 0 && lengthofVX < height/2.0){
          _intersection_t = t[i];
          _intersection_normal = normalize(_ray(t[i]) - c - VXonAxis);
          if (dot(d, _intersection_normal) > 0) {
          _intersection_normal = -1 * _intersection_normal;
          }
      }
    }
   
    // Nothing to do if we don't have an intersection...
    if (_intersection_t == NO_INTERSECTION) return false;

    // Otherwise, calculate information about the intersection
    _intersection_point = _ray(_intersection_t); 
    
    return true;
}
