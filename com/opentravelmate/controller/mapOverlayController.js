/**
 * Handle the map overlay.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    '../../../org/opentravelmate/controller/widget/Widget',
    '../../../org/opentravelmate/controller/widget/map/TileOverlay',
    '../../../org/opentravelmate/controller/widget/map/Map'
], function(Widget, TileOverlay, Map) {
    'use strict';

    /**
     * Handle the map overlay.
     */
    var mapOverlayController = {

        /**
         * @type {Map}
         * @private
         */
        '_map': null,

        /**
         * @type {TileOverlay}
         * @private
         */
        '_tileOverlay': null,

        /**
         * Initialize the controller.
         */
        'init': function() {
            var self = this;

            Widget.findByIdAsync('map', 10000, function(/** @type {Map} */map) {
                self._map = map;

                // Add the public transport overlay
                self._tileOverlay = new TileOverlay({
                    'zIndex': 0,
                    'tileUrlPattern': 'http://www.opentravelmate.io/tile/${zoom}_${x}_${y}.png'
                });
                self._map.addTileOverlay(self._tileOverlay);

                // Load the markers
                self._map.onTilesDisplayed(function handleTilesDisplayed(tileCoordinates) {
                    self._loadStopsInTiles(tileCoordinates);
                });
                self._map.onTilesReleased(function handleTilesReleased(tileCoordinates) {
                    self._removeStopsFromTiles(tileCoordinates);
                });
            });
        },

        /**
         * Load stops in the given tiles.
         *
         * @param {Array.<{zoom: Number, x: Number, y: number}>} tileCoordinates
         */
        '_loadStopsInTiles': function(tileCoordinates) {
            // TODO show a loading map button
            // TODO
        },

        /**
         * Release the stops from the given tiles.
         *
         * @param {Array.<{zoom: Number, x: Number, y: number}>} tileCoordinates
         */
        '_removeStopsFromTiles': function(tileCoordinates) {
            // TODO
        }

    };

    return mapOverlayController;
});
