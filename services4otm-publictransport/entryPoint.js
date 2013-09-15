/**
 * Services For Open Travel Mate - Public transport information provider - entry point.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    './mapOverlayController',
    './Services4otmPlaceProvider'
], function(mapOverlayController, Services4otmPlaceProvider) {
    'use strict';

    /**
     * Extension entry point.
     */
    return function main() {
        var services4otmPlaceProvider = new Services4otmPlaceProvider();
        mapOverlayController.init(services4otmPlaceProvider);
    };
});
