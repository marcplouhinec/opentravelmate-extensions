/**
 * Controller for the main webview.
 *
 * @author Marc Plouhinec
 */

define([
    'jquery',
    './menuController',
    '../widget/webview/webview'
], function($, menuController, webview) {
    'use strict';

    /**
     * Controller for the main webview.
     */
    var mainController = {

        /**
         * HTML element ID of the side panel content.
         *
         * @type {string}
         * @const
         */
        'SIDE_PANEL_CONTENT_ELEMENT_ID': 'side-panel',

        /**
         * Initialization.
         */
        'init': function () {
            var self = this;

            // Register panel close event listeners
            $('#side-panel-close-button').bind('touchstart click', function handleCloseSidePanelEvent(){
                self.closeSidePanel();
            });

            // Layout the menu and map widgets
            menuController.init(this);
            webview.layout();

            // Start the extensions
            //extensionManager.startExtensions();

            console.log('hello2');
        },

        /**
         * Show the panel located on the side of the map.
         * Note: on a small screen, the side panel takes all the screen.
         *
         * @param {string} title
         */
        'openSidePanel': function (title) {
            $('#side-panel-title-label').text(title);
            $('#side-panel').css('display', 'block');
            $('#map').addClass('map-hidden-by-side-panel');
            webview.layout();
        },

        /**
         * Close the panel located on the side of the map.
         */
        'closeSidePanel': function () {
            $('#side-panel').css('display', 'none');
            $('#map').removeClass('map-hidden-by-side-panel');
            webview.layout();
        },

        /**
         * Open the panel located below the map.
         *
         * @param {string} title
         */
        'openFooterPanel': function (title) {
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