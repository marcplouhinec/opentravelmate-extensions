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
    '../core/widget/map/projectionUtils',
    '../place-commons/Place',
    '../place-information/placeSelectionMenu',
    './datastore/datastoreService',
    './datastore/Waypoint',
    './waypointMarkerIconBuilder'
], function(
    Widget, webview, Map, TileOverlay, LatLng, Point, Dimension, Marker, UrlMarkerIcon,
    projectionUtils, Place, placeSelectionMenu, datastoreService, Waypoint, waypointMarkerIconBuilder) {
    'use strict';

    var mapOverlayController = {

        /**
         * @type {Map}
         * @private
         */
        '_map': undefined,

        /**
         * @type {Object.<String, Array.<Marker>>}
         * @private
         */
        '_markersByTileId': {},

        /**
         * @type {Object.<String, Waypoint>}
         * @private
         */
        '_waypointByMarkerId': {},

        /**
         * Initialize the controller.
         *
         * @param {Services4otmPlaceProvider} services4otmPlaceProvider
         */
        init: function(services4otmPlaceProvider) {
            var self = this;
            this._map = /** @type {Map} */ Widget.findById('map');

            // Create a transparent marker icon
            this._transparentMarkerIcon = new UrlMarkerIcon({
                anchor: new Point(8,8),
                size: new Dimension(16, 16),
                url: webview.baseUrl + 'extensions/services4otm-publictransport/image/transparent_marker_icon.png'
            });

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

            // Handle marker click
            this._map.onMarkerClick(function handleWaypointMarkerClick(marker) {
                var waypoint = self._waypointByMarkerId[marker.id];
                if (waypoint) {
                    self._map.showInfoWindow(marker, waypoint.stopName, {x: 0, y: 0});
                }
            });

            // TODO
            //this._map.onMarkerMouseEnter(function(marker) {
            //    console.log('mouse enter: ' + marker.title);
            //});
            //this._map.onMarkerMouseLeave(function(marker) {
            //    console.log('mouse leave: ' + marker.title);
            //});
            this._map.onInfoWindowClick(function(marker) {
                var waypoint = self._waypointByMarkerId[marker.id];
                if (waypoint) {
                    placeSelectionMenu.open(new Place({
                        latitude: waypoint.latitude,
                        longitude: waypoint.longitude,
                        name: waypoint.stopName,
                        accuracy: 1,
                        placeProvider: services4otmPlaceProvider,
                        additionalParameters: {
                            waypointId: waypoint.id
                        }
                    }));
                    self._map.closeInfoWindow();
                }
            });
        },

        /**
         * Load waypoints in the given tiles.
         *
         * @param {Array.<{zoom: Number, x: Number, y: number}>} tileCoordinates
         */
        loadWaypoints: function(tileCoordinates) {
            var self = this;

            if (!tileCoordinates || !tileCoordinates.length) {
                return;
            }

            var zoom = tileCoordinates[0].zoom;

            var tileIds = _.map(tileCoordinates, function(tileCoordinate) {
                return tileCoordinate.zoom + '_' + tileCoordinate.x + '_' + tileCoordinate.y;
            });
            datastoreService.findStopsWithDrawingDataByTileIds(tileIds, function(error, stopsWithDrawingData) {
                // Create one transparent marker
                var markers = /** @type {Array.<Marker>} */ _.map(stopsWithDrawingData, function(stopWithDrawingData) {
                    var waypoint = stopWithDrawingData.waypoint;
                    var drawingInfo = stopWithDrawingData.drawingInfo;
                    //var waypointIcon = waypointMarkerIconBuilder.buildIcon(waypoint, drawingInfo);
                    setTimeout(function() {
                        waypointMarkerIconBuilder.renderWaypoint(waypoint, drawingInfo, self._map);
                    }, 5000);
                    var marker = new Marker({
                        position: new LatLng(waypoint.latitude, waypoint.longitude),
                        title: waypoint.stopName,
                        icon: self._transparentMarkerIcon
                    });
                    self._waypointByMarkerId[marker.id] = waypoint;
                    return marker;
                });

                // Save the marker locally
                _.each(markers, function(marker) {
                    self._addToMarkersByTileId(marker, zoom);
                });

                self._map.addMarkers(markers);
            });
        },

        /**
         * Release the waypoints from the given tiles.
         *
         * @param {Array.<{zoom: Number, x: Number, y: number}>} tileCoordinates
         */
        releaseWaypoints: function(tileCoordinates) {
            var self = this;

            // Remove the markers from the tiles
            _.each(tileCoordinates, function(tileCoordinate) {
                var tileId = tileCoordinate.zoom + '_' + tileCoordinate.x + '_' + tileCoordinate.y;
                var storedMarkers = self._markersByTileId[tileId];
                if (storedMarkers) {
                    self._map.removeMarkers(storedMarkers);
                }
            });
        },

        /**
         * Add a marker to _markersByTileId.
         *
         * @param {Marker} marker
         * @param {Number} zoom
         * @private
         */
        _addToMarkersByTileId: function(marker, zoom) {
            var tileX = Math.floor(projectionUtils.lngToTileX(zoom, marker.position.lng));
            var tileY = Math.floor(projectionUtils.latToTileY(zoom, marker.position.lat));
            var tileId = zoom + '_' + tileX + '_' + tileY;

            var storedMarkers = this._markersByTileId[tileId];
            if (!storedMarkers) {
                storedMarkers = [];
                this._markersByTileId[tileId] = storedMarkers;
            }
            storedMarkers.push(marker);
        }
    };

    return mapOverlayController;
});
