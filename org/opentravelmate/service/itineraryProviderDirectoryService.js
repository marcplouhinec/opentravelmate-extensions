/**
 * Directory of itinerary provider services.
 *
 * @author Marc Plouhinec
 */

define(['./ItineraryProviderService'], function(ItineraryProviderService) {
    'use strict';

    /**
     * Directory of itinerary provider services.
     */
    var itineraryProviderDirectoryService = {

        /**
         * @private
         * @type {Array.<ItineraryProviderService>}
         */
        '_itineraryProviderServices': [],

        /**
         * Register a ItineraryProviderService.
         *
         * @param {ItineraryProviderService} itineraryProviderService
         */
        'addItineraryProviderService': function(itineraryProviderService) {
            this._itineraryProviderServices.push(itineraryProviderService);
        },

        /**
         * Get all the registered itinerary provider services.
         *
         * @returns {Array.<ItineraryProviderService>}
         */
        'getAllItineraryProviderServices': function() {
            return this._itineraryProviderServices;
        }
    };

    return itineraryProviderDirectoryService;
});
