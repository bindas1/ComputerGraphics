Everyone has done the exercise with equal share.

There were no problems after figuring the equation for intersections with infinite cylinder.

Plane:
Analogously to the sphere solution we calculated first the equation for the plane.
First we check with the dot product of the ray is parallel to the plane, if yes there
is not intersection. Then we find the intersectiont (_intersection_t = dot(n,co)/dot_n_d), where dot_n_d = dot(n,d), vec3 d = _ray.direction; vec3 n = normal). If it's less or equal to 0, then the intersection is behind the viewer, so we return false. Otherwise true.


Cylinder:
C = center of the cylinder
a = vertical axis vector of cylinder
x = o + td
r = radius

verticalv = (d.a)a
projonaxis = (o-c.a)a  - vector from c to the projection of o on the vector a 

d-verticalp is projection of the d vector on the plane perpendicular to the vector a passing by o
c+projonaxis is the projection of o on the vector a 

From equation:
||o+t(d-verticalv)-(c+projonaxis)|| - r = 0
If we square the equation:
||t(d-verticalv)+(o-c-projonaxis)||^2 - r^2 = 0

We derive the quadratic equation solvable for t:
t^2(d-verticalv.d-verticalv) + 2t(d-verticalv)(o-c-projonaxis) + (o-c-projonaxis.o-c-projonaxis) - r^2 = 0

Solving the equation we get the values of t which satisfy the first equation. 
From t we get our intersection points, but we must constrain the length of the vector VXonAxis to be of length less than height / 2 and bigger than 0.

Finally to assign value to _intersection_normal we use ternary operator.
We want the normal vector to be pointing outwards so in the last line we change the sign to the opposite one if num_sol > 1 && _intersection_t == std::max(t[0], t[1])  

_intersection_normal = num_sol > 1 && _intersection_t == std::max(t[0], t[1]) ? -n : n;



