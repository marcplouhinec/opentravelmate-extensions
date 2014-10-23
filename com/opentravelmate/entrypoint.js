/**
 * Define the Open Travel Mate commercial extension entry point.
 *
 * @author Marc Plouhinec
 */

define([
    '../../org/opentravelmate/service/placeProviderDirectoryService',
    '../../org/opentravelmate/service/itineraryProviderDirectoryService',
    './service/GooglePlaceProviderService',
    './service/StopPlaceProviderService',
    './service/PublicTransportItineraryProviderService',
    './controller/googlePlaceDetailsController',
    './controller/stopPlaceDetailsController',
    './controller/mapOverlayController'
], function(placeProviderDirectoryService, itineraryProviderDirectoryService, GooglePlaceProviderService, StopPlaceProviderService,
            PublicTransportItineraryProviderService, googlePlaceDetailsController, stopPlaceDetailsController, mapOverlayController) {
    'use strict';

    /**
     * Extension entry point.
     */
    return function commercialEntryPoint() {
        // Register place and itinerary providers
        var googlePlaceProviderService = new GooglePlaceProviderService(googlePlaceDetailsController);
        placeProviderDirectoryService.addPlaceProviderService(googlePlaceProviderService);
        itineraryProviderDirectoryService.addItineraryProviderService(new PublicTransportItineraryProviderService());

        // Initialize the controllers
        googlePlaceDetailsController.init(googlePlaceProviderService);
        mapOverlayController.init(new StopPlaceProviderService(stopPlaceDetailsController));
    };
});
