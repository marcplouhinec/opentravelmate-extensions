/**
 * Define a polygon to show on the map.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define(function() {
    'use strict';

    /**
     * Counter used to generate unique IDs.
     *
     * @type {Number}
     */
    var nextPolygonId = 0;

    /**
     * Create a new Polygon.
     *
     * @param {{
     *     path: Array.<LatLng>=,
     *     fillColor: Number=,
     *     strokeColor: Number=,
     *     strokeWidth: Number=
     * }} options
     * @constructor
     */
    function Polygon(options) {
        /**
         * Generated polygon ID.
         *
         * @type {number}
         */
        this.id = nextPolygonId++;

        /**
         * Polygon points on the map.
         *
         * @type {Array.<LatLng>}
         */
        this.path = options.path || [];

        /**
         * Color in the format 0xOORRGGBB where
         * OO is the opacity (FF = opaque, 00 = transparent),
         * RR, GG, BB are the red, green and blue colors.
         *
         * @type {Number}
         */
        this.fillColor = typeof options.fillColor === 'number' ? options.fillColor : 0xFF000000;

        /**
         * Color in the format 0xOORRGGBB where
         * OO is the opacity (FF = opaque, 00 = transparent),
         * RR, GG, BB are the red, green and blue colors.
         *
         * @type {Number}
         */
        this.strokeColor = typeof options.strokeColor === 'number' ? options.strokeColor : 0xFF000000;

        /**
         * Width of the stroke in pixels.
         *
         * @type {Number}
         */
        this.strokeWidth = typeof options.strokeWidth === 'number' ? options.strokeWidth : 1;
    }

    return Polygon;
});
