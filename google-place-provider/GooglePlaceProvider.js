/**
 * Place finder entry point.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'place-commons/PlaceProvider',
    'place-commons/Place'
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
                latitude: 1,
                longitude: 2,
                name: query + ' 1',
                accuracy: 0.5,
                placeDataProvider: this,
                additionalParameters: {}
            }),
            new Place({
                latitude: 2,
                longitude: 3,
                name: query + ' 2',
                accuracy: 0.4,
                placeDataProvider: this,
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
                latitude: 1,
                longitude: 2,
                name: query + 'Dummy place 3',
                accuracy: 0.5,
                placeDataProvider: this,
                additionalParameters: {}
            }),
            new Place({
                latitude: 2,
                longitude: 3,
                name: query + 'Dummy place 4',
                accuracy: 0.4,
                placeDataProvider: this,
                additionalParameters: {}
            })
        ]);
    };

    return GooglePlaceProvider;
});
