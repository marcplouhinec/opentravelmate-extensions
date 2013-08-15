/**
 * Services For Open Travel Mate - Public transport information provider - entry point.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'core/widget/Widget',
    'core/widget/map/Map',
    'core/widget/map/TileOverlay'
], function(Widget, Map, TileOverlay) {
    'use strict';

    /**
     * Extension entry point.
     */
    return function main() {
        var map = /** @type {Map} */ Widget.findById('map');

        var tileOverlay = new TileOverlay({
            'zIndex': 0,
            'tileUrlPattern': 'http://www.services4otm.com/mapoverlay/publictransport/${zoom}_${x}_${y}.png'
        });
        map.addTileOverlay(tileOverlay);
    };
});
