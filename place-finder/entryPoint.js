/**
 * Place finder entry point.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'core/widget/Widget',
    'core/widget/menu/Menu',
    'core/widget/menu/MenuItem',
    'core/widget/webview/WebView'
], function(Widget, Menu, MenuItem, WebView) {
    'use strict';

    /**
     * @const
     * @type {String}
     */
    var PLACE_FINDER_WEBVIEW_ID = 'place-finder-webview';

    /**
     * Show the place finder web view.
     */
    function showPlaceFinderWebView() {
        // Do nothing if the web view is already displayed
        var webView = Widget.findById(PLACE_FINDER_WEBVIEW_ID);
        if (webView) {
            return;
        }

        // Create the web view
        /** @type {HTMLElement} */
        var webViewPlaceHolder = document.createElement('div');
        webViewPlaceHolder.id = PLACE_FINDER_WEBVIEW_ID;
        webViewPlaceHolder.style.position = 'absolute';
        webViewPlaceHolder.style.left = 0;
        webViewPlaceHolder.style.right = 0;
        webViewPlaceHolder.style.top = $('#main-menu').height() + 'px';
        webViewPlaceHolder.style.height = '50px';
        webViewPlaceHolder.setAttribute('data-otm-widget', 'WebView');
        webViewPlaceHolder.setAttribute('data-otm-url', 'extensions/place-finder/placeFinderWebView.html');
        webViewPlaceHolder.setAttribute('data-otm-entrypoint', 'place-finder/placeFinderWebView');
        document.body.appendChild(webViewPlaceHolder);
        WebView.getCurrent().layout();
    }

    /**
     * Extension entry point.
     */
    return function main() {
        // Add a menu item
        var menuItem = new MenuItem({
            title: 'Find place',
            tooltip: 'Find a place',
            iconUrl: 'extensions/place-finder/image/ic_btn_find_place.png'
        });
        /** @type {Menu} */
        var menu = Widget.findById('main-menu');
        menu.addMenuItem(menuItem);

        // Listen to the menu item click event
        menuItem.onClick(function handleFindPlaceMenuItemClickEvent() {
            showPlaceFinderWebView();
        });
    };
});
