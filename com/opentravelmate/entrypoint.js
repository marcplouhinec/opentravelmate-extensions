/**
 * Define the Open Travel Mate commercial extension entry point.
 *
 * @author Marc Plouhinec
 */

define([
    '../../org/opentravelmate/service/placeProviderDirectoryService',
    './service/GooglePlaceProviderService',
    './controller/mapOverlayController'
], function(placeProviderDirectoryService, GooglePlaceProviderService, mapOverlayController) {
    'use strict';

    /**
     * Extension entry point.
     */
    return function commercialEntryPoint() {
        // Register place and itinerary providers
        placeProviderDirectoryService.addPlaceProviderService(new GooglePlaceProviderService());

        // Initialize the controllers
        mapOverlayController.init();
    };
});
