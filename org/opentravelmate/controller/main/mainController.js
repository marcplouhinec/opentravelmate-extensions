/**
 * Controller for the main webview.
 *
 * @author Marc Plouhinec
 */

define([
    'jquery',
    '../widget/webview/webview',
    './menuController',
    './../map/mapButtonsController',
    './../map/mapItineraryController',
    '../place/placeFinderController',
    '../itinerary/itineraryFinderController',
    '../../service/extensionService',
    'jqueryGoogleFastButton'
], function($, webview, menuController, mapButtonsController, mapItineraryController, placeFinderController,
            itineraryFinderController, extensionService) {
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
         * HTML element ID of the footer panel content.
         *
         * @type {string}
         * @const
         */
        'FOOTER_PANEL_CONTENT_ELEMENT_ID': 'footer-panel-content',

        /**
         * @private
         * @type {boolean}
         */
        '_sidePanelOpened': false,

        /**
         * @private
         * @type {function}
         */
        '_sidePanelCloseListener': null,

        /**
         * Initialization.
         */
        'init': function () {
            var self = this;

            // Register panel close event listeners
            $('#side-panel-close-button').fastClick(function handleCloseSidePanelEvent(){
                self.closeSidePanel();
            });
            $('#footer-panel-close-button').fastClick(function handleCloseSidePanelEvent(){
                self.closeFooterPanel();
            });

            // Layout the default widgets
            menuController.init(this);
            mapButtonsController.init();
            mapItineraryController.init();
            placeFinderController.init(this);
            itineraryFinderController.init(this);
            webview.layout();

            // Start the extensions
            extensionService.startExtensions();

            // Handle side panel fullscreen / restoring
            if (this.isWideScreen()) {
                var $sidePanelFullscreenButton = $('#side-panel-fullscreen-button');
                var $sidePanelRestoreSizeButton = $('#side-panel-restore-size-button');
                $sidePanelFullscreenButton.show();

                $sidePanelFullscreenButton.fastClick(function handleFullscreenSidePanelEvent() {
                    self._setSidePanelFullscreen(true);
                });
                $sidePanelRestoreSizeButton.fastClick(function handleRestoreSizeSidePanelEvent() {
                    self._setSidePanelFullscreen(false);
                });
            }

            // Handle side panel maximizing / minimizing
            var $sidePanelMaximizeButton = $('#side-panel-maximize-button');
            var $sidePanelMinimizeButton = $('#side-panel-minimize-button');
            $sidePanelMaximizeButton.click(function handleMaximizeSidePanelEvent() {
                self.setSidePanelMaximized(true);
            });
            $sidePanelMinimizeButton.fastClick(function handleMinimizeSidePanelEvent() {
                self.setSidePanelMaximized(false);
            });

            // Handle footer panel maximizing / minimizing
            var $footerPanelMaximizeButton = $('#footer-panel-maximize-button');
            var $footerPanelMinimizeButton = $('#footer-panel-minimize-button');
            $footerPanelMaximizeButton.fastClick(function handleMaximizeFooterPanelEvent() {
                self._setFooterPanelMaximized(true);
            });
            $footerPanelMinimizeButton.fastClick(function handleMinimizeFooterPanelEvent() {
                self._setFooterPanelMaximized(false);
            });
        },

        /**
         * Show the panel located on the side of the map.
         * Note: on a small screen, the side panel takes all the screen.
         *
         * @param {string} title
         * @param {function=} closeListener Optional listener called when the side panel is closed.
         */
        'openSidePanel': function (title, closeListener) {
            this.closeSidePanel();

            this._sidePanelOpened = true;
            this._sidePanelCloseListener = closeListener;
            this.setSidePanelMaximized(true);
            $('#side-panel-title-label').text(title);
            $('#side-panel').show();
            $('#map').addClass('map-hidden-by-side-panel');
            webview.layout();
        },

        /**
         * Close the panel located on the side of the map.
         */
        'closeSidePanel': function () {
            if (!this._sidePanelOpened) { return; }
            this._sidePanelOpened = false;

            if (this._sidePanelCloseListener) {
                this._sidePanelCloseListener();
                this._sidePanelCloseListener = null;
            }

            this._setSidePanelFullscreen(false);
            this.setSidePanelMaximized(true);
            $('#side-panel').hide();
            $('#map').removeClass('map-hidden-by-side-panel');
            webview.layout();
            $('#' + this.SIDE_PANEL_CONTENT_ELEMENT_ID).html('');
        },

        /**
         * Change the side panel size.
         *
         * @param {boolean} fullscreen
         */
        '_setSidePanelFullscreen': function(fullscreen) {
            var $sidePanel = $('#side-panel');
            var $map = $('#map');
            var $sidePanelFullscreenButton = $('#side-panel-fullscreen-button');
            var $sidePanelRestoreSizeButton = $('#side-panel-restore-size-button');
            var $sidePanelMinimizeButton = $('#side-panel-minimize-button');

            if (fullscreen) {
                if ($sidePanel.hasClass('side-panel-fullscreen')) { return; }
                $sidePanel.addClass('side-panel-fullscreen');
                $map.hide();
                $sidePanelFullscreenButton.hide();
                $sidePanelRestoreSizeButton.show();
                $sidePanelMinimizeButton.hide();
            } else {
                if (!$sidePanel.hasClass('side-panel-fullscreen')) { return; }
                $sidePanel.removeClass('side-panel-fullscreen');
                $map.show();
                $sidePanelRestoreSizeButton.hide();
                $sidePanelFullscreenButton.show();
                $sidePanelMinimizeButton.show();
            }
            webview.layout();
        },

        /**
         * Maximize or minimize the side panel.
         *
         * @param {boolean} maximized
         */
        'setSidePanelMaximized': function(maximized) {
            var $sidePanel = $('#side-panel');
            var $map = $('#map');
            var $sidePanelMaximizeButton = $('#side-panel-maximize-button');
            var $sidePanelMinimizeButton = $('#side-panel-minimize-button');

            if (maximized) {
                if (!$sidePanel.hasClass('side-panel-minimized')) { return; }
                $sidePanel.removeClass('side-panel-minimized');

                $map.removeClass('map-hidden-by-minimized-side-panel');
                $map.addClass('map-hidden-by-side-panel');

                $sidePanelMaximizeButton.hide();
                $sidePanelMinimizeButton.show();
            } else {
                if ($sidePanel.hasClass('side-panel-minimized')) { return; }
                $sidePanel.addClass('side-panel-minimized');

                $map.addClass('map-hidden-by-minimized-side-panel');
                $map.removeClass('map-hidden-by-side-panel');

                $sidePanelMinimizeButton.hide();
                $sidePanelMaximizeButton.show();
            }
            webview.layout();
        },

        /**
         * Open the panel located below the map.
         *
         * @param {string} title
         */
        'openFooterPanel': function (title) {
            $('#footer-panel-title-label').text(title);
            $('#central-panel').addClass('central-panel-hidden-by-footer-panel');
            $('#footer-panel').show();
            webview.layout();
        },

        /**
         * Close the panel located below the map.
         */
        'closeFooterPanel': function () {
            this._setFooterPanelMaximized(true);
            $('#footer-panel').hide();
            $('#central-panel').removeClass('central-panel-hidden-by-footer-panel');
            webview.layout();
            $('#' + this.FOOTER_PANEL_CONTENT_ELEMENT_ID).html('');
        },

        /**
         * Maximize or minimize the footer panel.
         *
         * @param {boolean} maximized
         */
        '_setFooterPanelMaximized': function(maximized) {
            var $footerPanel = $('#footer-panel');
            var $centralPanel = $('#central-panel');
            var $footerPanelMaximizeButton = $('#footer-panel-maximize-button');
            var $footerPanelMinimizeButton = $('#footer-panel-minimize-button');

            if (maximized) {
                if (!$footerPanel.hasClass('footer-panel-minimized')) { return; }
                $footerPanel.removeClass('footer-panel-minimized');

                $centralPanel.removeClass('central-panel-hidden-by-minimized-footer-panel');
                $centralPanel.addClass('central-panel-hidden-by-footer-panel');

                $footerPanelMaximizeButton.hide();
                $footerPanelMinimizeButton.show();
            } else {
                if ($footerPanel.hasClass('footer-panel-minimized')) { return; }
                $footerPanel.addClass('footer-panel-minimized');

                $centralPanel.addClass('central-panel-hidden-by-minimized-footer-panel');
                $centralPanel.removeClass('central-panel-hidden-by-footer-panel');

                $footerPanelMinimizeButton.hide();
                $footerPanelMaximizeButton.show();
            }
            webview.layout();
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