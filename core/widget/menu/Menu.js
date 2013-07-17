/**
 * Define the menu widget.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'underscore',
    'core/widget/Widget',
    'core/widget/LayoutParams',
    'core/widget/menu/MenuItem',
    'nativeMenu'
], function(_, Widget, LayoutParams, MenuItem, nativeMenu) {
    'use strict';

    /**
     * Create a menu.
     *
     * @param {{id: String, baseUrl: String}} options
     * @constructor
     */
    function Menu(options) {
        Widget.call(this, options);

        /** @type {String} */
        this.baseUrl = options.baseUrl;

        /**
         * @type {HTMLElement|undefined}
         * @private
         */
        this._menuContainer = undefined;

        /**
         * @type {Object.<Number, MenuItem>}
         * @private
         */
        this._menuItemById = {};
    }

    Menu.prototype = new Widget();
    Menu.prototype.constructor = Menu;

    /**
     * Build the native view object for the current widget.
     *
     * @param {LayoutParams} layoutParams
     */
    Menu.prototype.buildView = function(layoutParams) {
        nativeMenu.buildView(JSON.stringify(layoutParams));
    };

    /**
     * Add an item to the menu.
     *
     * @param {MenuItem} item
     */
    Menu.prototype.addMenuItem = function(item) {
        this._menuItemById[item.id] = item;

        if (_.isString(item.iconUrl) && item.iconUrl.indexOf('://') === -1) {
            item.iconUrl = this.baseUrl + item.iconUrl;
        }

        nativeMenu.addMenuItem(this.id, JSON.stringify(item));
    };

    /**
     * Fire a click event from a menu item.
     *
     * @param {Number} menuItemId
     */
    Menu.prototype.fireClickEvent = function(menuItemId) {
        /** @type {MenuItem} */
        var menuItem = this._menuItemById[menuItemId];
        if (menuItem) {
            menuItem.fireClickEvent();
        }
    };

    return Menu;
});