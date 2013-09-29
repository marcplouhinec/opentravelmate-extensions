/**
 * Handle the Show/Hide satellite button.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define(['../core/widget/map/MapButton'], function(MapButton) {
    'use strict';

    var satelliteButtonHandler = {
        /**
         * @type {String}
         * @private
         */
        '_currentMapMode': 'ROADMAP',

        /**
         * @private
         */
        '_map': null,

        /**
         * Create a new Show/Hide satellite button.
         *
         * @param {Map} map
         */
        'createButton': function(map) {
            var self = this;
            this._map = map;

            var mapButton = new MapButton({
                tooltip: 'Show satellite map',
                iconUrl: 'extensions/map-tools/image/ic_btn_satellite_map_mode.png'
            });
            map.addMapButton(mapButton);

            mapButton.onClick(function() {
                if (self._currentMapMode === 'ROADMAP') {
                    self._switchToSatelliteMapMode();
                } else {
                    self._switchToRoadMapMode();
                }
            });
        },

        /**
         * Set the map mode to 'satellite'.
         */
        '_switchToSatelliteMapMode': function() {
            this._map.setMapType('SATELLITE');
            this._currentMapMode = 'SATELLITE';
        },

        /**
         * Set the map mode to 'road'.
         */
        '_switchToRoadMapMode': function() {
            this._map.setMapType('ROADMAP');
            this._currentMapMode = 'ROADMAP';
        }
    };

    return satelliteButtonHandler;
});
