/**
 * Define a polyline to show on the map.
 *
 * @author Marc Plouhinec
 */

define(function() {
    'use strict';

    /**
     * Counter used to generate unique IDs.
     *
     * @type {Number}
     */
    var nextPolylineId = 0;

    /**
     * Create a new Polyline.
     *
     * @param {{
     *     path: Array.<LatLng>=,
     *     color: Number=,
     *     width: Number=
     * }} options
     * @constructor
     */
    function Polyline(options) {
        /**
         * Generated polyline ID.
         *
         * @type {number}
         */
        this.id = nextPolylineId++;

        /**
         * Polyline points on the map.
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
        this.color = options.color || 0xFF000000;

        /**
         * Width of the line in pixels.
         *
         * @type {Number}
         */
        this.width = options.width || 10;
    }

    return Polyline;
});
