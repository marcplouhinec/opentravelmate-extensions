/**
 * Define a stop.
 *
 * @author Marc Plouhinec
 */

define(function() {
    'use strict';

    /**
     * Create a new Stop.
     *
     * @param options
     * @constructor
     */
    function Stop(options) {
        /**
         * Internal ID.
         *
         * @type {string}
         */
        this.id = options.id;

        /**
         * Point latitude.
         *
         * @type {number}
         */
        this.latitude = options.latitude;

        /**
         * Point longitude.
         *
         * @type {number}
         */
        this.longitude = options.longitude;

        /**
         * Stop name.
         *
         * @type {string=}
         */
        this.stopName = options.stopName;
    }

    return Stop;
});
