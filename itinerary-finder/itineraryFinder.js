/**
 * Handle itinerary computation and presentation..
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'jquery',
    'underscore',
    '../core/widget/Widget',
    '../core/widget/webview/webview',
    '../core/widget/map/Point',
    '../core/widget/map/Dimension',
    '../core/widget/map/LatLng',
    '../core/widget/map/Marker',
    '../core/widget/map/UrlMarkerIcon',
    '../services4otm-publictransport/Services4otmPlaceProvider'
], function($, _, Widget, webview, Point, Dimension, LatLng, Marker, UrlMarkerIcon, Services4otmPlaceProvider) {
    'use strict';

    /**
     * @constant
     * @type {String}
     */
    var ITINERARY_WS_URL = 'http://www.services4otm.com/itinerary/publictransport/';

    var itineraryFinder = {

        /**
         * @type {Place=}
         * @private
         */
        '_startingPlace': null,

        /**
         * @type {Place=}
         * @private
         */
        '_destinationPlace': null,

        /**
         * @type {Marker=}
         * @private
         */
        '_startingPlaceMarker': null,

        /**
         * @type {Marker=}
         * @private
         */
        '_destinationPlaceMarker': null,

        /**
         * Set the itinerary starting place.
         *
         * @param {Place} place
         */
        'setStartingPlace': function(place) {
            this._startingPlace = place;

            // Remove the old starting place marker if any
            var map  = /** @Type {Map} */ Widget.findById('map');
            if (this._startingPlaceMarker) {
                map.removeMarkers([this._startingPlaceMarker]);
            }

            // Set the starting place marker
            this._startingPlaceMarker = new Marker({
                position: new LatLng(place.latitude, place.longitude),
                title: 'Starting place',
                icon: new UrlMarkerIcon({
                    anchor: new Point(13, 38),
                    size: new Dimension(40, 40),
                    url: webview.baseUrl + 'extensions/itinerary-finder/image/ic_flag_green.png'
                })
            });
            map.addMarkers([this._startingPlaceMarker]);

            // Find itineraries if possible
            if (this._startingPlace && this._destinationPlace) {
                this._findItineraries();
            }
        },

        /**
         * Set the itinerary destination place.
         *
         * @param {Place} place
         */
        'setDestinationPlace': function(place) {
            this._destinationPlace = place;

            // Remove the old destination place marker if any
            var map  = /** @Type {Map} */ Widget.findById('map');
            if (this._destinationPlaceMarker) {
                map.removeMarkers([this._destinationPlaceMarker]);
            }

            // Set the destination place marker
            this._destinationPlaceMarker = new Marker({
                position: new LatLng(place.latitude, place.longitude),
                title: 'Starting place',
                icon: new UrlMarkerIcon({
                    anchor: new Point(13, 38),
                    size: new Dimension(40, 40),
                    url: webview.baseUrl + 'extensions/itinerary-finder/image/ic_flag_red.png'
                })
            });
            map.addMarkers([this._destinationPlaceMarker]);

            // Find itineraries if possible
            if (this._startingPlace && this._destinationPlace) {
                this._findItineraries();
            }
        },

        /**
         * Find itineraries between the starting place and the destination.
         */
        '_findItineraries': function() {
            var self = this;
            var startPoint = this._startingPlace.placeProvider.getName() === Services4otmPlaceProvider.NAME ?
                this._startingPlace.additionalParameters['waypointId'] :
                {'latitude': this._startingPlace.latitude, 'longitude': this._startingPlace.longitude};
            var endPoint = this._destinationPlace.placeProvider.getName() === Services4otmPlaceProvider.NAME ?
                this._destinationPlace.additionalParameters['waypointId'] :
                {'latitude': this._destinationPlace.latitude, 'longitude': this._destinationPlace.longitude};
            var url = ITINERARY_WS_URL + '?' +
                (_.isString(startPoint) ? 'startWaypointId=' + startPoint : 'startLocation=' + JSON.stringify(startPoint)) + '&' +
                (_.isString(endPoint) ? 'endWaypointId=' + endPoint : 'endLocation=' + JSON.stringify(endPoint)) +
                '&include_docs=true&jsoncallback=?';
            $.getJSON(url, function (itineraryInformation) {
                //Stop if an error occurred
                if (itineraryInformation.error) {
                    // TODO - Display an error to the user
                    console.log(itineraryInformation.error);
                    return;
                }

                self._handleItinerary(itineraryInformation);
            });
        },

        /**
         * Handle itinerary data from Services4otm.
         *
         * @param itineraryInformation
         */
        '_handleItinerary': function(itineraryInformation) {
            // TODO
            console.log(itineraryInformation);
        }
    };

    return itineraryFinder;
});
