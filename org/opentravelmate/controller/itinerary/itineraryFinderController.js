/**
 * Controller for the place finder.
 *
 * @author Marc Plouhinec
 */

define([
    '../widget/webview/webview',
    '../main/menuController'
], function(webview, menuController) {
    'use strict';

    var PANEL_ID = 'itinerary-finder-panel';
    var MENU_ITEM_TITLE = 'Find itinerary';
    var MENU_ITEM_TOOLTIP = 'Find an itinerary';
    var MENU_ITEM_ICONURL = 'extensions/org/opentravelmate/view/itinerary/image/itinerary.png';

    /**
     * Controller for the menu.
     */
    var itineraryFinderController = {
        /**
         * Initialization.
         *
         * @param {mainController} mainController
         */
        'init': function (mainController) {
            // Create a menu item
            menuController.addMenuItem(MENU_ITEM_TITLE, MENU_ITEM_TOOLTIP, webview.baseUrl + MENU_ITEM_ICONURL, function handleMenuItemSelection() {
                if (document.getElementById(PANEL_ID)) { return; }

                // Show a form for the user to find an itinerary
                mainController.openSidePanel(MENU_ITEM_TOOLTIP);

                var iframe = /** @type {HTMLIFrameElement} */document.createElement('iframe');
                iframe.setAttribute('id', PANEL_ID);
                iframe.style.position = 'absolute';
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.border = 'none';
                iframe.src = webview.baseUrl + 'extensions/org/opentravelmate/view/itinerary/itinerary-finder.html';
                document.getElementById(mainController.SIDE_PANEL_CONTENT_ELEMENT_ID).appendChild(iframe);
            });
        }
    };

    return itineraryFinderController;
});