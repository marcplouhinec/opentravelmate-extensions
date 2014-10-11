/**
 * Define a place.
 *
 * @author Marc Plouhinec
 */

define(function() {
    'use strict';

    /**
     * Create a place.
     *
     * @param {{
     *     latitude: number,
     *     longitude: number,
     *     name: string,
     *     additionalParameters: Object.<string, Object>=
     * }} options
     * @constructor
     */
    function Place(options) {
        /**
         * Place latitude.
         *
         * @type {number}
         */
        this.latitude = options.latitude;

        /**
         * Place longitude.
         *
         * @type {number}
         */
        this.longitude = options.longitude;

        /**
         * Place name.
         *
         * @type {string}
         */
        this.name = options.name;

        /**
         * Optional additional information.
         *
         * @type {Object.<string, Object>}
         */
        this.additionalParameters = options.additionalParameters || {};
    }

    return Place;
});
