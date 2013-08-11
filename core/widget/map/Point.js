/**
 * Define a position with x and y coordinates.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define(function() {
    'use strict';

    /**
     * Create a new Point.
     *
     * @param {Number} x
     * @param {Number} y
     * @constructor
     */
    function Point(x, y) {
        /** @type {Number} */
        this.x = x;
        /** @type {Number} */
        this.y = y;
    }

    return Point;
});
