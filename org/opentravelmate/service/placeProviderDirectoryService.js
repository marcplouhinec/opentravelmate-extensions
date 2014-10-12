/**
 * Directory of place provider services.
 *
 * @author Marc Plouhinec
 */

define(['./PlaceProviderService'], function(PlaceProviderService) {
    'use strict';

    /**
     * Directory of place provider services.
     */
    var placeProviderDirectoryService = {

        /**
         * @private
         * @type {Array.<PlaceProviderService>}
         */
        '_placeProviderServices': [],

        /**
         * Register a PlaceProviderService.
         *
         * @param {PlaceProviderService} placeProviderService
         */
        'addPlaceProviderService': function(placeProviderService) {
            this._placeProviderServices.push(placeProviderService);
        },

        /**
         * Get all the registered place provider services.
         *
         * @returns {Array.<PlaceProviderService>}
         */
        'getAllPlaceProviderServices': function() {
            return this._placeProviderServices;
        }
    };

    return placeProviderDirectoryService;
});
