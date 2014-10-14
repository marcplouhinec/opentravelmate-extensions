/**
 * Handle the map overlay.
 *
 * @author Marc Plouhinec
 */

define([
    'lodash',
    '../../../org/opentravelmate/controller/widget/Widget',
    '../../../org/opentravelmate/controller/widget/webview/webview',
    '../../../org/opentravelmate/controller/widget/map/TileOverlay',
    '../../../org/opentravelmate/controller/widget/map/Point',
    '../../../org/opentravelmate/controller/widget/map/Dimension',
    '../../../org/opentravelmate/controller/widget/map/LatLng',
    '../../../org/opentravelmate/controller/widget/map/UrlMarkerIcon',
    '../../../org/opentravelmate/controller/widget/map/Marker',
    '../../../org/opentravelmate/controller/widget/map/MapButton',
    '../../../org/opentravelmate/controller/widget/map/Map',
    '../service/tileService'
], function(_, Widget, webview, TileOverlay, Point, Dimension, LatLng, UrlMarkerIcon, Marker, MapButton, Map, tileService) {
    'use strict';

    var TOOLTIP_DOWNLOADING_BUTTON = 'Downloading map data...';
    var ICON_URL_DOWNLOADING = 'extensions/com/opentravelmate/view/image/downloading_icon.png';
    var ICON_URL_DOWNLOADING_BRIGHT = 'extensions/com/opentravelmate/view/image/downloading_icon_bright.png';
    var TRANSPARENT_MARKER_ICON = 'extensions/com/opentravelmate/view/image/transparent_marker_icon.png';
    var BLUE_MARKER_ICON = 'extensions/com/opentravelmate/view/image/blue_marker_icon.png';

    /**
     * Handle the map overlay.
     */
    var mapOverlayController = {

        /**
         * @type {Map}
         * @private
         */
        '_map': null,

        /**
         * @type {TileOverlay}
         * @private
         */
        '_tileOverlay': null,

        /**
         * @type {UrlMarkerIcon}
         * @private
         */
        '_transparentMarkerIcon': undefined,

        /**
         * @type {UrlMarkerIcon}
         * @private
         */
        '_blueMarkerIcon': undefined,

        /**
         * Marker displayed on top of a stop when the user put his mouse close to it.
         * @type {Marker}
         * @private
         */
        '_highlightedStopMarker': null,

        /**
         * @private
         * @type {boolean}
         */
        '_isDownloadingIconVisible': false,

        /**
         * @private
         * @type {MapButton}
         */
        '_downloadingMapButton': null,

        /**
         * @type {Object.<string, Stop>}
         * @private
         */
        '_stopByMarkerId': {},

        /**
         * Initialize the controller.
         */
        'init': function() {
            var self = this;

            Widget.findByIdAsync('map', 10000, function(/** @type {Map} */map) {
                self._map = map;

                // Create the downloading button
                self._downloadingMapButton = new MapButton({
                    tooltip: TOOLTIP_DOWNLOADING_BUTTON,
                    iconUrl: ICON_URL_DOWNLOADING
                });

                // Create marker icons
                self._transparentMarkerIcon = new UrlMarkerIcon({
                    anchor: new Point(8,8),
                    size: new Dimension(16, 16),
                    url: webview.baseUrl + TRANSPARENT_MARKER_ICON
                });
                self._blueMarkerIcon = new UrlMarkerIcon({
                    anchor: new Point(8,8),
                    size: new Dimension(16, 16),
                    url: webview.baseUrl + BLUE_MARKER_ICON
                });

                // Add the public transport overlay
                self._tileOverlay = new TileOverlay({
                    'zIndex': 0,
                    'tileUrlPattern': tileService.TILE_MAP_OVERLAY_URL_PATTERN
                });
                self._map.addTileOverlay(self._tileOverlay);

                // Load the markers
                self._map.onTilesDisplayed(function handleTilesDisplayed(tileCoordinates) {
                    self._loadStopsInTiles(tileCoordinates);
                });
                self._map.onTilesReleased(function handleTilesReleased(tileCoordinates) {
                    self._removeStopsFromTiles(tileCoordinates);
                });

                // Handle marker click
                self._map.onMarkerClick(function handleStopMarkerClick(marker) {
                    var stop = self._stopByMarkerId[marker.id];
                    if (stop) {
                        self._map.showInfoWindow(marker, stop.name, {x: 0, y: 0});
                    }
                });

                // Handle marker mouse hover
                self._map.onMarkerMouseEnter(function(marker) {
                    var stop = self._stopByMarkerId[marker.id];
                    if (!stop) { return; }

                    // Show a visible marker
                    self._highlightedStopMarker = new Marker({
                        position: new LatLng(stop.latitude, stop.longitude),
                        title: stop.name,
                        icon: self._blueMarkerIcon
                    });
                    self._map.addMarkers([self._highlightedStopMarker]);
                });
                self._map.onMarkerMouseLeave(function(marker) {
                    // If present, hide the highlighted marker
                    if (self._highlightedStopMarker) {
                        self._map.removeMarkers([self._highlightedStopMarker]);
                        delete self._highlightedStopMarker;
                    }
                });
            });
        },

        /**
         * Load stops in the given tiles.
         *
         * @param {Array.<{zoom: Number, x: Number, y: number}>} tileCoordinates
         */
        '_loadStopsInTiles': function(tileCoordinates) {
            if (!tileCoordinates || !tileCoordinates.length) { return; }

            this._setDownloadingIconVisible(true);
            var self = this;
            var zoom = tileCoordinates[0].zoom;
            var tileIds = _.map(tileCoordinates, function(tileCoordinate) {
                return tileCoordinate.zoom + '_' + tileCoordinate.x + '_' + tileCoordinate.y;
            });
            tileService.findStopsByTileIds(tileIds, function(error, stops) {
                self._setDownloadingIconVisible(false);

                // Create one transparent marker
                var markers = /** @type {Array.<Marker>} */ _.map(stops, function(stop) {
                    var marker = new Marker({
                        position: new LatLng(stop.latitude, stop.longitude),
                        title: stop.name,
                        icon: self._transparentMarkerIcon
                    });
                    self._stopByMarkerId[marker.id] = stop;
                    return marker;
                });

                // Save the marker locally
                //_.each(markers, function(marker) {
                //    self._addToMarkersByTileId(marker, zoom);
                //});
                // TODO

                // Show the markers on the map
                self._map.addMarkers(markers);
            });
        },

        /**
         * Release the stops from the given tiles.
         *
         * @param {Array.<{zoom: Number, x: Number, y: number}>} tileCoordinates
         */
        '_removeStopsFromTiles': function(tileCoordinates) {
            // TODO
        },

        /**
         * Show or hide the downloading icon.
         *
         * @param {boolean} visible true = visible, false = not visible
         */
        '_setDownloadingIconVisible': function(visible) {
            if (this._isDownloadingIconVisible === visible) { return; }

            // Hide the downloading icon if necessary
            if (!visible) {
                this._isDownloadingIconVisible = false;

                this._downloadingMapButton.iconUrl = ICON_URL_DOWNLOADING;
                this._map.removeMapButton(this._downloadingMapButton);

                return;
            }

            // Show the downloading icon if necessary
            this._isDownloadingIconVisible = true;
            this._map.addMapButton(this._downloadingMapButton);
            var self = this;
            function changeIconUrl() {
                if (!self._isDownloadingIconVisible) { return; }
                self._downloadingMapButton.iconUrl = self._downloadingMapButton.iconUrl === ICON_URL_DOWNLOADING ?
                    ICON_URL_DOWNLOADING_BRIGHT : ICON_URL_DOWNLOADING;
                self._map.updateMapButton(self._downloadingMapButton);
                setTimeout(changeIconUrl, 500);
            }
            changeIconUrl();
        }

    };

    return mapOverlayController;
});
