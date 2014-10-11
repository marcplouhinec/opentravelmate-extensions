/**
 * Define position options.
 *
 * @author Marc Plouhinec
 */

define(function() {
    'use strict';

    /**
     * Create new PositionOptions.
     *
     * @param {{
     *     enableHighAccuracy: =boolean,
     *     timeout: =number,
     *     maximumAge: =number,
     *     acceptableAccuracy: =number,
     *     maxWatchTime: =number
     * }} options
     * @constructor
     */
    function PositionOptions(options) {

        /**
         * @type {boolean}
         */
        this.enableHighAccuracy = options.enableHighAccuracy ? true : false;

        /**
         * Timeout in milliseconds.
         *
         * @type {number}
         */
        this.timeout = options.timeout || 0;

        /**
         * @type {number}
         */
        this.maximumAge = options.maximumAge || 0;

        /**
         * This option is used by the 'watchPosition' function: if > 0, the 'clearWatch' function is automatically
         * called if the accuracy of a position is equal or lower than this value (in meters).
         *
         * @type {number}
         */
        this.acceptableAccuracy = options.acceptableAccuracy || 0;

        /**
         * This option is used by the 'watchPosition' function: if > 0, the 'clearWatch' function is automatically
         * called after the period defined by this value (in milliseconds).
         *
         * @type {number}
         */
        this.maxWatchTime = options.maxWatchTime || 0;
    }

    return PositionOptions;
});
