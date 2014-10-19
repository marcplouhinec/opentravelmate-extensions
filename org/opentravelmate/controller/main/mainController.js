/**
 * Controller for the main webview.
 *
 * @author Marc Plouhinec
 */

define([
    'jquery',
    '../widget/webview/webview',
    './menuController',
    './mapButtonsController',
    '../place/placeFinderController',
    '../itinerary/itineraryFinderController',
    '../../service/extensionService',
    'jqueryGoogleFastButton'
], function($, webview, menuController, mapButtonsController, placeFinderController, itineraryFinderController, extensionService) {
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
        'SIDE_PANEL_CONTENT_ELEMENT_ID': 'side-panel-content',

        /**
         * Initialization.
         */
        'init': function () {
            var self = this;

            // Register panel close event listeners
            $('#side-panel-close-button').bind('touchstart click', function handleCloseSidePanelEvent(){
                self.closeSidePanel();
            });

            // Layout the default widgets
            menuController.init(this);
            mapButtonsController.init();
            placeFinderController.init(this);
            itineraryFinderController.init(this);
            webview.layout();

            // Start the extensions
            extensionService.startExtensions();

            // Handle side panel maximizing / minimizing
            if (this.isWideScreen()) {
                var $sidePanelMaximizeButton = $('#side-panel-maximize-button');
                var $sidePanelMinimizeButton = $('#side-panel-minimize-button');
                $sidePanelMaximizeButton.show();

                $sidePanelMaximizeButton.fastClick(function handleMaximizeSidePanelEvent() {
                    self._setSidePanelMaximized(true);
                });
                $sidePanelMinimizeButton.fastClick(function handleMinimizeSidePanelEvent() {
                    self._setSidePanelMaximized(false);
                });
            }
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
            this._setSidePanelMaximized(false);
            $('#side-panel').css('display', 'none');
            $('#map').removeClass('map-hidden-by-side-panel');
            webview.layout();
            $('#' + this.SIDE_PANEL_CONTENT_ELEMENT_ID).html('');
        },

        /**
         * Maximize or minimize the side panel.
         *
         * @param {boolean} maximized
         */
        '_setSidePanelMaximized': function(maximized) {
            var $sidePanel = $('#side-panel');
            var $map = $('#map');
            var $sidePanelMaximizeButton = $('#side-panel-maximize-button');
            var $sidePanelMinimizeButton = $('#side-panel-minimize-button');

            if (maximized) {
                if ($sidePanel.hasClass('side-panel-fullscreen')) { return; }
                $sidePanel.addClass('side-panel-fullscreen');
                $map.hide();
                $sidePanelMaximizeButton.hide();
                $sidePanelMinimizeButton.show();
                webview.layout();
            } else {
                if (!$sidePanel.hasClass('side-panel-fullscreen')) { return; }
                $sidePanel.removeClass('side-panel-fullscreen');
                $map.show();
                $sidePanelMinimizeButton.hide();
                $sidePanelMaximizeButton.show();
                webview.layout();
            }
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
        },

        /**
         * Tell if the screen is considered as wide (desktop, tablet) or not (smart-phone).
         *
         * @returns {boolean}
         */
        'isWideScreen': function() {
            return $(window).width() >= 900;
        }
    };

    return mainController;
});