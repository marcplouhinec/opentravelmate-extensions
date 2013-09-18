/**
 * Provide places by using Google services.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    '../place-commons/PlaceProvider',
    '../place-commons/Place'
], function(PlaceProvider, Place) {
    'use strict';

    /**
     * Create a place provider that use Google services.
     *
     * @constructor
     * @extends PlaceProvider
     */
    function GooglePlaceProvider() {
    }

    GooglePlaceProvider.prototype = new PlaceProvider();
    GooglePlaceProvider.prototype.constructor = GooglePlaceProvider;

    /**
     * Suggest places to the user when he's still writing the query.
     *
     * @param {String} query
     * @param {function(Array.<Place>)} callback
     */
    GooglePlaceProvider.prototype.suggestPlaces = function(query, callback) {
        callback([
            new Place({
                latitude: 49.61,
                longitude: 6.1305,
                name: query + ' 1',
                accuracy: 0.5,
                placeProvider: this,
                additionalParameters: {}
            }),
            new Place({
                latitude: 49.61,
                longitude: 6.1315,
                name: query + ' 2',
                accuracy: 0.4,
                placeProvider: this,
                additionalParameters: {}
            })
        ]);
    };

    /**
     * Find one or more places for the given query.
     *
     * @param {String} query
     * @param {function(Array.<Place>)} callback
     */
    GooglePlaceProvider.prototype.findPlaces = function(query, callback) {
        callback([
            new Place({
                latitude: 49.605,
                longitude: 6.131,
                name: query + 'Dummy place 3',
                accuracy: 0.5,
                placeProvider: this,
                additionalParameters: {}
            }),
            new Place({
                latitude: 49.615,
                longitude: 6.131,
                name: query + 'Dummy place 4',
                accuracy: 0.4,
                placeProvider: this,
                additionalParameters: {}
            })
        ]);
    };

    /**
     * Show the details of the given place in a new SubWebView (with the provided place holder).
     *
     * @param {Place} place
     * @param {HTMLDivElement} subWebViewPlaceHolder
     */
    GooglePlaceProvider.prototype.showPlaceDetails = function(place, subWebViewPlaceHolder) {
        subWebViewPlaceHolder.setAttribute('data-otm-url', 'extensions/google-place-provider/google-place-details-subwebview/google-place-details.html');
        subWebViewPlaceHolder.setAttribute('data-otm-entrypoint', 'extensions/google-place-provider/google-place-details-subwebview/entryPoint');
    };

    return GooglePlaceProvider;
});
