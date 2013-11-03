/**
 * Handle the Show/Hide satellite button.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define(['../core/widget/map/MapButton'], function(MapButton) {
    'use strict';

    /**
     * @constant
     * @type {string}
     */
    var TOOLTIP_ROADMAP_MODE = 'Show satellite map';

    /**
     * @constant
     * @type {string}
     */
    var ICON_URL_ROADMAP_MODE = 'extensions/map-tools/image/ic_btn_satellite_map_mode.png';

    /**
     * @constant
     * @type {string}
     */
    var TOOLTIP_SATELLITE_MODE = 'Show road map';

    /**
     * @constant
     * @type {string}
     */
    var ICON_URL_SATELLITE_MODE = 'extensions/map-tools/image/ic_btn_roads_map_mode.png';

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
         * @private
         * @type {MapButton}
         */
        '_mapButton': null,

        /**
         * Create a new Show/Hide satellite button.
         *
         * @param {Map} map
         */
        'createButton': function(map) {
            var self = this;
            this._map = map;

            this._mapButton = new MapButton({
                tooltip: TOOLTIP_ROADMAP_MODE,
                iconUrl: ICON_URL_ROADMAP_MODE
            });
            map.addMapButton(this._mapButton);

            this._mapButton.onClick(function() {
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
            this._map.setMapType('HYBRID');
            this._currentMapMode = 'HYBRID';

            this._mapButton.tooltip = TOOLTIP_SATELLITE_MODE;
            this._mapButton.iconUrl = ICON_URL_SATELLITE_MODE;
            this._map.updateMapButton(this._mapButton);
        },

        /**
         * Set the map mode to 'road'.
         */
        '_switchToRoadMapMode': function() {
            this._map.setMapType('ROADMAP');
            this._currentMapMode = 'ROADMAP';

            this._mapButton.tooltip = TOOLTIP_ROADMAP_MODE;
            this._mapButton.iconUrl = ICON_URL_ROADMAP_MODE;
            this._map.updateMapButton(this._mapButton);
        }
    };

    return satelliteButtonHandler;
});
