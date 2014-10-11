/**
 * Represent geolocation coordinates.
 *
 * @author Marc Plouhinec
 */

define(function() {
    'use strict';

    /**
     * Create new Coordinates.
     *
     * @param {{
     *     latitude: number,
     *     longitude: number,
     *     altitude: number,
     *     accuracy: number,
     *     altitudeAccuracy: number,
     *     heading: number,
     *     speed: number
     * }} options
     * @constructor
     */
    function Coordinates(options) {
        /** @type {number} */
        this.latitude = options.latitude;
        /** @type {number} */
        this.longitude = options.longitude;
        /** @type {number} */
        this.altitude = options.altitude;
        /** @type {number} */
        this.accuracy = options.accuracy;
        /** @type {number} */
        this.altitudeAccuracy = options.altitudeAccuracy;
        /** @type {number} */
        this.heading = options.heading;
        /** @type {number} */
        this.speed = options.speed;
    }

    return Coordinates;
});
