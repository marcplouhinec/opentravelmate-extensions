/**
 * Services For Open Travel Mate - Public transport information provider - entry point.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    './mapOverlayController',
    './Services4otmPlaceProvider',
    '../itinerary-finder/itineraryFinder',
    './Services4otmItineraryProvider'
], function(mapOverlayController, Services4otmPlaceProvider, itineraryFinder, Services4otmItineraryProvider) {
    'use strict';

    /**
     * Extension entry point.
     */
    return function main() {
        var services4otmPlaceProvider = new Services4otmPlaceProvider();
        var services4otmItineraryProvider = new Services4otmItineraryProvider();
        mapOverlayController.init(services4otmPlaceProvider, services4otmItineraryProvider);
        itineraryFinder.addItineraryProvider(services4otmItineraryProvider);
    };
});
