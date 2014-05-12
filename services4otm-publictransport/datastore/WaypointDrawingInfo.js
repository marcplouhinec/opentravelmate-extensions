/**
 * Define a set of information about how to draw a waypoint on the map.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define(function() {
    'use strict';

    /**
     * Create a new WaypointDrawingInfo.
     *
     * @param options
     * @constructor
     */
    function WaypointDrawingInfo(options) {
        /**
         * Angle in radian of the waypoint with the abscissa axis.
         *
         * @type {Number}
         */
        this.angleWithAbscissaAxis = options.angleWithAbscissaAxis;

        /**
         * Centers of the waypoint circles.
         * Note: This array can only contain one bound (the waypoint is a circle) or two bounds (the waypoint is more like an ellipse).
         *
         * @type {Array.<{x: Number, y: Number}>}
         */
        this.bounds = options.bounds;

        /**
         * Waypoint center coordinates on the map in tile XY coordinates.
         *
         * @type {{x: Number, y: Number}}
         */
        this.centerPosition = options.centerPosition;

        /**
         * Waypoint length in pixels.
         *
         * @type {Number}
         */
        this.length = options.length;

        /**
         * Waypoint thickness in pixels.
         *
         * @type {String=}
         */
        this.weight = options.weight;
    }

    return WaypointDrawingInfo;
});
