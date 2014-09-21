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
        'registerPlaceProvider': function(placeProvider) {
            this._placeProviders.push(placeProvider);
            externalController.registerPlaceProvider(placeProvider);
        },

        /**
         * Suggest some places according to the given query.
         *
         * @param {String} query
         * @param {function(suggestedPlaces: Array.<Place>)} callback
         */
        'autoCompletePlaces': function (query, callback) {
            var nbPlaceProvidersToWait = this._placeProviders.length;
            var foundPlaces = [];

            function handleSuggestedPlaces(/** @type {Array.<Place>} */places) {
                foundPlaces = foundPlaces.concat(places);
                nbPlaceProvidersToWait--;
                if (nbPlaceProvidersToWait === 0) {
                    callback(foundPlaces);
                }
            }

            for (var i = 0; i < this._placeProviders.length; i++) {
                var placeProvider = this._placeProviders[i];
                placeProvider.suggestPlaces(query, handleSuggestedPlaces)
            }
        }
    };

    return placeFinder;
});
