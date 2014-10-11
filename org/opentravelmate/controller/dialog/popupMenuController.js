/**
 * Show a menu in a dialog box.
 *
 * @author Marc Plouhinec
 */

define([
    'jquery',
    '../widget/Widget',
    '../widget/webview/webview',
    '../widget/webview/SubWebView',
    './PopupMenuItem',
    './DialogOptions',
    './popupMenuEvent'
], function($, Widget, webview, SubWebView, PopupMenuItem, DialogOptions, popupMenuEvent) {
    'use strict';

    /**
     * @const
     * @type {string}
     */
    var SUB_WEBVIEW_ID = 'popup-menu-subwebview';

    /**
     * Show a message in a dialog box for a short duration.
     */
    var popupMenuController = {

        /**
         * Show a menu in a dialog box.
         *
         * @param {string} title
         * @param {string} iconUrl
         * @param {Array.<PopupMenuItem>} menuItems
         * @param {DialogOptions} options
         * @param {function(menuItemId: string=)} selectionListener
         */
        'showMenu': function (title, iconUrl, menuItems, options, selectionListener) {
            // Close an existing popup menu is necessary
            var subWebViewPlaceHolder = /** @type {HTMLDivElement} */document.getElementById(SUB_WEBVIEW_ID);
            if (subWebViewPlaceHolder) {
                document.body.removeChild(subWebViewPlaceHolder);
                webview.layout();
            }

            // Compute the window dimension
            var windowWidth = /** @type {number} */$(window).width();
            var windowHeight = /** @type {number} */$(window).height();
            var subWebViewDimension = {
                width: Math.round(windowWidth * 0.9),
                height: options.height
            };
            if (windowWidth > options.maxWidth) {
                subWebViewDimension.width = options.maxWidth;
            }

            // Create the SubWebView place holder
            subWebViewPlaceHolder = document.createElement('div');
            subWebViewPlaceHolder.setAttribute('id', SUB_WEBVIEW_ID);
            subWebViewPlaceHolder.style.position = 'absolute';
            subWebViewPlaceHolder.style.left = ((windowWidth - subWebViewDimension.width) / 2) + 'px';
            subWebViewPlaceHolder.style.top = ((windowHeight - subWebViewDimension.height) / 2) + 'px';
            subWebViewPlaceHolder.style.width = subWebViewDimension.width + 'px';
            subWebViewPlaceHolder.style.height = subWebViewDimension.height + 'px';
            subWebViewPlaceHolder.setAttribute('data-otm-widget', 'SubWebView');
            subWebViewPlaceHolder.setAttribute('data-otm-url', 'extensions/org/opentravelmate/view/dialog/popupmenu.html');
            subWebViewPlaceHolder.setAttribute('data-otm-entrypoint', 'extensions/org/opentravelmate/controller/dialog/subwebview/popupMenuEntryPoint');
            subWebViewPlaceHolder.setAttribute('data-otm-title', title);
            subWebViewPlaceHolder.setAttribute('data-otm-iconurl', iconUrl);
            subWebViewPlaceHolder.setAttribute('data-otm-menuitems', JSON.stringify(menuItems));
            document.body.appendChild(subWebViewPlaceHolder);

            // When the SubWebView is loaded, register a selection listener
            SubWebView.onCreate(SUB_WEBVIEW_ID, function handlePopupMenuDialogCreated() {
                var subWebView = /** @type {SubWebView} */ Widget.findById(SUB_WEBVIEW_ID);

                subWebView.onInternalEvent(popupMenuEvent.MENU_CLOSED, function handleMenuClosedEvent() {
                    document.body.removeChild(subWebViewPlaceHolder);
                    webview.layout();
                    selectionListener(null);
                });

                subWebView.onInternalEvent(popupMenuEvent.ITEM_SELECTED, function handleItemSelectedEvent(payload) {
                    document.body.removeChild(subWebViewPlaceHolder);
                    webview.layout();
                    selectionListener(payload['menuItemId']);
                });
            });

            webview.layout();
        }
    };

    return popupMenuController;
});
