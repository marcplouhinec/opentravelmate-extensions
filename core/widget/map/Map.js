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
     * Move the map center to the given location.
     *
     * @param {LatLng} center
     */
    Map.prototype.panTo = function(center) {
        nativeMap.panTo(this.id, JSON.stringify(center));
    };

    /**
     * Add a marker on the map.
     *
     * @param {Marker} marker
     */
    Map.prototype.addMarker = function(marker) {
        nativeMap.addMarker(this.id, JSON.stringify(marker));
    };

    /**
     * Remove a marker from the map.
     *
     * @param {Marker} marker
     */
    Map.prototype.removeMarker = function(marker) {
        nativeMap.removeMarker(this.id, JSON.stringify(marker));
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
        var tileCoordinates = nativeMap.getDisplayedTileCoordinates(this.id);
        listener(tileCoordinates);
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
