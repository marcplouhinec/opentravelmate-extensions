/**
 * Handle the map overlay.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    '../core/widget/Widget',
    '../core/widget/map/Map',
    '../core/widget/map/TileOverlay'
], function(Widget, Map, TileOverlay) {
    'use strict';

    var mapOverlayController = {

        /**
         * Initialize the controller.
         */
        init: function() {
            var self = this;
            var map = /** @type {Map} */ Widget.findById('map');

            // Create an overlay that displays public transport
            var tileOverlay = new TileOverlay({
                'zIndex': 0,
                'tileUrlPattern': 'http://www.services4otm.com/mapoverlay/publictransport/tile/${zoom}_${x}_${y}.png'
            });
            map.addTileOverlay(tileOverlay);

            // Load the markers
            map.onTilesDisplayed(function handleTilesDisplayed(tileCoordinates) {
                self.loadWaypoints(tileCoordinates);
            });
            map.onTilesReleased(function handleTilesReleased(tileCoordinates) {
                self.releaseWaypoints(tileCoordinates);
            });
        },

        /**
         * Load waypoints in the given tiles.
         *
         * @param {Array.<TileOverlay>} tileCoordinates
         */
        loadWaypoints: function(tileCoordinates) {
            // TODO
        },

        /**
         * Release the waypoints from the given tiles.
         *
         * @param {Array.<TileOverlay>} tileCoordinates
         */
        releaseWaypoints: function(tileCoordinates) {
            // TODO
        }
    };

    return mapOverlayController;
});
