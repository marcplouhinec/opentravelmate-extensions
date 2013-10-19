/**
 * Define an itinerary path.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define(function() {
    'use strict';

    /**
     * Create a new Path.
     *
     * @param {{
     *     places: Array.<Place>=,
     *     additionalParameters: Object.<String, Object>=
     * }} options
     * @constructor
     */
    function Path(options) {
        /**
         * Path steps.
         *
         * @type {Array.<Place>}
         */
        this.places = options.places | [];

        /**
         * Additional information from the ItineraryProvider.
         *
         * @type {Object.<String, Object>}
         */
        this.additionalParameters = options.additionalParameters | {};
    }

    return Path;
});
