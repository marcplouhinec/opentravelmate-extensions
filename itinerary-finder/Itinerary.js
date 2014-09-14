/**
 * Define an itinerary.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define(['./ItineraryLeg'], function(ItineraryLeg) {
    'use strict';

    /**
     * Create a new Itinerary.
     *
     * @param options
     * @constructor
     */
    function Itinerary(options) {
        /**
         * Duration of the itinerary in second.
         *
         * @type {Number}
         */
        this.durationSecond = options.durationSecond;

        /**
         * Start date.
         *
         * @type {String}
         */
        this.startDateTime = options.startDateTime;

        /**
         * End date.
         *
         * @type {String}
         */
        this.endDateTime = options.endDateTime;

        /**
         * Itinerary legs.
         *
         * @type {Array.<ItineraryLeg>}
         */
        this.legs = [];
        for (var i = 0; i < options.legs.length; i++) {
            this.legs.push(new ItineraryLeg(options.legs[i]));
        }

        /**
         * ItineraryProvider that provided this itinerary.
         *
         * @type {ItineraryProvider}
         */
        this.itineraryProvider = options.itineraryProvider;
    }

    return Itinerary;
});
