/**
 * Represent geolocation coordinates.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define(function() {
    'use strict';

    /**
     * Create new Coordinates.
     *
     * @param {{
     *     latitude: Number,
     *     longitude: Number,
     *     altitude: Number,
     *     accuracy: Number,
     *     altitudeAccuracy: Number,
     *     heading: Number,
     *     speed: Number
     * }} options
     * @constructor
     */
    function Coordinates(options) {
        /** @type {Number} */
        this.latitude = options.latitude;
        /** @type {Number} */
        this.longitude = options.longitude;
        /** @type {Number} */
        this.altitude = options.altitude;
        /** @type {Number} */
        this.accuracy = options.accuracy;
        /** @type {Number} */
        this.altitudeAccuracy = options.altitudeAccuracy;
        /** @type {Number} */
        this.heading = options.heading;
        /** @type {Number} */
        this.speed = options.speed;
    }

    return Coordinates;
});
