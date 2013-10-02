/**
 * Handle the Show current position button.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define(['../core/widget/map/MapButton'], function(MapButton) {
    'use strict';

    /**
     * @constant
     * @type {string}
     */
    var TOOLTIP = 'Show my position on the map';

    /**
     * @constant
     * @type {string}
     */
    var ICON_URL = 'extensions/map-tools/image/ic_btn_show_my_position.png';

    var currentPositionButtonHandler = {
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
         * Create a new current position button.
         *
         * @param {Map} map
         */
        'createButton': function(map) {
            var self = this;
            this._map = map;

            this._mapButton = new MapButton({
                tooltip: TOOLTIP,
                iconUrl: ICON_URL
            });
            map.addMapButton(this._mapButton);

            this._mapButton.onClick(function() {
                // TODO
            });
        }
    };

    return currentPositionButtonHandler;
});
