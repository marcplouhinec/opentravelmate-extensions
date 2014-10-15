/**
 * Define the Open Travel Mate commercial extension entry point.
 *
 * @author Marc Plouhinec
 */

define([
    '../../org/opentravelmate/service/placeProviderDirectoryService',
    './service/GooglePlaceProviderService',
    './service/StopPlaceProviderService',
    './controller/googlePlaceDetailsController',
    './controller/stopPlaceDetailsController',
    './controller/mapOverlayController'
], function(placeProviderDirectoryService, GooglePlaceProviderService, StopPlaceProviderService, googlePlaceDetailsController, stopPlaceDetailsController, mapOverlayController) {
    'use strict';

    /**
     * Extension entry point.
     */
    return function commercialEntryPoint() {
        // Register place and itinerary providers
        var googlePlaceProviderService = new GooglePlaceProviderService(googlePlaceDetailsController);
        placeProviderDirectoryService.addPlaceProviderService(googlePlaceProviderService);

        // Initialize the controllers
        googlePlaceDetailsController.init(googlePlaceProviderService);
        mapOverlayController.init(new StopPlaceProviderService(stopPlaceDetailsController));
    };
});
