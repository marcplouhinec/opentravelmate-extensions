/**
 * Show an itinerary on the map.
 *
 * @author Marc Plouhinec
 */

define([
    'lodash',
    '../widget/Widget',
    '../widget/webview/webview',
    '../widget/map/Point',
    '../widget/map/Dimension',
    '../widget/map/LatLng',
    '../widget/map/Polyline',
    '../widget/map/UrlMarkerIcon',
    '../widget/map/Marker',
    '../widget/map/Map',
    '../../entity/itinerary/Itinerary'
], function(_, Widget, webview, Point, Dimension, LatLng, Polyline, UrlMarkerIcon, Marker, Map, Itinerary) {
    'use strict';

    var ITINERARY_POLYLINE_WEIGHT = 8;
    var GREEN_MARKER_ICON = 'extensions/org/opentravelmate/view/map/image/green_marker_icon.png';

    /**
     * Show an itinerary on the map.
     */
    var mapItineraryController = {

        /**
         * @type {Map}
         * @private
         */
        '_map': null,

        /**
         * @type {UrlMarkerIcon}
         * @private
         */
        '_greenMarkerIcon': undefined,

        /**
         * @private
         * @type {Itinerary}
         */
        '_itinerary': [],

        /**
         * @private
         * @type {Array.<Polyline>}
         */
        '_itineraryPolylines': [],

        /**
         * @private
         * @type {Array.<Marker>}
         */
        '_itineraryWaypointMarkers': [],

        /**
         * Initialization.
         */
        'init': function() {
            var self = this;

            Widget.findByIdAsync('map', 10000, function(/** @type {Map} */map) {
                self._map = map;

                self._greenMarkerIcon = new UrlMarkerIcon({
                    anchor: new Point(8,8),
                    size: new Dimension(16, 16),
                    url: webview.baseUrl + GREEN_MARKER_ICON
                });
            });
        },

        /**
         * Show the given itinerary on the map.
         *
         * @param {Itinerary} itinerary
         */
        'showItinerary': function(itinerary) {
            var self = this;
            this.clearItinerary();
            this._itinerary = itinerary;

            // Show the itinerary paths
            this._itineraryPolylines = [];
            _.each(itinerary.legs, function(leg) {
                var pathLatLng = _.map(leg.points, function (point) { return new LatLng(point.latitude, point.longitude); });
                self._itineraryPolylines.push(new Polyline({
                    path: pathLatLng,
                    color: leg.routeColor ? 0xFF000000 + parseInt(leg.routeColor, 16) : 0xFF1E90FF,
                    width: ITINERARY_POLYLINE_WEIGHT
                }));
            });
            this._map.addPolylines(this._itineraryPolylines);

            // Show the itinerary stops
            this._itineraryWaypointMarkers = _.chain(itinerary.legs)
                .map(function (leg, index) {
                    var markers = [];
                    if (index === 0) {
                        markers.push(new Marker({
                            position: new LatLng(leg.startPlacePoint.latitude, leg.startPlacePoint.longitude),
                            title: leg.startPlaceName,
                            icon: self._greenMarkerIcon
                        }));
                    }
                    markers.push(new Marker({
                        position: new LatLng(leg.endPlacePoint.latitude, leg.endPlacePoint.longitude),
                        title: leg.endPlaceName,
                        icon: self._greenMarkerIcon
                    }));
                    return markers;
                })
                .flatten(true)
                .value();
            this._map.addMarkers(this._itineraryWaypointMarkers);

            // Call the itinerary provider listener
            if (itinerary.provider) {
                itinerary.provider.onItineraryDetailsShown(itinerary);
            }
        },

        /**
         * Remove a displayed itinerary if any.
         */
        'clearItinerary': function() {
            // Call the itinerary provider listener
            if (this._itinerary && this._itinerary.provider) {
                this._itinerary.provider.onItineraryDetailsCleared(this._itinerary);
            }

            // Remove the itinerary stops
            if (this._itineraryWaypointMarkers) {
                this._map.removeMarkers(this._itineraryWaypointMarkers);
                this._itineraryWaypointMarkers = [];
            }

            // Remove the itinerary lines
            if (this._itineraryPolylines) {
                this._map.removePolylines(this._itineraryPolylines);
                this._itineraryPolylines = [];
            }
        }
    };

    return mapItineraryController;
});