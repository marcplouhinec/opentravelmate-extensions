/**
 * Define the place finder object accessible from other extensions.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    '../place-commons/PlaceProvider',
    './menu-panel/externalController'
], function(PlaceProvider, externalController) {
    'use strict';

    var placeFinder = {
        /**
         * Register a PlaceProvider.
         *
         * @param {PlaceProvider} placeProvider
         */
        'registerPlaceProvider': function(placeProvider) {
            externalController.registerPlaceProvider(placeProvider);
        }
    };

    return placeFinder;
});
