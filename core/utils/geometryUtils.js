/**
 * Set of utility functions for geometry problems.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define(function() {
    'use strict';

    var geometryUtils = {

        /**
         * Compute the distance between 2 points.
         *
         * @param {{x: Number, y: Number}} point1
         * @param {{x: Number, y: Number}} point1
         */
        'getDistanceBetweenTwoPoints': function(point1, point2) {
            return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
        },

        /**
         * Compute the distance between a point and a rectangle.
         * Thanks to Philip Peterson:
         * @see http://wiki.unity3d.com/index.php/Distance_from_a_point_to_a_rectangle
         *
         * @param {{x: Number, y: Number}} point
         * @param {{xMin: Number, yMin: Number, xMax: Number, yMax: Number}} rect
         */
        'getDistanceBetweenPointAndRectangle': function(point, rect) {
            //  Calculate a distance between a point and a rectangle.
            //  The area around/in the rectangle is defined in terms of
            //  several regions:
            //
            //  O--x
            //  |
            //  y
            //
            //
            //        I   |    II    |  III
            //      ======+==========+======   --yMin
            //       VIII |  IX (in) |  IV
            //      ======+==========+======   --yMax
            //       VII  |    VI    |   V
            //

            if (point.x < rect.xMin) { // Region I, VIII, or VII
                if (point.y < rect.yMin) { // I
                    return this.getDistanceBetweenTwoPoints(point, {x: rect.xMin, y: rect.yMin});
                } else if (point.y > rect.yMax) { // VII
                    return this.getDistanceBetweenTwoPoints(point, {x: rect.xMin, y: rect.yMax});
                } else { // VIII
                    return rect.xMin - point.x;
                }
            } else if (point.x > rect.xMax) { // Region III, IV, or V
                if (point.y < rect.yMin) { // III
                    return this.getDistanceBetweenTwoPoints(point, {x: rect.xMax, y: rect.yMin});
                } else if (point.y > rect.yMax) { // V
                    return this.getDistanceBetweenTwoPoints(point, {x: rect.xMax, y: rect.yMax});
                } else { // IV
                    return point.x - rect.xMax;
                }
            } else { // Region II, IX, or VI
                if (point.y < rect.yMin) { // II
                    return rect.yMin - point.y;
                } else if (point.y > rect.yMax) { // VI
                    return point.y - rect.yMax;
                } else { // IX
                    return 0;
                }
            }
        }
    };

    return geometryUtils;
});
