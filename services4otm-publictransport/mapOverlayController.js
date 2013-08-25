/**
 * Handle the map overlay.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    '../core/widget/Widget',
    '../core/widget/webview/webview',
    '../core/widget/map/Map',
    '../core/widget/map/TileOverlay',
    '../core/widget/map/LatLng',
    '../core/widget/map/Point',
    '../core/widget/map/Dimension',
    '../core/widget/map/Marker',
    '../core/widget/map/UrlMarkerIcon',
    './datastore/datastoreService'
], function(Widget, webview, Map, TileOverlay, LatLng, Point, Dimension, Marker, UrlMarkerIcon, datastoreService) {
    'use strict';

    var mapOverlayController = {

        /**
         * @type {Map}
         * @private
         */
        '_map': undefined,

        /**
         * Initialize the controller.
         */
        init: function() {
            var self = this;
            this._map = /** @type {Map} */ Widget.findById('map');

            // Create an overlay that displays public transport
            var tileOverlay = new TileOverlay({
                'zIndex': 0,
                'tileUrlPattern': 'http://www.services4otm.com/mapoverlay/publictransport/tile/${zoom}_${x}_${y}.png'
            });
            this._map.addTileOverlay(tileOverlay);

            // Load the markers
            this._map.onTilesDisplayed(function handleTilesDisplayed(tileCoordinates) {
                self.loadWaypoints(tileCoordinates);
            });
            this._map.onTilesReleased(function handleTilesReleased(tileCoordinates) {
                self.releaseWaypoints(tileCoordinates);
            });
        },

        /**
         * Load waypoints in the given tiles.
         *
         * @param {Array.<{zoom: Number, x: Number, y: number}>} tileCoordinates
         */
        loadWaypoints: function(tileCoordinates) {
            var self = this;

            var tileIds = _.map(tileCoordinates, function(tileCoordinate) {
                return tileCoordinate.zoom + '_' + tileCoordinate.x + '_' + tileCoordinate.y;
            });
            datastoreService.findStopsWithDrawingDataByTileIds(tileIds, function(error, stopsWithDrawingData) {
                // TODO
                /*_.each(stopsWithDrawingData, function(stopWithDrawingData) {
                    var waypoint = stopWithDrawingData.waypoint;
                    var marker = new Marker({
                        position: new LatLng(waypoint.latitude, waypoint.longitude),
                        title: waypoint.stopName,
                        icon: new UrlMarkerIcon({
                            anchor: new Point(8,8),
                            size: new Dimension(16, 16),
                            url: webview.baseUrl + '/extensions/services4otm-publictransport/image/black_marker_icon.png'
                        })
                    });
                    self._map.addMarker(marker);
                });*/
            });
        },

        /**
         * Release the waypoints from the given tiles.
         *
         * @param {Array.<{zoom: Number, x: Number, y: number}>} tileCoordinates
         */
        releaseWaypoints: function(tileCoordinates) {
            // TODO
        }
    };

    return mapOverlayController;
});
