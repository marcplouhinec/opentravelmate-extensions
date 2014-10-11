/**
 * Controller for the map buttons.
 *
 * @author Marc Plouhinec
 */

define([
    'jquery',
    'lodash',
    '../widget/Widget',
    '../widget/webview/webview',
    '../widget/map/MapButton',
    '../widget/map/LatLng',
    '../widget/map/Point',
    '../widget/map/Dimension',
    '../widget/map/UrlMarkerIcon',
    '../widget/map/Marker',
    '../widget/map/Map',
    '../../service/geolocationService',
    '../../entity/geolocation/PositionOptions',
    '../../entity/geolocation/PositionError',
    '../../entity/geolocation/Position',
    '../dialog/DialogOptions',
    '../dialog/notificationController',
    '../../entity/Place',
    '../place/placeSelectionMenuController'
], function($, _, Widget, webview, MapButton, LatLng, Point, Dimension, UrlMarkerIcon, Marker, Map, geolocationService,
            PositionOptions, PositionError, Position, DialogOptions, notificationController, Place, placeSelectionMenuController) {
    'use strict';

    /**
     * @constant
     * @type {string}
     */
    var TOOLTIP_ROADMAP_MODE = 'Show satellite map';

    /**
     * @constant
     * @type {string}
     */
    var ICON_URL_ROADMAP_MODE = 'extensions/org/opentravelmate/view/map/image/ic_btn_satellite_map_mode.png';

    /**
     * @constant
     * @type {string}
     */
    var TOOLTIP_SATELLITE_MODE = 'Show road map';

    /**
     * @constant
     * @type {string}
     */
    var ICON_URL_SATELLITE_MODE = 'extensions/org/opentravelmate/view/map/image/ic_btn_roads_map_mode.png';

    /**
     * @constant
     * @type {string}
     */
    var TOOLTIP_CURRENT_POSITION = 'Show my position on the map';

    /**
     * @constant
     * @type {string}
     */
    var ICON_URL_CURRENT_POSITION = 'extensions/org/opentravelmate/view/map/image/ic_btn_show_my_position.png';

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

    /**
     * Controller for the map buttons.
     */
    var mapButtonsController = {

        /**
         * @type {String}
         * @private
         */
        '_currentMapMode': 'ROADMAP',

        /**
         * @private
         */
        '_map': null,

        /**
         * @private
         * @type {MapButton}
         */
        '_satelliteMapButton': null,

        /**
         * @private
         * @type {MapButton}
         */
        '_currentPositionMapButton': null,

        /**
         * @private
         * @type {Marker}
         */
        '_currentPositionMarker': null,

        /**
         * @private
         * @type {Position}
         */
        '_currentPosition': null,

        /**
         * Initialization.
         */
        'init': function () {
            var self = this;

            // Add the map buttons when the map is completely initialized
            Widget.findByIdAsync('map', 10000, function(/** @type {Map} */map) {
                self._map = map;

                // Initialize the satellite button
                self._satelliteMapButton = new MapButton({
                    tooltip: TOOLTIP_ROADMAP_MODE,
                    iconUrl: ICON_URL_ROADMAP_MODE
                });
                map.addMapButton(self._satelliteMapButton);
                self._satelliteMapButton.onClick(function handleSatelliteMapButtonClick() {
                    if (self._currentMapMode === 'ROADMAP') {
                        self._switchToSatelliteMapMode();
                    } else {
                        self._switchToRoadMapMode();
                    }
                });

                // Initialize the current position button
                self._currentPositionMapButton = new MapButton({
                    tooltip: TOOLTIP_CURRENT_POSITION,
                    iconUrl: ICON_URL_CURRENT_POSITION
                });
                map.addMapButton(self._currentPositionMapButton);
                self._currentPositionMapButton.onClick(function handleCurrentPositionButtonClick() {
                    var options = new PositionOptions({
                        enableHighAccuracy: true,
                        timeout: MAX_WATCH_TIME,
                        maximumAge: MAX_POSITION_AGE,
                        acceptableAccuracy: ACCEPTABLE_ACCURACY,
                        maxWatchTime: MAX_WATCH_TIME
                    });
                    geolocationService.watchPosition(function handlePosition(position) {
                        self._showCurrentPositionOnMap(position);
                    }, function handleError(positionError) {
                        var message = 'Unable to get your position: ' + positionError.code + '.';
                        console.log(message + ' ' + positionError.message);
                        notificationController.showMessage(message, 5000, new DialogOptions({}));
                    }, options);
                });

                // Display information when the user click on the icon representing his position
                self._map.onMarkerClick(function handleCurrentPositionMarkerClick(marker) {
                    if (self._currentPositionMarker && self._currentPositionMarker.id === marker.id) {
                        self._map.showInfoWindow(marker, 'Current position');
                    }
                });
                self._map.onInfoWindowClick(function handleCurrentPositionInfoWindowClick(marker) {
                    if (self._currentPositionMarker && self._currentPositionMarker.id === marker.id) {
                        self._map.closeInfoWindow();

                        // Open the place selection menu
                        placeSelectionMenuController.showMenu(new Place({
                            latitude: self._currentPosition.coords.latitude,
                            longitude: self._currentPosition.coords.longitude,
                            name: 'Current Position',
                            additionalParameters: {
                                altitude: self._currentPosition.coords.altitude,
                                accuracy: self._currentPosition.coords.accuracy,
                                altitudeAccuracy: self._currentPosition.coords.altitudeAccuracy,
                                heading: self._currentPosition.coords.heading,
                                speed: self._currentPosition.coords.speed,
                                timestamp: self._currentPosition.timestamp
                            }
                        }));
                    }
                });
            });
        },

        /**
         * Set the map mode to 'satellite'.
         *
         * @private
         */
        '_switchToSatelliteMapMode': function() {
            this._map.setMapType('HYBRID');
            this._currentMapMode = 'HYBRID';

            this._satelliteMapButton.tooltip = TOOLTIP_SATELLITE_MODE;
            this._satelliteMapButton.iconUrl = ICON_URL_SATELLITE_MODE;
            this._map.updateMapButton(this._satelliteMapButton);
        },

        /**
         * Set the map mode to 'road'.
         *
         * @private
         */
        '_switchToRoadMapMode': function() {
            this._map.setMapType('ROADMAP');
            this._currentMapMode = 'ROADMAP';

            this._satelliteMapButton.tooltip = TOOLTIP_ROADMAP_MODE;
            this._satelliteMapButton.iconUrl = ICON_URL_ROADMAP_MODE;
            this._map.updateMapButton(this._satelliteMapButton);
        },

        /**
         * Show the current position on the map.
         *
         * @param {Position} position
         * @private
         */
        '_showCurrentPositionOnMap': function(position) {
            this._currentPosition = position;

            // Create a map marker and move the map on it
            var map  = /** @Type {Map} */ Widget.findById('map');
            if (this._currentPositionMarker) {
                map.removeMarkers([this._currentPositionMarker]);
            }
            var latlng = new LatLng(position.coords.latitude, position.coords.longitude);
            this._currentPositionMarker = new Marker({
                position: latlng,
                title: 'Current location',
                icon: new UrlMarkerIcon({
                    anchor: new Point(40 / 2, 40),
                    size: new Dimension(40, 40),
                    url: webview.baseUrl + 'extensions/org/opentravelmate/view/map/image/ic_user_location.png'
                })
            });
            map.addMarkers([this._currentPositionMarker]);
            map.panTo(latlng);
        }
    };

    return mapButtonsController;
});