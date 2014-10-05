/**
 * Define a geographic location with latitude and longitude coordinates.
 *
 * @author Marc Plouhinec
 */

define(function() {
    'use strict';

    /**
     * Create a new LatLng.
     *
     * @param {Number} lat
     *     Latitude
     * @param {Number} lng
     *     Longitude
     * @constructor
     */
    function LatLng(lat, lng) {
        /** @type {Number} */
        this.lat = lat;
        /** @type {Number} */
        this.lng = lng;
    }

    return LatLng;
});
