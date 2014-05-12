/**
 * Handle the map overlay.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'underscore',
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
    '../core/widget/map/Polyline',
    '../place-commons/Place',
    '../place-information/placeSelectionMenu',
    './datastore/datastoreService',
    './datastore/Waypoint',
    './waypointPolygonBuilder'
], function(
    _, Widget, webview, Map, TileOverlay, LatLng, Point, Dimension, Marker, UrlMarkerIcon,
    projectionUtils, Polyline, Place, placeSelectionMenu, datastoreService, Waypoint, waypointPolygonBuilder) {
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
    var ITINERARY_POLYLINE_WEIGHT = 8;

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
         * @type {Object.<String, {waypoint: Waypoint, zoom: Number}>}
         * @private
         */
        '_waypointAndZoomByWaypointId': {},

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
         * @type {Array.<Polyline>}
         */
        '_itineraryPolylines': [],

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
                var waypointAndZoom = self._waypointAndZoomByWaypointId[waypoint.id];
                if (waypointAndZoom) {
                    self._highlightedWaypointPolygon = waypointPolygonBuilder.buildPolygon(waypointAndZoom.waypoint, waypointAndZoom.zoom);
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
                    self._waypointAndZoomByWaypointId[waypoint.id] = {
                        waypoint: waypoint,
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
                        if (self._waypointAndZoomByWaypointId[marker.id])
                            delete self._waypointAndZoomByWaypointId[marker.id];
                    });
                }
            });

            // Update the itinerary polygons
            self._updateItineraryPolygons(removedWaypointIdSet);
        },

        /**
         * Show the given itinerary on the map.
         *
         * @param {Itinerary} itinerary
         */
        'showItinerary': function(itinerary) {
            var self = this;

            // Show the itinerary paths
            this._itineraryPolylines = [];
            var lastPlace = null;
            _.each(itinerary.steps, function(step) {
                if (step.type === 'Place') {
                    lastPlace = step;
                    if (self._itineraryPolylines.length > 0) {
                        var lastPolyline = self._itineraryPolylines[self._itineraryPolylines.length - 1];
                        lastPolyline.path.push(new LatLng(step.latitude, step.longitude));
                    }
                } else if (step.type === 'Path') {
                    var pathLatLng = [new LatLng(lastPlace.latitude, lastPlace.longitude)].concat(step.waypoints);
                    self._itineraryPolylines.push(new Polyline({
                        path: pathLatLng,
                        color: 0xFF000000 + parseInt(step.color, 16),
                        width: ITINERARY_POLYLINE_WEIGHT
                    }));
                }
            });
            this._map.addPolylines(this._itineraryPolylines);

            // Show the itinerary stops
            this._itineraryWaypointIdSet = {};
            _.each(itinerary.steps, function(step) {
                if (step.type === 'Place' && step.additionalParameters['waypointId']) {
                    var waypointId = step.additionalParameters['waypointId'];
                    self._itineraryWaypointIdSet[waypointId] = true;
                }
            });
            this._updateItineraryPolygons();
        },

        /**
         * Clear the currently displayed itinerary.
         */
        'clearItinerary': function() {
            this._itineraryWaypointIdSet = {};
            this._updateItineraryPolygons();
            this._map.removePolylines(this._itineraryPolylines);
            this._itineraryPolylines = [];
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
                    var waypointAndZoom = self._waypointAndZoomByWaypointId[waypointId];

                    if (waypointAndZoom) {
                        var polygon = waypointPolygonBuilder.buildPolygon(
                            waypointAndZoom.waypoint,
                            waypointAndZoom.zoom,
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
