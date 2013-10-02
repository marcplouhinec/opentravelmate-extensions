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
    '../core/widget/Widget',
    '../core/widget/webview/webview'
], function(geolocation, PositionOptions, MapButton, Marker, UrlMarkerIcon, LatLng, Point, Dimension, Widget, webview) {
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
        },

        /**
         * Find and show the current location of the device.
         */
        '_showCurrentLocation': function() {
            var self = this;

            geolocation.getCurrentPosition(function(position) {
                // Create a map marker and move the map on it
                var map  = /** @Type {Map} */ Widget.findById('map');
                if (self._marker) {
                    map.removeMarkers([self._marker]);
                }
                var latlng = new LatLng(position.coords.latitude, position.coords.longitude);
                self._marker = new Marker({
                    position: latlng,
                    title: 'Current location',
                    icon: new UrlMarkerIcon({
                        anchor: new Point(40 / 2, 40),
                        size: new Dimension(40, 40),
                        url: webview.baseUrl + 'extensions/map-tools/image/ic_user_location.png'
                    })
                });
                map.addMarkers([self._marker]);
                map.panTo(latlng);
            }, function(positionError) {
                // TODO show the error
                console.log(positionError);
            }, new PositionOptions({
                enableHighAccuracy: true,
                timeout: 10 * 60 * 1000,
                maximumAge: 10 * 60 * 1000
            }));
        }
    };

    return currentPositionButtonHandler;
});
