/**
 * Define a menu item.
 *
 * @author Marc Plouhinec
 */

define(['lodash'], function(_) {
    /**
     * Create a menu item.
     *
     * @param {{title: String, tooltip: String, iconUrl: String }} options
     * @constructor
     */
    function MenuItem(options) {
        /** @type {String} */
        this.title = options.title;
        /** @type {String} */
        this.tooltip = options.tooltip;
        /** @type {String} */
        this.iconUrl = options.iconUrl;

        /** @type {number} */
        this.id = MenuItem.nextId += 1;

        /**
         * @type {Array.<Function>}
         * @private
         */
        this._listeners = [];
    }

    /**
     * Static attribute used to generate menu item IDs.
     *
     * @type {number}
     */
    MenuItem.nextId = 0;

    /**
     * Register a listener for the click event.
     *
     * @param {Function} listener
     */
    MenuItem.prototype.onClick = function(listener) {
        this._listeners.push(listener);
    };

    /**
     * Fire a click event to the registered listeners.
     */
    MenuItem.prototype.fireClickEvent = function() {
        _.each(this._listeners, function(listener) {
            listener();
        });
    };

    return MenuItem;
});