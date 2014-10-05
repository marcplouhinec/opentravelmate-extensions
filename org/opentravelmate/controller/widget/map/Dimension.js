/**
 * Define a rectangle dimension with width and height.
 *
 * @author Marc Plouhinec
 */

define(function() {
    'use strict';

    /**
     * Create a new Dimension.
     *
     * @param {Number} width
     * @param {Number} height
     * @constructor
     */
    function Dimension(width, height) {
        /** @type {Number} */
        this.width = width;
        /** @type {Number} */
        this.height = height;
    }

    return Dimension;
});
