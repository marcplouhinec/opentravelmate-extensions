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
     *     provider: PlaceProviderService=
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
         * Place provider.
         *
         * @type {PlaceProviderService}
         */
        this.provider = options.provider;

        /**
         * Optional additional information.
         *
         * @type {Object.<string, Object>}
         */
        this.additionalParameters = options.additionalParameters || {};
    }

    return Place;
});
