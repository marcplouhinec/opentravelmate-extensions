/**
 * Provide places by using the www.services4otm.com web services.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    '../place-commons/PlaceProvider',
    '../place-commons/Place'
], function(PlaceProvider, Place) {
    'use strict';

    /**
     * Create the place provider.
     *
     * @constructor
     * @extends PlaceProvider
     */
    function Services4otmPlaceProvider() {
    }

    Services4otmPlaceProvider.prototype = new PlaceProvider();
    Services4otmPlaceProvider.prototype.constructor = Services4otmPlaceProvider;

    /**
     * Suggest places to the user when he's still writing the query.
     *
     * @param {String} query
     * @param {function(Array.<Place>)} callback
     */
    Services4otmPlaceProvider.prototype.suggestPlaces = function(query, callback) {
        // TODO - provide bus stops and lines
        callback([]);
    };

    /**
     * Find one or more places for the given query.
     *
     * @param {String} query
     * @param {function(Array.<Place>)} callback
     */
    Services4otmPlaceProvider.prototype.findPlaces = function(query, callback) {
        // TODO - provide bus stops and lines
        callback([]);
    };

    return Services4otmPlaceProvider;
});
