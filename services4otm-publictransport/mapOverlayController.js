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
    './datastore/Waypoint'
], function(
    _, Widget, webview, Map, TileOverlay, LatLng, Point, Dimension, Marker, UrlMarkerIcon,
    projectionUtils, Polyline, Place, placeSelectionMenu, datastoreService, Waypoint) {
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
         * @type {UrlMarkerIcon}
         * @private
         */
        '_greenMarkerIcon': undefined,

        /**
         * @type {TileOverlay}
         * @private
         */
        '_tileOverlay': undefined,

        /**
         * @type {TileOverlay}
         * @private
         */
        '_grayTileOverlay': undefined,

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
         * Marker displayed on top of a waypoint when the user put his mouse close to it.
         * @private
         */
        '_highlightedWaypointMarker': null,

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
         * @type {Array.<Marker>}
         */
        '_itineraryWaypointMarkers': [],

        /**
         * Initialize the controller.
         *
         * @param {Services4otmPlaceProvider} services4otmPlaceProvider
         */
        init: function(services4otmPlaceProvider) {
            var self = this;
            this._map = /** @type {Map} */ Widget.findById('map');

            // Create a marker icons
            this._transparentMarkerIcon = new UrlMarkerIcon({
                anchor: new Point(8,8),
                size: new Dimension(16, 16),
                url: webview.baseUrl + 'extensions/services4otm-publictransport/image/transparent_marker_icon.png'
            });
            this._blueMarkerIcon = new UrlMarkerIcon({
                anchor: new Point(8,8),
                size: new Dimension(16, 16),
                url: webview.baseUrl + 'extensions/services4otm-publictransport/image/blue_marker_icon.png'
            });
            this._greenMarkerIcon = new UrlMarkerIcon({
                anchor: new Point(8,8),
                size: new Dimension(16, 16),
                url: webview.baseUrl + 'extensions/services4otm-publictransport/image/green_marker_icon.png'
            });

            // Create an overlay that displays public transport
            this._tileOverlay = new TileOverlay({
                'zIndex': 0,
                'tileUrlPattern': 'http://www.services4otm.com/mapoverlay/publictransport/tile/${zoom}_${x}_${y}.png'
            });
            this._grayTileOverlay = new TileOverlay({
                'zIndex': 1,
                'tileUrlPattern': 'http://www.services4otm.com/mapoverlay/publictransport/tile/${zoom}_${x}_${y}.png',
                'enableGrayscaleFilter': true
            });
            this._map.addTileOverlay(this._tileOverlay);

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

                // Show a visible marker
                self._highlightedWaypointMarker = new Marker({
                    position: new LatLng(waypoint.latitude, waypoint.longitude),
                    title: waypoint.stopName,
                    icon: self._blueMarkerIcon
                });
                self._map.addMarkers([self._highlightedWaypointMarker]);
            });
            this._map.onMarkerMouseLeave(function(marker) {
                // If present, hide the highlighted marker
                if (self._highlightedWaypointMarker) {
                    self._map.removeMarkers([self._highlightedWaypointMarker]);
                    delete self._highlightedWaypointMarker;
                }
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
                    return marker;
                });

                // Save the marker locally
                _.each(markers, function(marker) {
                    self._addToMarkersByTileId(marker, zoom);
                });

                // Show the markers on the map
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
                    });
                }
            });
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
            this._itineraryWaypointMarkers = _.chain(itinerary.steps)
                .filter(function (step) { return step.type === 'Place'; })
                .map(function (/** @type {Place} */ place) {
                    return new Marker({
                        position: new LatLng(place.latitude, place.longitude),
                        title: place.name,
                        icon: self._greenMarkerIcon
                    });
                })
                .value();
            this._map.addMarkers(this._itineraryWaypointMarkers);

            // Show the gray tile overlay
            this._map.addTileOverlay(this._grayTileOverlay);
        },

        /**
         * Clear the currently displayed itinerary.
         */
        'clearItinerary': function() {
            // Remove the itinerary stops
            this._map.removeMarkers(this._itineraryWaypointMarkers);
            delete this._itineraryWaypointMarkers;

            // Remove the itinerary lines
            this._map.removePolylines(this._itineraryPolylines);
            this._itineraryPolylines = [];

            // Hide the gray tile overlay
            this._map.removeTileOverlay(this._grayTileOverlay);
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
