/**
 * Define a point on a map.
 *
 * @author Marc Plouhinec
 */

define(function() {
    'use strict';

    /**
     * Create a new GeoPoint.
     *
     * @param options
     * @constructor
     */
    function GeoPoint(options) {
        /**
         * Latitude.
         *
         * @type {Number}
         */
        this.latitude = options.latitude;

        /**
         * Longitude.
         *
         * @type {Number}
         */
        this.longitude = options.longitude;
    }

    return GeoPoint;
});
