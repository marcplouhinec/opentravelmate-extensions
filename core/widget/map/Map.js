/**
 * Define the Map widget.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'core/widget/Widget',
    'core/widget/LayoutParams',
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

        /**
         * Registered tile overlays.
         *
         * @type {Object.<Number, TileOverlay>}
         * @private
         */
        this._tileOverlayById = {};
    }

    Map.prototype = new Widget();
    Map.prototype.constructor = Map;

    /**
     * Add an overlay to the map.
     *
     * @param {TileOverlay} tileOverlay
     */
    Map.prototype.addTileOverlay = function(tileOverlay) {
        this._tileOverlayById[tileOverlay.id] = tileOverlay;
        nativeMap.addTileOverlay(this.id, JSON.stringify(tileOverlay));
    };

    /**
     * Get an overlay by its ID.
     *
     * @param {Number} id
     * @return {TileOverlay}
     */
    Map.prototype.getTileOverlayById = function(id) {
        return this._tileOverlayById[id];
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
