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

#include "Mesh.h"
#include <fstream>
#include <string>
#include <stdexcept>
#include <limits>
#include <cmath>   // needed for double version of std::abs
#include<algorithm> 
//== IMPLEMENTATION ===========================================================

double determinant( double matrix[3][3], int n) {
    double a = matrix[0][0];
    double b = matrix[0][1];
    double c = matrix[0][2];
    double d = matrix[1][0];
    double e = matrix[1][1];
    double f = matrix[1][2];
    double g = matrix[2][0];
    double h = matrix[2][1];
    double i = matrix[2][2];
    return a*e*i + b*f*g+c*d*h-a*f*h-b*d*i-c*e*g;
}

Mesh::Mesh(std::istream &is, const std::string &scenePath)
{
    std::string meshFile, mode;
    is >> meshFile;

    // load mesh from file
    read(scenePath.substr(0, scenePath.find_last_of("/\\") + 1) + meshFile); // Use both Unix and Windows path separators

    is >> mode;
    if      (mode ==  "FLAT") draw_mode_ = FLAT;
    else if (mode == "PHONG") draw_mode_ = PHONG;
    else throw std::runtime_error("Invalid draw mode " + mode);

    is >> material;
}


//-----------------------------------------------------------------------------


bool Mesh::read(const std::string &_filename)
{
    // read a mesh in OFF format


    // open file
    std::ifstream ifs(_filename);
    if (!ifs)
    {
        std::cerr << "Can't open " << _filename << "\n";
        return false;
    }


    // read OFF header
    std::string s;
    unsigned int nV, nF, dummy, i;
    ifs >> s;
    if (s != "OFF")
    {
        std::cerr << "No OFF file\n";
        return false;
    }
    ifs >> nV >> nF >> dummy;
    std::cout << "\n  read " << _filename << ": " << nV << " vertices, " << nF << " triangles";


    // read vertices
    Vertex v;
    vertices_.clear();
    vertices_.reserve(nV);
    for (i=0; i<nV; ++i)
    {
        ifs >> v.position;
        vertices_.push_back(v);
    }


    // read triangles
    Triangle t;
    triangles_.clear();
    triangles_.reserve(nF);
    for (i=0; i<nF; ++i)
    {
        ifs >> dummy >> t.i0 >> t.i1 >> t.i2;
        triangles_.push_back(t);
    }


    // close file
    ifs.close();


    // compute face and vertex normals
    compute_normals();

    // compute bounding box
    compute_bounding_box();


    return true;
}


//-----------------------------------------------------------------------------

// Determine the weights by which to scale triangle (p0, p1, p2)'s normal when
// accumulating the vertex normals for vertices 0, 1, and 2.
// (Recall, vertex normals are a weighted average of their incident triangles'
// normals, and in our raytracer we'll use the incident angles as weights.)
// \param[in] p0, p1, p2    triangle vertex positions
// \param[out] w0, w1, w2    weights to be used for vertices 0, 1, and 2
void angleWeights(const vec3 &p0, const vec3 &p1, const vec3 &p2,
                  double &w0, double &w1, double &w2) {
    // compute angle weights
    const vec3 e01 = normalize(p1-p0);
    const vec3 e12 = normalize(p2-p1);
    const vec3 e20 = normalize(p0-p2);
    w0 = acos( std::max(-1.0, std::min(1.0, dot(e01, -e20) )));
    w1 = acos( std::max(-1.0, std::min(1.0, dot(e12, -e01) )));
    w2 = acos( std::max(-1.0, std::min(1.0, dot(e20, -e12) )));
}


//-----------------------------------------------------------------------------

void Mesh::compute_normals()
{
        // compute triangle normals
    for (Triangle& t: triangles_)
    {
        const vec3& p0 = vertices_[t.i0].position;
        const vec3& p1 = vertices_[t.i1].position;
        const vec3& p2 = vertices_[t.i2].position;
        t.normal = normalize(cross(p1-p0, p2-p0));

        double w0;
        double w1;
        double w2;

        angleWeights(p0, p1, p2, w0, w1, w2);

        vertices_[t.i0].normal += w0 * t.normal;
        vertices_[t.i1].normal += w1 * t.normal;
        vertices_[t.i2].normal += w2 * t.normal;
    }

    for (Vertex& v: vertices_)
    {
        v.normal = v.normal/norm(v.normal);
    }

    /** \todo
     * In some scenes (e.g the office scene) some objects should be flat
     * shaded (e.g. the desk) while other objects should be Phong shaded to appear
     * realistic (e.g. chairs). You have to implement the following:
     * - Compute vertex normals by averaging the normals of their incident triangles.
     * - Store the vertex normals in the Vertex::normal member variable.
     * - Weigh the normals by their triangles' angles.
     */
}


//-----------------------------------------------------------------------------


void Mesh::compute_bounding_box()
{
    bb_min_ = vec3(std::numeric_limits<double>::max());
    bb_max_ = vec3(std::numeric_limits<double>::lowest());

    for (Vertex v: vertices_)
    {
        bb_min_ = min(bb_min_, v.position);
        bb_max_ = max(bb_max_, v.position);
    }
}


//-----------------------------------------------------------------------------


bool Mesh::intersect_bounding_box(const Ray& _ray) const
{

    /** \todo
    * Intersect the ray `_ray` with the axis-aligned bounding box of the mesh.
    * Note that the minimum and maximum point of the bounding box are stored
    * in the member variables `bb_min_` and `bb_max_`. Return whether the ray
    * intersects the bounding box.
    * This function is ued in `Mesh::intersect()` to avoid the intersection test
    * with all triangles of every mesh in the scene. The bounding boxes are computed
    * in `Mesh::compute_bounding_box()`.
    */
//    const vec3 real_bb_min = min(bb_min_, bb_max_);
//    const vec3 real_bb_max = max(bb_min_, bb_max_);
    vec3 real_bb_min = bb_min_;
    vec3 real_bb_max = bb_max_;

    double t_0_min = (real_bb_min[0] - _ray.origin[0])/_ray.direction[0];
    double t_0_max = (real_bb_max[0] - _ray.origin[0])/_ray.direction[0];

    double t_1_min = (real_bb_min[1] - _ray.origin[1])/_ray.direction[1];
    double t_1_max = (real_bb_max[1] - _ray.origin[1])/_ray.direction[1];

    if (std::min(t_0_min, t_0_max) > std::max(t_1_min, t_1_max) || 
        std::min(t_1_min, t_1_max) > std::max(t_0_min, t_0_max))
    { return false; }

    double new_t_min = std::max(std::min(t_0_min, t_0_max), std::min(t_1_max, t_1_min));
    double new_t_max = std::min(std::max(t_0_min, t_0_max), std::max(t_1_max, t_1_min));

    double t_2_min = (real_bb_min[2] - _ray.origin[2])/_ray.direction[2];
    double t_2_max = (real_bb_max[2] - _ray.origin[2])/_ray.direction[2];
    
    if (std::min(new_t_min, new_t_max) > std::max(t_2_min, t_2_max) || 
        std::min(t_2_min, t_2_max) > std::max(new_t_min, new_t_max))
    { return false; }

    return true;

}


//-----------------------------------------------------------------------------


bool Mesh::intersect(const Ray& _ray,
                     vec3&      _intersection_point,
                     vec3&      _intersection_normal,
                     double&    _intersection_t ) const
{
    // check bounding box intersection
    if (!intersect_bounding_box(_ray))
    {
        return false;
    }

    vec3   p, n;
    double t;

    _intersection_t = NO_INTERSECTION;

    // for each triangle
    for (const Triangle& triangle : triangles_)
    {
        // does ray intersect triangle?
        if (intersect_triangle(triangle, _ray, p, n, t))
        {
            // is intersection closer than previous intersections?
            if (t < _intersection_t)
            {
                // store data of this intersection
                _intersection_t      = t;
                _intersection_point  = p;
                _intersection_normal = n;
            }
        }
    }

    return (_intersection_t != NO_INTERSECTION);
}


//-----------------------------------------------------------------------------


bool
Mesh::
intersect_triangle(const Triangle&  _triangle,
                   const Ray&       _ray,
                   vec3&            _intersection_point,
                   vec3&            _intersection_normal,
                   double&          _intersection_t) const
{
    const vec3& p0 = vertices_[_triangle.i0].position;
    const vec3& p1 = vertices_[_triangle.i1].position;
    const vec3& p2 = vertices_[_triangle.i2].position;

    /** \todo
    * - intersect _ray with _triangle
    * - store intersection point in `_intersection_point`
    * - store ray parameter in `_intersection_t`
    * - store normal at intersection point in `_intersection_normal`.
    * - Depending on the member variable `draw_mode_`, use either the triangle
    *  normal (`Triangle::normal`) or interpolate the vertex normals (`Vertex::normal`).
    * - return `true` if there is an intersection with t > 0 (in front of the viewer)
    *
    * Hint: Rearrange `ray.origin + t*ray.dir = a*p0 + b*p1 + (1-a-b)*p2` to obtain a solvable
    * system for a, b and t.
    * Refer to [Cramer's Rule](https://en.wikipedia.org/wiki/Cramer%27s_rule) to easily solve it.
     */

    // a is alpha
    // b is beta
    // c (gama) = 1 - a - b

    vec3 p0_2 = p0 - p2;
    vec3 p1_2 = p1 - p2;
    vec3 d = -1 * _ray.direction;
    vec3 o_p2 = _ray.origin - p2;

    double matrix_d[3][3] = {{p0_2[0], p1_2[0], d[0]},
                             {p0_2[1], p1_2[1], d[1]},
                             {p0_2[2], p1_2[2], d[2]}};

    double matrix_alpha[3][3] = {{o_p2[0], p1_2[0], d[0]},
                                 {o_p2[1], p1_2[1], d[1]},
                                 {o_p2[2], p1_2[2], d[2]}};

    double matrix_beta[3][3] = {{p0_2[0], o_p2[0], d[0]},
                                {p0_2[1], o_p2[1], d[1]},
                                {p0_2[2], o_p2[2], d[2]}};

    double matrix_t[3][3] = {{p0_2[0], p1_2[0], o_p2[0]},
                             {p0_2[1], p1_2[1], o_p2[1]},
                             {p0_2[2], p1_2[2], o_p2[2]}};

    double determinant_d = determinant(matrix_d, 3);
    double determinant_a = determinant(matrix_alpha, 3);
    double determinant_b = determinant(matrix_beta, 3);
    double determinant_t = determinant(matrix_t, 3);

    double alpha;
    double beta;
    double t;
    double gamma;

    if(determinant_d != 0) {
        alpha = determinant_a / determinant_d;
        beta = determinant_b / determinant_d;
        gamma = 1 - alpha - beta;
        t = determinant_t / determinant_d;
    }
    else
        return false;

    if (alpha >= 0 && beta >= 0 && gamma >= 0 && t >= 0) {
        _intersection_t = t;
        _intersection_point = _ray(_intersection_t);
        if(draw_mode_ == FLAT)
            _intersection_normal = normalize(_triangle.normal);
        else
            _intersection_normal = normalize(
                alpha * vertices_[_triangle.i0].normal +
                beta * vertices_[_triangle.i1].normal +
                gamma * vertices_[_triangle.i2].normal);
        return true;
    }

    return false;
}


//=============================================================================
