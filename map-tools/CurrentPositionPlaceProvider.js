/**
 * Provide one place: the device location.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    '../core/widget/Widget',
    '../core/widget/webview/SubWebView',
    '../place-commons/PlaceProvider',
    '../place-commons/Place',
    './current-position-place-details-subwebview/constants'
], function(Widget, SubWebView, PlaceProvider, Place, placeDetailsSubWebViewConstants) {
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

        subWebViewPlaceHolder.setAttribute(
            'data-otm-url',
            'extensions/map-tools/current-position-place-details-subwebview/current-position-place-details.html');
        subWebViewPlaceHolder.setAttribute(
            'data-otm-entrypoint',
            'extensions/map-tools/current-position-place-details-subwebview/entryPoint');

        // Wait the SubWebView is loaded before loading the data
        var subWebViewId = subWebViewPlaceHolder.getAttribute('id');
        SubWebView.onCreate(subWebViewId, function() {
            var subWebView = /** @type {SubWebView} */ Widget.findById(subWebViewId);
            subWebView.fireInternalEvent(placeDetailsSubWebViewConstants.PLACE_DATA_LOADED_EVENT, {
                place: place
            });
        });
    };

    return CurrentPositionPlaceProvider;
});
