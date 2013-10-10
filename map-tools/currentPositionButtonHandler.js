/**
 * Handle the Show current position button.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    '../core/geolocation/geolocation',
    '../core/geolocation/PositionOptions',
    '../core/widget/map/MapButton',
    '../core/widget/map/Marker',
    '../core/widget/map/UrlMarkerIcon',
    '../core/widget/map/LatLng',
    '../core/widget/map/Point',
    '../core/widget/map/Dimension',
    '../place-commons/Place',
    '../place-information/placeSelectionMenu',
    '../core/widget/Widget',
    '../core/widget/webview/webview',
    './CurrentPositionPlaceProvider'
], function(geolocation, PositionOptions, MapButton, Marker, UrlMarkerIcon, LatLng, Point, Dimension, Place, placeSelectionMenu, Widget, webview, CurrentPositionPlaceProvider) {
    'use strict';

    /**
     * @constant
     * @type {string}
     */
    var TOOLTIP = 'Show my position on the map';

    /**
     * @constant
     * @type {string}
     */
    var ICON_URL = 'extensions/map-tools/image/ic_btn_show_my_position.png';

    /**
     * Maximum position watching time in milliseconds.
     *
     * @constant
     * @type {number}
     */
    var MAX_WATCH_TIME = 60 * 1000;

    /**
     * Maximum position age in milliseconds.
     *
     * @constant
     * @type {number}
     */
    var MAX_POSITION_AGE = 1000 * 60 * 2;

    /**
     * Acceptable accuracy in meters.
     *
     * @constant
     * @type {number}
     */
    var ACCEPTABLE_ACCURACY = 100;


    var currentPositionButtonHandler = {
        /**
         * @private
         */
        '_map': null,

        /**
         * @type {Marker}
         * @private
         */
        '_marker': null,

        /**
         * @private
         * @type {MapButton}
         */
        '_mapButton': null,

        /**
         * @type {Number}
         * @private
         */
        '_watchId': -1,

        /**
         * @type {Position=}
         * @private
         */
        '_currentBestPosition': null,

        /**
         * Create a new current position button.
         *
         * @param {Map} map
         */
        'createButton': function(map) {
            var self = this;
            this._map = map;

            this._mapButton = new MapButton({
                tooltip: TOOLTIP,
                iconUrl: ICON_URL
            });
            map.addMapButton(this._mapButton);

            this._mapButton.onClick(function() {
                self._showCurrentLocation();
            });

            // Handle current position marker & info window click
            var currentPositionPlaceProvider = new CurrentPositionPlaceProvider();
            this._map.onMarkerClick(function handleCurrentPositionMarkerClick(marker) {
                if (self._marker && self._marker.id === marker.id) {
                    self._map.showInfoWindow(marker, 'Current position');
                }
            });
            this._map.onInfoWindowClick(function handleCurrentPositionInfoWindowClick(marker) {
                if (self._marker && self._marker.id === marker.id) {
                    placeSelectionMenu.open(new Place({
                        latitude: self._currentBestPosition.coords.latitude,
                        longitude: self._currentBestPosition.coords.longitude,
                        name: 'Current Position',
                        accuracy: 1,
                        placeProvider: currentPositionPlaceProvider,
                        additionalParameters: {}
                    }));
                    self._map.closeInfoWindow();
                }
            });
        },

        /**
         * Find and show the current location of the device.
         */
        '_showCurrentLocation': function() {
            var self = this;

            if (this._watchId < 0) {
                this._watchId = geolocation.watchPosition(function(position) { self._handleNewPosition(position) }, function(positionError) {
                    // TODO show the error
                    console.log(JSON.stringify(positionError));
                }, new PositionOptions({
                    enableHighAccuracy: true,
                    timeout: MAX_WATCH_TIME,
                    maximumAge: MAX_POSITION_AGE
                }));
            }

            // Stop watching the position after a certain time (to save battery)
            setTimeout(function() {
                if (self._watchId) {
                    geolocation.clearWatch(self._watchId);
                }
            }, MAX_WATCH_TIME);
        },

        /**
         * Handle a new position from the geolocation API.
         *
         * @param {Position} position
         */
        '_handleNewPosition': function(position) {
            if (!this._isBetterPosition(position, this._currentBestPosition)) {
                return;
            }

            this._currentBestPosition = position;

            // Create a map marker and move the map on it
            var map  = /** @Type {Map} */ Widget.findById('map');
            if (this._marker) {
                map.removeMarkers([this._marker]);
            }
            var latlng = new LatLng(position.coords.latitude, position.coords.longitude);
            this._marker = new Marker({
                position: latlng,
                title: 'Current location',
                icon: new UrlMarkerIcon({
                    anchor: new Point(40 / 2, 40),
                    size: new Dimension(40, 40),
                    url: webview.baseUrl + 'extensions/map-tools/image/ic_user_location.png'
                })
            });
            map.addMarkers([this._marker]);
            map.panTo(latlng);

            // Stop watching the position if the current one is acceptable
            if (position.coords.accuracy <= ACCEPTABLE_ACCURACY) {
                geolocation.clearWatch(this._watchId);
                this._watchId = null;
            }
        },

        /**
         * Thanks to the Google Android developer page:
         * @see http://developer.android.com/guide/topics/location/strategies.html
         *
         * @param {Position=} newPosition
         * @param {Position=} currentBestPosition
         * @returns {boolean} true if the newPosition is better than the current one, or false if not.
         */
        '_isBetterPosition': function(newPosition, currentBestPosition) {
            if (!currentBestPosition) {
                return true;
            }
            if (!newPosition) {
                return false;
            }

            // Check whether the new position is newer or older
            var timeDelta = newPosition.timestamp - currentBestPosition.timestamp;
            var isSignificantlyNewer = timeDelta > MAX_POSITION_AGE;
            var isSignificantlyOlder = timeDelta < -MAX_POSITION_AGE;
            var isNewer = timeDelta > 0;

            if (isSignificantlyNewer) {
                return true;
            } else if (isSignificantlyOlder) {
                return false;
            }

            // Check whether the new position is more or less accurate
            var accuracyDelta = newPosition.coords.accuracy - currentBestPosition.coords.accuracy;
            var isMoreAccurate = accuracyDelta < 0;
            var isSignificantlyLessAccurate = accuracyDelta > 2 * ACCEPTABLE_ACCURACY;

            if (isMoreAccurate) {
                return true;
            } else if (isNewer && !isSignificantlyLessAccurate) {
                return true;
            }

            return false;
        }
    };

    return currentPositionButtonHandler;
});
