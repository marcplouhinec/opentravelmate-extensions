/**
 * Provide places by using the www.services4otm.com web services.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    '../core/widget/Widget',
    '../core/widget/webview/SubWebView',
    '../place-commons/PlaceProvider',
    '../place-commons/Place',
    './datastore/datastoreService',
    './services4otm-place-details-subwebview/constants'
], function(Widget, SubWebView, PlaceProvider, Place, datastoreService, placeDetailsSubWebViewConstants) {
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

    /**
     * Show the details of the given place in a new SubWebView (with the provided place holder).
     *
     * @param {Place} place
     * @param {HTMLDivElement} subWebViewPlaceHolder
     */
    Services4otmPlaceProvider.prototype.showPlaceDetails = function(place, subWebViewPlaceHolder) {
        subWebViewPlaceHolder.setAttribute(
            'data-otm-url',
            'extensions/services4otm-publictransport/services4otm-place-details-subwebview/services4otm-place-details.html');
        subWebViewPlaceHolder.setAttribute(
            'data-otm-entrypoint',
            'extensions/services4otm-publictransport/services4otm-place-details-subwebview/entryPoint');

        // Load data for the SubWebView
        var waypointId = place.additionalParameters['waypointId'];
        var subWebViewId = subWebViewPlaceHolder.getAttribute('id');
        datastoreService.findLinesAndDirectionsByWaypoint(waypointId, function(error, lines, directions) {

            // Send the data to the SubWebView
            SubWebView.onCreate(subWebViewId, function() {
                var subWebView = /** @type {SubWebView} */ Widget.findById(subWebViewId);
                subWebView.fireInternalEvent(placeDetailsSubWebViewConstants.PLACE_DATA_LOADED_EVENT, {
                    error: error,
                    lines: lines,
                    directions: directions
                });
            });
        });
    };

    return Services4otmPlaceProvider;
});
