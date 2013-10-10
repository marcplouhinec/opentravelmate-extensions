/**
 * Provide one place: the device location.
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
    function CurrentPositionPlaceProvider() {
        PlaceProvider.register(this);
    }

    CurrentPositionPlaceProvider.prototype = new PlaceProvider();
    CurrentPositionPlaceProvider.prototype.constructor = CurrentPositionPlaceProvider;

    /**
     * Get the place provider name.
     *
     * @return {String}
     */
    CurrentPositionPlaceProvider.prototype.getName = function() {
        return 'map-tools/CurrentPositionPlaceProvider';
    };

    /**
     * Suggest places to the user when he's still writing the query.
     *
     * @param {String} query
     * @param {function(Array.<Place>)} callback
     */
    CurrentPositionPlaceProvider.prototype.suggestPlaces = function(query, callback) {
        // TODO - provide the current device position
        callback([]);
    };

    /**
     * Get more details for the given place.
     *
     * @param {Place} place
     * @param {function(place: Place)} callback
     */
    CurrentPositionPlaceProvider.prototype.getPlaceDetails = function(place, callback) {
        // TODO - Find the address where the device is located
        callback(place);
    };

    /**
     * Find one or more places for the given query.
     *
     * @param {String} query
     * @param {function(Array.<Place>)} callback
     */
    CurrentPositionPlaceProvider.prototype.findPlaces = function(query, callback) {
        // TODO - provide the current device position
        callback([]);
    };

    /**
     * Show the details of the given place in a new SubWebView (with the provided place holder).
     *
     * @param {Place} place
     * @param {HTMLDivElement} subWebViewPlaceHolder
     */
    CurrentPositionPlaceProvider.prototype.showPlaceDetails = function(place, subWebViewPlaceHolder) {
        // TODO - Find and show the address where the device is located
    };

    return CurrentPositionPlaceProvider;
});
