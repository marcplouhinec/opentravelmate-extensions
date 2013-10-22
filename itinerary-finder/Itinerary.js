/**
 * Define an itinerary.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define(function() {
    'use strict';

    /**
     * Create a new Itinerary.
     *
     * @param {{
     *     steps: Array.<Place|Path>,
     *     itineraryProvider: ItineraryProvider
     * }} options
     * @constructor
     */
    function Itinerary(options) {
        /**
         * Itinerary steps (Place - Path - Place - Path - ... - Place).
         *
         * @type {Array.<Place|Path>}
         */
        this.steps = options.steps;

        /**
         * ItineraryProvider that provided this itinerary.
         *
         * @type {ItineraryProvider}
         */
        this.itineraryProvider = options.itineraryProvider;
    }

    return Itinerary;
});
