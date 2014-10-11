/**
 * Represent geolocation position.
 *
 * @author Marc Plouhinec
 */

define(function() {
    'use strict';

    /**
     * Create new Position.
     *
     * @param {{
     *     coords: Coordinates,
     *     timestamp: number
     * }} options
     * @constructor
     */
    function Position(options) {
        /** @type {Coordinates} */
        this.coords = options.coords;
        /** @type {number} */
        this.timestamp = options.timestamp;
    }

    return Position;
});
