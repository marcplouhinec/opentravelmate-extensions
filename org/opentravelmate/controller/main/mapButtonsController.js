/**
 * Controller for the map buttons.
 *
 * @author Marc Plouhinec
 */

define([
    'jquery',
    'lodash',
    '../widget/Widget',
    '../widget/map/MapButton',
    '../widget/map/Map'
], function($, _, Widget, MapButton, Map) {
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
    var ICON_URL_ROADMAP_MODE = 'extensions/org/opentravelmate/view/map/image/ic_btn_satellite_map_mode.png';

    /**
     * @constant
     * @type {string}
     */
    var TOOLTIP_SATELLITE_MODE = 'Show road map';

    /**
     * @constant
     * @type {string}
     */
    var ICON_URL_SATELLITE_MODE = 'extensions/org/opentravelmate/view/map/image/ic_btn_roads_map_mode.png';

    /**
     * @constant
     * @type {string}
     */
    var TOOLTIP_CURRENT_POSITION = 'Show my position on the map';

    /**
     * @constant
     * @type {string}
     */
    var ICON_URL_CURRENT_POSITION = 'extensions/org/opentravelmate/view/map/image/ic_btn_show_my_position.png';

    /**
     * Controller for the map buttons.
     */
    var mapButtonsController = {

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
        '_satelliteMapButton': null,

        /**
         * @private
         * @type {MapButton}
         */
        '_currentPositionMapButton': null,

        /**
         * Initialization.
         */
        'init': function () {
            var self = this;

            // Add the map buttons when the map is completely initialized
            Widget.findByIdAsync('map', 10000, function(/** @type {Map} */map) {
                self._map = map;

                // Initialize the satellite button
                self._satelliteMapButton = new MapButton({
                    tooltip: TOOLTIP_ROADMAP_MODE,
                    iconUrl: ICON_URL_ROADMAP_MODE
                });
                map.addMapButton(self._satelliteMapButton);
                self._satelliteMapButton.onClick(function handleSatelliteMapButtonClick() {
                    if (self._currentMapMode === 'ROADMAP') {
                        self._switchToSatelliteMapMode();
                    } else {
                        self._switchToRoadMapMode();
                    }
                });

                // Initialize the current position button
                self._currentPositionMapButton = new MapButton({
                    tooltip: TOOLTIP_CURRENT_POSITION,
                    iconUrl: ICON_URL_CURRENT_POSITION
                });
                map.addMapButton(self._currentPositionMapButton);
                // TODO: register click handler
            });
        },

        /**
         * Set the map mode to 'satellite'.
         */
        '_switchToSatelliteMapMode': function() {
            this._map.setMapType('HYBRID');
            this._currentMapMode = 'HYBRID';

            this._satelliteMapButton.tooltip = TOOLTIP_SATELLITE_MODE;
            this._satelliteMapButton.iconUrl = ICON_URL_SATELLITE_MODE;
            this._map.updateMapButton(this._satelliteMapButton);
        },

        /**
         * Set the map mode to 'road'.
         */
        '_switchToRoadMapMode': function() {
            this._map.setMapType('ROADMAP');
            this._currentMapMode = 'ROADMAP';

            this._satelliteMapButton.tooltip = TOOLTIP_ROADMAP_MODE;
            this._satelliteMapButton.iconUrl = ICON_URL_ROADMAP_MODE;
            this._map.updateMapButton(this._satelliteMapButton);
        }
    };

    return mapButtonsController;
});