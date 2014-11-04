/**
 * Controller for the menu.
 *
 * @author Marc Plouhinec
 */

define([
    'jquery',
    'lodash',
    '../widget/webview/webview',
    'jqueryGoogleFastButton'
], function($, _, webview) {
    'use strict';

    var BUTTON_TOTAL_WIDTH = 55;

    /**
     * Internal representation of a menu item.
     *
     * @param {string} id
     * @param {string} title
     * @param {string} tooltip
     * @param {string} iconUrl
     * @param {function} clickListener
     * @constructor
     */
    function MenuItem(id, title, tooltip, iconUrl, clickListener) {
        this.id = id;
        this.title = title;
        this.tooltip = tooltip;
        this.iconUrl = iconUrl;
        this.clickListener = clickListener;
    }

    /**
     * @type {Array.<MenuItem>}
     */
    var registeredMenuItems = [];

    /**
     * Controller for the menu.
     */
    var menuController = {

        /**
         * @private
         */
        '_menuItemTemplate': null,

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
            var self = this;
            this._mainController = mainController;
            this._menuItemTemplate = _.template($('#tpl-menu-item').text());

            // Add the 'More' button
            this.addMenuItem('More', 'More', 'image/ic_btn_more.png', function handleMoreClick() {
                self._openMenu();
            });
        },

        /**
         * Register a menu item.
         *
         * @param {string} title Title of the menu item.
         * @param {string} tooltip Text shown when the mouse is over the menu item.
         * @param {string} iconUrl URL of the menu item icon.
         * @param {function} clickListener Function called when the menu item is clicked.
         */
        'addMenuItem': function (title, tooltip, iconUrl, clickListener) {
            // Register the menu item
            var buttonId = 'otm-menu-button-' + registeredMenuItems.length;
            registeredMenuItems.push(new MenuItem(buttonId, title, tooltip, iconUrl, clickListener));

            // Add it to the document
            var $buttonPanel = $('#otm-menu-button-panel');
            var menuItemContent = /** @type {string} */this._menuItemTemplate({
                id: buttonId,
                title: title,
                tooltip: tooltip,
                iconUrl: iconUrl,
                size: $buttonPanel.height()
            });

            // Do not display the new button if there is no space left
            var $existingButtons = $buttonPanel.children('button');
            var spaceLeft = $buttonPanel.width() - $existingButtons.length * BUTTON_TOTAL_WIDTH;
            if (spaceLeft >= BUTTON_TOTAL_WIDTH) {
                // Make sure the first button (the 'More' one) must always be on the right
                if ($existingButtons.length <= 1) {
                    $buttonPanel.append(menuItemContent);
                } else {
                    var $firstExistingButton = $existingButtons.first();
                    $(menuItemContent).insertAfter($firstExistingButton);
                }
            }

            // Register the listener
            $('#' + buttonId).fastClick(clickListener);
        },

        /**
         * Open the menu.
         *
         * @private
         */
        '_openMenu': function () {
            this._mainController.openSidePanel('Menu');

            var iframe = /** @type {HTMLIFrameElement} */document.createElement('iframe');
            iframe.style.position = 'absolute';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.src = webview.baseUrl + 'extensions/org/opentravelmate/view/main/menu-panel.html';
            document.getElementById(this._mainController.SIDE_PANEL_CONTENT_ELEMENT_ID).appendChild(iframe);

            $(iframe).load(function () {
                var $iframeDocument = $(iframe.contentDocument);
                var menuItemTemplate = _.template($iframeDocument.find('#tpl-menu-item').text());

                var menuItemsHtml = '';
                for (var i = 1; i < registeredMenuItems.length; i++) {
                    var menuItem = registeredMenuItems[i];
                    menuItemsHtml += menuItemTemplate({
                        menuItem: menuItem,
                        menuItemIndex: i
                    });
                }
                var $menuItems = $iframeDocument.find('#menu-items');
                $menuItems.html(menuItemsHtml);

                // Call the menu item click listener when the user click on it
                $menuItems.find('li').fastClick(function handleMenuItemClick() {
                    var menuItemIndex = $(this).attr('data-menu-item-index');
                    if (!menuItemIndex) { return; }
                    var menuItem = registeredMenuItems[Number(menuItemIndex)];
                    if (!menuItem) { return; }
                    menuItem.clickListener();
                });
            });
        }
    };

    return menuController;
});