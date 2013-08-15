/**
 * Define an overlay that will be displayed on top of the map.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define(function() {
    'use strict';

    /**
     * Counter used to generate unique IDs.
     *
     * @type {Number}
     */
    var nextTileOverlayId = 0;

    /**
     * Create a new TileOverlay.
     *
     * @param {{
     *     zIndex: Number=,
     *     isVisible: Boolean=,
     *     tileProvider: function(x: Number, y: Number, zoom: Number): String
     * }} options
     * @constructor
     */
    function TileOverlay(options) {
        /** @type {number} */
        this.id = nextTileOverlayId++;

        /** @type {Number=} */
        this.zIndex = options.zIndex || 0;
        /** @type {Boolean=} */
        this.isVisible = options.isVisible || true;
        /** @type {function(x: Number, y: Number, zoom: Number): String} */
        this.tileProvider = options.tileProvider;
    }

    return TileOverlay;
});
