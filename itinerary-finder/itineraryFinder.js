/**
 * Handle itinerary computation and presentation..
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'jquery',
    '../core/widget/Widget',
    '../core/widget/webview/webview',
    '../core/widget/webview/SubWebView',
    '../core/widget/map/Point',
    '../core/widget/map/Dimension',
    '../core/widget/map/LatLng',
    '../core/widget/map/Marker',
    '../core/widget/map/UrlMarkerIcon',
    '../services4otm-publictransport/Services4otmPlaceProvider',
    './itineraryPanel',
    './itinerary-finder-subwebview/constants'
], function($, Widget, webview, SubWebView, Point, Dimension, LatLng, Marker, UrlMarkerIcon, Services4otmPlaceProvider, itineraryPanel, itineraryFinderWebViewConstants) {
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
         * Currently shown itinerary.
         *
         * @type {Itinerary}
         * @private
         */
        '_shownItinerary': null,

        /**
         * @type {HTMLDivElement}
         * @private
         */
        '_subWebViewPlaceHolder': null,

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
         * Clear the starting and destination places on the map.
         */
        'clearStartingAndDestinationPlaces': function() {
            var markersToRemove = [];
            if (this._startingPlaceMarker) {
                markersToRemove.push(this._startingPlaceMarker);
            }
            if (this._destinationPlaceMarker) {
                markersToRemove.push(this._destinationPlaceMarker);
            }
            var map  = /** @Type {Map} */ Widget.findById('map');
            map.removeMarkers(markersToRemove);

            this._startingPlace = null;
            this._destinationPlace = null;
        },

        /**
         * Open the webview to allow a user to find itineraries.
         */
        'open': function() {
            var self = this;

            // Create the details SubWebView place holder
            this._subWebViewPlaceHolder = /** @type {HTMLDivElement} */document.createElement('div');
            this._subWebViewPlaceHolder.setAttribute('id', itineraryFinderWebViewConstants.SUBWEBVIEW_ID);
            this._subWebViewPlaceHolder.style.position = 'absolute';
            this._subWebViewPlaceHolder.style.left = '0px';
            this._subWebViewPlaceHolder.style.top = '0px';
            this._subWebViewPlaceHolder.style.width = '100%';
            this._subWebViewPlaceHolder.style.height = '100%';
            this._subWebViewPlaceHolder.setAttribute('data-otm-widget', 'SubWebView');
            this._subWebViewPlaceHolder.setAttribute('data-otm-url', 'extensions/itinerary-finder/itinerary-finder-subwebview/itinerary-finder.html');
            this._subWebViewPlaceHolder.setAttribute('data-otm-entrypoint', 'extensions/itinerary-finder/itinerary-finder-subwebview/entryPoint');
            document.body.appendChild(this._subWebViewPlaceHolder);

            // Register event handlers when the SubWebView is loaded
            SubWebView.onCreate(itineraryFinderWebViewConstants.SUBWEBVIEW_ID, function() {
                var subWebView = /** @type {SubWebView} */ Widget.findById(itineraryFinderWebViewConstants.SUBWEBVIEW_ID);
                subWebView.onInternalEvent(itineraryFinderWebViewConstants.CLOSE_EVENT, function() {
                    self._handleCloseEvent();
                });
            });

            webview.layout();
        },

        /**
         * Close the details panel.
         */
        'close': function() {
            if (this._subWebViewPlaceHolder) {
                document.body.removeChild(this._subWebViewPlaceHolder);
                delete this._subWebViewPlaceHolder;
                webview.layout();
            }
        },

        /**
         * Handle the CLOSE event.
         *
         * @private
         */
        '_handleCloseEvent': function() {
            // Close the dialog box
            this.close();
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
            var self = this;

            // Clear the currently shown itinerary if necessary
            if (this._shownItinerary) {
                this._hideItineraries();
            }

            // Show the first itinerary only
            var firstItinerary = itineraries[0];
            this._shownItinerary = firstItinerary;
            itineraryPanel.open(firstItinerary, function handleCloseEvent(itinerary) {
                self._hideItineraries();
            });
            firstItinerary.itineraryProvider.showItinerary(firstItinerary);
        },

        /**
         * Clear the shown itineraries.
         */
        '_hideItineraries': function() {
            this._shownItinerary.itineraryProvider.clearItinerary(self._itinerary);
            delete this._shownItinerary;

            this.clearStartingAndDestinationPlaces();
        }
    };

    return itineraryFinder;
});
