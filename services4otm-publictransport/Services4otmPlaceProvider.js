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
        PlaceProvider.register(this);
    }

    Services4otmPlaceProvider.prototype = new PlaceProvider();
    Services4otmPlaceProvider.prototype.constructor = Services4otmPlaceProvider;

    /**
     * @constant
     * @type {string}
     */
    Services4otmPlaceProvider.NAME = 'services4otm-publictransport/Services4otmPlaceProvider';

    /**
     * Get the place provider name.
     *
     * @return {String}
     */
    Services4otmPlaceProvider.prototype.getName = function() {
        return Services4otmPlaceProvider.NAME;
    };

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
     * Get more details for the given place.
     *
     * @param {Place} place
     * @param {function(place: Place)} callback
     */
    Services4otmPlaceProvider.prototype.getPlaceDetails = function(place, callback) {
        // TODO - provide bus stops and lines
        callback(place);
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

        // Wait the SubWebView is loaded before loading the data
        var waypointId = place.additionalParameters['waypointId'];
        var subWebViewId = subWebViewPlaceHolder.getAttribute('id');
        SubWebView.onCreate(subWebViewId, function() {
            var subWebView = /** @type {SubWebView} */ Widget.findById(subWebViewId);

            // Load line information to the sub web view
            datastoreService.findLinesAndDirectionsByWaypoint(waypointId, function(error, lines, directions) {
                subWebView.fireInternalEvent(placeDetailsSubWebViewConstants.PLACE_DATA_LOADED_EVENT, {
                    error: error,
                    lines: lines,
                    directions: directions
                });
            });

            // Show a timetable when the user click on a timetable button.
            subWebView.onInternalEvent(placeDetailsSubWebViewConstants.SHOW_TIMETABLE_EVENT, function(payload) {
                datastoreService.findTimetablesByLineAndDirections(payload.lineId, payload.direction1Id, payload.direction2Id, function(error, periods, timetables) {
                    // TODO
                    console.log(error);
                    console.log(periods);
                    console.log(timetables);
                });
            });
        });
    };

    return Services4otmPlaceProvider;
});
