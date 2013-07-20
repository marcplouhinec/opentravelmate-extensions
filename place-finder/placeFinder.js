/**
 * Define the place finder object accessible from other extensions.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define(['place-commons/PlaceProvider'], function(PlaceProvider) {
    'use strict';

    var placeFinder = {

        /**
         * Registered place providers.
         *
         * @type {Array.<PlaceProvider>}
         * @private
         */
        '_placeProviders': [],

        /**
         * Register a PlaceProvider.
         *
         * @param {PlaceProvider} placeProvider
         */
        'registerPlaceDataProvider': function(placeProvider) {
            this._placeProviders.push(placeProvider);
        }
    };

    return placeFinder;
});
