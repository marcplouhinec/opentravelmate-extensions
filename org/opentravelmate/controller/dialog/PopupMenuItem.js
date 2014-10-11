/**
 * Popup menu item.
 *
 * @author Marc Plouhinec
 */

define(function() {
    'use strict';

    /**
     * Create new PopupMenuItem.
     *
     * @param {{
     *     id: string,
     *     title: string,
     *     iconUrl: string
     * }} options
     * @constructor
     */
    function PopupMenuItem(options) {

        /**
         * Menu item ID.
         *
         * @type {string}
         */
        this.id = options.id;

        /**
         * Menu item title.
         *
         * @type {string}
         */
        this.title = options.title;

        /**
         * Menu item icon URL.
         *
         * @type {string}
         */
        this.iconUrl = options.iconUrl;
    }

    return PopupMenuItem;
});
