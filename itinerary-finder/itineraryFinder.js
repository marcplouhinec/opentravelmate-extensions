/**
 * Handle itinerary computation and presentation..
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'jquery',
    '../core/widget/Widget',
    '../core/widget/webview/webview',
    '../core/widget/map/Point',
    '../core/widget/map/Dimension',
    '../core/widget/map/LatLng',
    '../core/widget/map/Marker',
    '../core/widget/map/UrlMarkerIcon',
    '../services4otm-publictransport/Services4otmPlaceProvider',
    './itineraryPanel'
], function($, Widget, webview, Point, Dimension, LatLng, Marker, UrlMarkerIcon, Services4otmPlaceProvider, itineraryPanel) {
    'use strict';

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
         * @type {Array.<ItineraryProvider>}
         * @private
         */
        '_itineraryProviders': [],

        /**
         * Register the given itinerary provider.
         *
         * @param {ItineraryProvider} itineraryProvider
         */
        'addItineraryProvider': function(itineraryProvider) {
            this._itineraryProviders.push(itineraryProvider);
        },

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

            for (var i = 0; i < this._itineraryProviders.length; i += 1) {
                var itineraryProvider = this._itineraryProviders[i];
                itineraryProvider.findItineraries(this._startingPlace, this._destinationPlace, function(result) {
                    //Stop if an error occurred
                    if (result.error) {
                        // TODO - Display an error to the user
                        console.log(result.error);
                        return;
                    }

                    // Handle the itineraries
                    self._showItineraries(result.itineraries);
                });
            }
        },

        /**
         * Show the itineraries .
         *
         * @param {Array.<Itinerary>} itineraries
         */
        '_showItineraries': function(itineraries) {
            // Show the first itinerary only
            itineraryPanel.open(itineraries[0]);
        }
    };

    return itineraryFinder;
});
