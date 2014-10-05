/**
 * Controller for the main webview.
 *
 * @author Marc Plouhinec
 */

define([
    './menuController',
    '../widget/webview/webview'
], function(menuController, webview) {
    'use strict';

    /**
     * Controller for the main webview.
     */
    var mainController = {

        /**
         * Initialization.
         */
        'init': function () {
            // Layout the menu and map widgets
            menuController.init();
            //webview.layout();

            // Start the extensions
            //extensionManager.startExtensions();

            console.log('hello2');
        },

        /**
         * Show the panel located on the side of the map.
         * Note: on a small screen, the side panel takes all the screen.
         */
        'openSidePanel': function () {
            // TODO
        },

        /**
         * Close the panel located on the side of the map.
         */
        'closeSidePanel': function () {
            // TODO
        },

        /**
         * Open the panel located below the map.
         */
        'openFooterPanel': function () {
            // TODO
        },

        /**
         * Close the panel located below the map.
         */
        'closeFooterPanel': function () {
            // TODO
        }
    };

    return mainController;
});