/**
 * Represent geolocation position.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define(function() {
    'use strict';

    /**
     * Create new Position.
     *
     * @param {{
     *     coords: Coordinates,
     *     timestamp: Number
     * }} options
     * @constructor
     */
    function Position(options) {
        /** @type {Coordinates} */
        this.coords = options.coords;
        /** @type {Number} */
        this.timestamp = options.timestamp;
    }

    return Position;
});
