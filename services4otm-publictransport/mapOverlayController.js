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
    './waypointPolygonBuilder'
], function(
    Widget, webview, Map, TileOverlay, LatLng, Point, Dimension, Marker, UrlMarkerIcon,
    projectionUtils, Place, placeSelectionMenu, datastoreService, Waypoint, waypointPolygonBuilder) {
    'use strict';

    /**
     * @constant
     * @type {Number}
     */
    var ITINERARY_POLYGON_FILL_COLOR = 0xFF70c000;

    /**
     * @constant
     * @type {Number}
     */
    var ITINERARY_POLYGON_SCALE = 1.2;


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
         * @type {Object.<String, {drawingInfo: WaypointDrawingInfo, zoom: Number}>}
         * @private
         */
        '_drawingInfoAndZoomByWaypointId': {},

        /**
         * Polygon displayed on top of a waypoint when the user put his mouse close to the marker.
         * @private
         */
        '_highlightedWaypointPolygon': null,

        /**
         * @private
         * @type {Object.<String, Boolean>} Object.<Waypoint ID on itinerary, true>
         */
        '_itineraryWaypointIdSet': {},

        /**
         * @private
         * @type {Object.<String, Polygon>}
         */
        '_itineraryPolygonByWaypointId': {},

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

            this._map.onMarkerMouseEnter(function(marker) {
                var waypoint = self._waypointByMarkerId[marker.id];
                if (!waypoint) {
                    return;
                }
                var drawingInfoAndZoom = self._drawingInfoAndZoomByWaypointId[waypoint.id];
                if (drawingInfoAndZoom) {
                    self._highlightedWaypointPolygon = waypointPolygonBuilder.buildPolygon(drawingInfoAndZoom.drawingInfo, drawingInfoAndZoom.zoom);
                    self._map.addPolygons([self._highlightedWaypointPolygon]);
                }
            });
            this._map.onMarkerMouseLeave(function(marker) {
                if (self._highlightedWaypointPolygon) {
                    self._map.removePolygons([self._highlightedWaypointPolygon]);
                    delete self._highlightedWaypointPolygon;
                };
            });
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
                    var marker = new Marker({
                        position: new LatLng(waypoint.latitude, waypoint.longitude),
                        title: waypoint.stopName,
                        icon: self._transparentMarkerIcon
                    });
                    self._waypointByMarkerId[marker.id] = waypoint;
                    self._drawingInfoAndZoomByWaypointId[waypoint.id] = {
                        drawingInfo: stopWithDrawingData.drawingInfo,
                        zoom: zoom
                    };
                    return marker;
                });

                // Save the marker locally
                _.each(markers, function(marker) {
                    self._addToMarkersByTileId(marker, zoom);
                });

                // Show the markers on the map
                self._map.addMarkers(markers);

                // Update the itinerary polygons
                self._updateItineraryPolygons();
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
            var removedWaypointIdSet = /** @type {Object.<String, Boolean>} */ {};
            _.each(tileCoordinates, function(tileCoordinate) {
                var tileId = tileCoordinate.zoom + '_' + tileCoordinate.x + '_' + tileCoordinate.y;
                var storedMarkers = self._markersByTileId[tileId];
                if (storedMarkers) {
                    self._map.removeMarkers(storedMarkers);

                    _.each(storedMarkers, function(marker) {
                        var waypoint = self._waypointByMarkerId[marker.id];
                        if (waypoint) {
                            removedWaypointIdSet[waypoint.id] = true;
                            delete self._waypointByMarkerId[marker.id];
                        }
                        if (self._drawingInfoAndZoomByWaypointId[marker.id])
                            delete self._drawingInfoAndZoomByWaypointId[marker.id];
                    });
                }
            });

            // Update the itinerary polygons
            self._updateItineraryPolygons(removedWaypointIdSet);
        },

        /**
         * Highlight the markers related to the given waypoints.
         *
         * @param {Array.<String>} waypointIds
         */
        'highlightItinerary': function(waypointIds) {
            this._itineraryWaypointIdSet = {};
            for (var i = 0; i < waypointIds.length; i++) {
                this._itineraryWaypointIdSet[waypointIds[i]] = true;
            }

            this._updateItineraryPolygons();
        },

        /**
         * Clear the currently displayed itinerary.
         */
        'clearItinerary': function() {
            this._itineraryWaypointIdSet = {};
            this._updateItineraryPolygons();
        },

        /**
         * Add or remove itinerary polygons automatically.
         *
         * @param {Object.<String, Boolean>=} removedWaypointIdSet If set, force the polygons related to the given waypoints to be removed.
         */
        '_updateItineraryPolygons': function(removedWaypointIdSet) {
            var self = this;

            // Find the polygons to remove
            var polygonsToRemove = [];
            _.each(this._itineraryPolygonByWaypointId, function(polygon, waypointId) {
                if (!self._itineraryWaypointIdSet[waypointId] || (removedWaypointIdSet && removedWaypointIdSet[waypointId])) {
                    polygonsToRemove.push(polygon);
                    delete self._itineraryPolygonByWaypointId[waypointId];
                }
            });
            this._map.removePolygons(polygonsToRemove);

            // Find the new polygons to add
            var newPolygons = /** @type {Array.<Polygon>} */ [];
            _.each(this._itineraryWaypointIdSet, function(alwaysTrue, waypointId) {
                if (!self._itineraryPolygonByWaypointId[waypointId] && (!removedWaypointIdSet || !removedWaypointIdSet[waypointId])) {
                    var drawingInfoAndZoom = self._drawingInfoAndZoomByWaypointId[waypointId];

                    if (drawingInfoAndZoom) {
                        var polygon = waypointPolygonBuilder.buildPolygon(
                            drawingInfoAndZoom.drawingInfo,
                            drawingInfoAndZoom.zoom,
                            ITINERARY_POLYGON_SCALE,
                            ITINERARY_POLYGON_FILL_COLOR);
                        newPolygons.push(polygon);
                        self._itineraryPolygonByWaypointId[waypointId] = polygon;
                    }
                }
            });
            this._map.addPolygons(newPolygons);
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
