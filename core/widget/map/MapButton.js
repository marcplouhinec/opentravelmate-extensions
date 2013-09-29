/**
 * Define a button that will be displayed on the map.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define(function() {
    'use strict';

    /**
     * Create a new MapButton.
     *
     * @param {{tooltip: String, iconUrl: String}} options
     * @constructor
     */
    function MapButton(options) {
        /** @type {String} */
        this.tooltip = options.tooltip;

        /** @type {String} */
        this.iconUrl = options.iconUrl;

        /** @type {number} */
        this.id = MapButton.nextId += 1;

        /**
         * @type {Array.<Function>}
         * @private
         */
        this._listeners = [];
    }

    /**
     * Static attribute used to generate MapButton IDs.
     *
     * @type {number}
     */
    MapButton.nextId = 0;

    /**
     * Register a listener for the click event.
     *
     * @param {Function} listener
     */
    MapButton.prototype.onClick = function(listener) {
        this._listeners.push(listener);
    };

    /**
     * Fire a click event to the registered listeners.
     */
    MapButton.prototype.fireClickEvent = function() {
        for (var i = 0; i < this._listeners.length; i += 1) {
            this._listeners[i]();
        }
    };

    return MapButton;
});
