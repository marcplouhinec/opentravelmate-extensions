/**
 * Define the Map widget.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    '../../widget/Widget',
    '../../widget/LayoutParams',
    './LatLng',
    './Marker',
    './TileOverlay',
    'nativeMap'
], function(Widget, LayoutParams, LatLng, Marker, TileOverlay, nativeMap) {
    'use strict';

    /**
     * Create a Map.
     *
     * @param {{id: String}} options
     * @constructor
     * @extends Widget
     */
    function Map(options) {
        Widget.call(this, options);

        this._tileListeners = {
            /**
             * @type {Array.<function(tileCoordinates: Array.<{zoom: Number, x: Number, y: Number}>)>}
             */
            'TILES_DISPLAYED': [],
            /**
             * @type {Array.<function(tileCoordinates: Array.<{zoom: Number, x: Number, y: Number}>)>}
             */
            'TILES_RELEASED': []
        };

        this._markerListeners = {
            /**
             * @type {Array.<function(marker: Marker)>}
             */
            'CLICK': [],
            /**
             * @type {Array.<function(marker: Marker)>}
             */
            'MOUSE_ENTER': [],
            /**
             * @type {Array.<function(marker: Marker)>}
             */
            'MOUSE_LEAVE': []
        };

        /**
         * @type {Array.<function(marker: Marker)>}
         * @private
         */
        this._infoWindowClickListeners = [];

        /**
         * @type {Array.<MapButton>}
         * @private
         */
        this._mapButtonById = [];
    }

    Map.prototype = new Widget();
    Map.prototype.constructor = Map;

    /**
     * Add an overlay to the map.
     *
     * @param {TileOverlay} tileOverlay
     */
    Map.prototype.addTileOverlay = function(tileOverlay) {
        nativeMap.addTileOverlay(this.id, JSON.stringify(tileOverlay));
    };

    /**
     * Remove an overlay from the map.
     *
     * @param {TileOverlay} tileOverlay
     */
    Map.prototype.removeTileOverlay = function(tileOverlay) {
        nativeMap.removeTileOverlay(this.id, JSON.stringify(tileOverlay));
    };

    /**
     * Move the map center to the given location.
     *
     * @param {LatLng} center
     */
    Map.prototype.panTo = function(center) {
        nativeMap.panTo(this.id, JSON.stringify(center));
    };

    /**
     * Get the map bounds (South-West and North-East points).
     *
     * @return {{sw: LatLng, ne: LatLng}} center
     */
    Map.prototype.getBounds = function(center) {
        var bounds = JSON.parse(nativeMap.getBounds(this.id));
        return {
            sw: new LatLng(bounds.sw.lat, bounds.sw.lng),
            ne: new LatLng(bounds.ne.lat, bounds.ne.lng)
        };
    };

    /**
     * Add markers on the map.
     *
     * @param {Array.<Marker>} markers
     */
    Map.prototype.addMarkers = function(markers) {
        nativeMap.addMarkers(this.id, JSON.stringify(markers));
    };

    /**
     * Remove markers from the map.
     *
     * @param {Array.<Marker>} markers
     */
    Map.prototype.removeMarkers = function(markers) {
        nativeMap.removeMarkers(this.id, JSON.stringify(markers));
    };

    /**
     * Add a button on the map top-right corner.
     *
     * @param {MapButton} mapButton
     */
    Map.prototype.addMapButton = function(mapButton) {
        this._mapButtonById[mapButton.id] = mapButton;
        nativeMap.addMapButton(this.id, JSON.stringify(mapButton));
    };

    /**
     * Update a button on the map.
     *
     * @param {MapButton} mapButton
     */
    Map.prototype.updateMapButton = function(mapButton) {
        if (!this._mapButtonById[mapButton.id]) {
            this.addMapButton(mapButton);
            return;
        }

        nativeMap.updateMapButton(this.id, JSON.stringify(mapButton));
    };

    /**
     * Fire the click event on the given map button.
     *
     * @param {Number} mapButtonId
     */
    Map.prototype.fireMapButtonClickEvent = function(mapButtonId) {
        this._mapButtonById[mapButtonId].fireClickEvent();
    };

    /**
     * Register a listener for the TILES_DISPLAYED event.
     *
     * @param {function(tileCoordinates: Array.<{zoom: Number, x: Number, y: Number}>)} listener
     */
    Map.prototype.onTilesDisplayed = function(listener) {
        this._tileListeners.TILES_DISPLAYED.push(listener);
        nativeMap.observeTiles(this.id);

        // Call the listener with all the visible tile coordinates
        var jsonTileCoordinates = nativeMap.getDisplayedTileCoordinates(this.id);
        listener(JSON.parse(jsonTileCoordinates));
    };

    /**
     * Register a listener for the TILES_RELEASED event.
     *
     * @param {function(tileCoordinates: Array.<{zoom: Number, x: Number, y: Number}>)} listener
     */
    Map.prototype.onTilesReleased = function(listener) {
        this._tileListeners.TILES_RELEASED.push(listener);
        nativeMap.observeTiles(this.id);
    };

    /**
     * Fire a tile event to the listeners.
     * Note: this function should be called by the nativeMap.
     *
     * @param {String} eventType
     *     TILES_DISPLAYED or TILES_RELEASED.
     * @param {Array.<{zoom: Number, x: Number, y: Number}>} tileCoordinates
     *     Related tiles.
     */
    Map.prototype.fireTileEvent = function(eventType, tileCoordinates) {
        _.each(this._tileListeners[eventType], function(listener) {
            listener(tileCoordinates);
        });
    };

    /**
     * Register a listener for the CLICK event on the markers.
     *
     * @param {function(marker: Marker)} listener
     */
    Map.prototype.onMarkerClick = function(listener) {
        this._markerListeners.CLICK.push(listener);
        nativeMap.observeMarkers(this.id);
    };

    /**
     * Register a listener for the MOUSE_ENTER event on the markers.
     *
     * @param {function(marker: Marker)} listener
     */
    Map.prototype.onMarkerMouseEnter = function(listener) {
        this._markerListeners.MOUSE_ENTER.push(listener);
        nativeMap.observeMarkers(this.id);
    };

    /**
     * Register a listener for the MOUSE_LEAVE event on the markers.
     *
     * @param {function(marker: Marker)} listener
     */
    Map.prototype.onMarkerMouseLeave = function(listener) {
        this._markerListeners.MOUSE_LEAVE.push(listener);
        nativeMap.observeMarkers(this.id);
    };

    /**
     * Fire a marker event to the listeners.
     * Note: this function should be called by the nativeMap.
     *
     * @param {String} eventType
     *     CLICK, MOUSE_ENTER or MOUSE_LEAVE.
     * @param {Marker} marker
     *     Related marker.
     */
    Map.prototype.fireMarkerEvent = function(eventType, marker) {
        _.each(this._markerListeners[eventType], function(listener) {
            listener(marker);
        });
    };

    /**
     * Show an Info Window on top of the given marker with the given text.
     *
     * @param {Marker} marker
     *     Info Window anchor.
     * @param {String} content
     *     Text displayed in the Info Window.
     * @param {{x: Number, y: Number}} anchor=
     *     Position of the the InfoWindow-base compared to the marker position.
     *     Examples:
     *       - (0,0) is the marker position.
     *       - (0,1) is on the under of the marker position.
     *       - (-1,0) is on the left of the marker position.
     */
    Map.prototype.showInfoWindow = function(marker, content, anchor) {
        nativeMap.showInfoWindow(this.id, JSON.stringify(marker), content, JSON.stringify(anchor ? anchor : null));
    };

    /**
     * Close the Info Window if any.
     */
    Map.prototype.closeInfoWindow = function() {
        nativeMap.closeInfoWindow(this.id);
    };

    /**
     * Register a listener for the CLICK event on the info window.
     *
     * @param {function(marker: Marker)} listener
     */
    Map.prototype.onInfoWindowClick = function(listener) {
        this._infoWindowClickListeners.push(listener);
    };

    /**
     * Fire a InfoWindow CLICK event to the listeners.
     * Note: this function should be called by the nativeMap.
     *
     * @param {Marker} marker
     *     Related marker.
     */
    Map.prototype.fireInfoWindowClickEvent = function(marker) {
        _.each(this._infoWindowClickListeners, function(listener) {
            listener(marker);
        });
    };

    /**
     * Set the map type.
     *
     * @param {String} mapType
     *     'ROADMAP' or 'SATELLITE'.
     */
    Map.prototype.setMapType = function(mapType) {
        nativeMap.setMapType(this.id, mapType);
    };

    /**
     * Add the given polyline on the map.
     *
     * @param {Array.<Polyline>} polylines
     */
    Map.prototype.addPolylines = function(polylines) {
        nativeMap.addPolylines(this.id, JSON.stringify(polylines));
    };

    /**
     * Remove the given polyline from the map.
     *
     * @param {Array.<Polyline>} polylines
     */
    Map.prototype.removePolylines = function(polylines) {
        nativeMap.removePolylines(this.id, JSON.stringify(polylines));
    };

    /**
     * Add the given polygons on the map.
     *
     * @param {Array.<Polygon>} polygons
     */
    Map.prototype.addPolygons = function(polygons) {
        nativeMap.addPolygons(this.id, JSON.stringify(polygons));
    };

    /**
     * Remove the given polygons from the map.
     *
     * @param {Array.<Polygon>} polygons
     */
    Map.prototype.removePolygons = function(polygons) {
        nativeMap.removePolygons(this.id, JSON.stringify(polygons));
    };

    /**
     * Build the native view object for the current widget.
     * 
     * @param {LayoutParams} layoutParams
     */
    Map.prototype.buildView = function(layoutParams) {
        nativeMap.buildView(JSON.stringify(layoutParams));
    };

    /**
     * Update the native view object for the current widget.
     *
     * @param {LayoutParams} layoutParams
     */
    Map.prototype.updateView = function(layoutParams) {
        nativeMap.updateView(JSON.stringify(layoutParams));
    };

    /**
     * Remove the native view object for the current widget.
     */
    Map.prototype.removeView = function() {
        nativeMap.removeView(this.id);
    };

    return Map;
});
