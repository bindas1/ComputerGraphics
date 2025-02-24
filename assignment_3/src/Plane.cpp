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

#include "Plane.h"
#include <limits>


//== CLASS DEFINITION =========================================================



Plane::Plane(const vec3& _center, const vec3& _normal)
: center(_center), normal(_normal)
{
}


//-----------------------------------------------------------------------------


bool
Plane::
intersect(const Ray& _ray,
          vec3&      _intersection_point,
          vec3&      _intersection_normal,
          double&    _intersection_t ) const
{
    /** \todo
     * - compute the intersection of the plane with `_ray`
     * - if ray and plane are parallel there is no intersection
     * - otherwise compute intersection data and store it in `_intersection_point`, `_intersection_normal`, and `_intersection_t`.
     * - return whether there is an intersection in front of the viewer (t > 0)
    */
    vec3 d = _ray.direction;
    vec3 n = normal;
    vec3 o = _ray.origin;
    vec3 c = center;
    vec3 co = (c-o);
    
    double dot_n_d = dot(n,d);   

    if(dot_n_d == 0) {
        return false;
    }

    _intersection_t = dot(n,co)/dot_n_d;
    _intersection_point = o + _intersection_t*d; 
    _intersection_normal = n;

    if(_intersection_t <= 0){
        return false;
    }
  
    return true;
}


//=============================================================================
