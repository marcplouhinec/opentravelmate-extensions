/**
 * Define a place.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define(function() {
    'use strict';

    /**
     * Create a place.
     *
     * @param {{
     *     latitude: Number,
     *     longitude: Number,
     *     name: String,
     *     accuracy: Number,
     *     placeProvider: PlaceProvider,
     *     additionalParameters: Object.<String, Object>
     * }} options
     * @constructor
     */
    function Place(options) {
        /**
         * Place latitude.
         *
         * @type {Number}
         */
        this.latitude = options.latitude;

        /**
         * Place longitude.
         *
         * @type {Number}
         */
        this.longitude = options.longitude;

        /**
         * Place name.
         *
         * @type {String}
         */
        this.name = options.name;

        /**
         * Accuracy of this place.
         *
         * Note 1: this value is used to sort the places provided between different providers.
         *         The goal is to show bus/train stations before street names for example.
         * Note 2: the value must be >= 0 and <= 1
         *
         * @type {Number}
         */
        this.accuracy = options.accuracy;

        /**
         * PlaceProvider that provided this place.
         *
         * @type {PlaceProvider}
         */
        this.placeProvider = options.placeProvider;

        /**
         * Additional information provided by the PlaceProvider.
         *
         * @type {Object.<String, Object>}
         */
        this.additionalParameters = options.additionalParameters;
    }

    return Place;
});
