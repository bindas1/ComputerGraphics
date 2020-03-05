//=============================================================================
//
//   Exercise code for the lecture
//   "Introduction to Computer Graphics"
//   by Prof. Dr. Mario Botsch, Bielefeld University
//
//   Copyright (C) Computer Graphics Group, Bielefeld University.
//
//=============================================================================

#ifndef IMAGE_H
#define IMAGE_H

//== INCLUDES =================================================================

#include "vec3.h"
#include <vector>
#include <assert.h>
#include <fstream>


//== CLASS DEFINITION =========================================================


/// \class Image Image.h
/// This class stores an image as a big array of colors, which are represented
/// as vec3 values for RGB.
class Image
{
public:

    /// Construct an image of size _width times _height
    /// \param _width Width of the image in pixels
    /// \param _height Height of the image in pixels
    Image(unsigned int _width=0, unsigned int _height=0)
    {
        resize(_width, _height);
    }

    /// Resize the image
    /// \param _width New width of the image in pixels
    /// \param _height New height of the image in pixels
    void resize(unsigned int _width, unsigned int _height)
    {
        width_  = _width;
        height_ = _height;
        pixels_.resize(width_ * height_);
    }

    /// Returns image width in pixels.
    unsigned int width() const
    {
        return width_;
    }

    /// Returns image height in pixels.
    unsigned int height() const
    {
        return height_;
    }

    /// Read/write access to pixel (_x,_y). Use this to set the color by
    /// image(x,y) = color;
    vec3& operator()(unsigned int _x, unsigned int _y)
    {
        assert(_x < width_);
        assert(_y < height_);
        return pixels_[_y*static_cast<unsigned int>(width_) + _x];
    }

    /// Read access to pixel (_x,_y).
    const vec3& operator()(unsigned int _x, unsigned int _y) const
    {
        assert(_x < width_);
        assert(_y < height_);
        return pixels_[_y*static_cast<unsigned int>(width_) + _x];
    }

    /// Writes the image in PNG or TGA format depending on the file name.
    /// \param[in] filename Filename to save the image to.
    bool write(const std::string &_filename) const;

    /// Writes the image in TGA format to a file.
    /// \param[in] _filename Filename to save the image to.
    bool write_tga(const std::string &_filename) const;
    bool write_png(const std::string &_filename) const; 

private:

    /// vector with all pixels in the image
    std::vector<vec3> pixels_;
    
    /// image width in pixels
    unsigned short int width_;
    
    /// image height in pixels
    unsigned short int height_;
};


//=============================================================================
#endif // IMAGE_H defined
//=============================================================================
