/**
 * Define a waypoint.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define(function() {
    'use strict';

    /**
     * Create a new waypoint.
     *
     * @param options
     * @constructor
     */
    function Waypoint(options) {
        /**
         * Internal ID.
         *
         * @type {String}
         */
        this.id = options.id;

        /**
         * Three possible values:
         *   'place': the point is a station and a line bound.
         *   'stop': the point is a station.
         *   'waypoint': the point just indicates that the line goes through it.
         *
         * @type {String}
         */
        this.type = options.type;

        /**
         * Point latitude.
         *
         * @type {Number}
         */
        this.latitude = options.latitude;

        /**
         * Point longitude.
         *
         * @type {Number}
         */
        this.longitude = options.longitude;

        /**
         * Stop name (only if type == 'stop' or 'place').
         *
         * @type {String=}
         */
        this.stopName = options.stopName;

        /**
         * Line bound name (only if type == 'place').
         *
         * @type {String=}
         */
        this.placeName = options.placeName;
    }

    return Waypoint;
});
