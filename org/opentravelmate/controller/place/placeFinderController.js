/**
 * Controller for the place finder.
 *
 * @author Marc Plouhinec
 */

define(['../widget/webview/webview', '../main/menuController'], function(webview, menuController) {
    'use strict';

    var MENU_ITEM_TITLE = 'Find place';
    var MENU_ITEM_TOOLTIP = 'Find a place';
    var MENU_ITEM_ICONURL = 'extensions/org/opentravelmate/view/place/image/ic_btn_find_place.png';

    /**
     * Controller for the menu.
     */
    var placeFinderController = {

        /**
         * @type {mainController}
         * @private
         */
        '_mainController': null,

        /**
         * Initialization.
         *
         * @param {mainController} mainController
         */
        'init': function (mainController) {
            this._mainController = mainController;

            // Create a menu item
            menuController.addMenuItem(MENU_ITEM_TITLE, MENU_ITEM_TOOLTIP, webview.baseUrl + MENU_ITEM_ICONURL, function handleMenuItemSelection() {
                // Show a form for the user to find a place
                mainController.openSidePanel(MENU_ITEM_TOOLTIP);

                var iframe = /** @type {HTMLIFrameElement} */document.createElement('iframe');
                iframe.style.position = 'absolute';
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.border = 'none';
                iframe.src = webview.baseUrl + 'extensions/org/opentravelmate/view/place/place-finder.html';
                document.getElementById(mainController.SIDE_PANEL_CONTENT_ELEMENT_ID).appendChild(iframe);

                $(iframe).load(function() {
                    // TODO iframe.contentDocument.getElementById('latitude').textContent = '' + place.latitude;
                });
            })
        }
    };

    return placeFinderController;
});