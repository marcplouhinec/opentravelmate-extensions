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
     *     name: String=,
     *     color: String=,
     *     additionalParameters: Object.<String, Object>=
     * }} options
     * @constructor
     */
    function Path(options) {
        /**
         * Object type.
         *
         * @type {string}
         */
        this.type = 'Path';

        /**
         * Path name or title.
         *
         * @type {string}
         */
        this.name = options.name || '';

        /**
         * Path color in the format 'RRGGBB'.
         *
         * @type {string}
         */
        this.color = options.color || '000000';

        /**
         * Path steps.
         *
         * @type {Array.<Place>}
         */
        this.places = options.places || [];

        /**
         * Additional information from the ItineraryProvider.
         *
         * @type {Object.<String, Object>}
         */
        this.additionalParameters = options.additionalParameters || {};
    }

    return Path;
});
