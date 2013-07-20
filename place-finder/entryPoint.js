/**
 * Place finder entry point.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'core/widget/Widget',
    'core/widget/menu/Menu',
    'core/widget/menu/MenuItem',
    'core/widget/webview/WebView',
    './placeFinderWebViewController'
], function(Widget, Menu, MenuItem, WebView, placeFinderWebViewController) {
    'use strict';

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
        menuItem.onClick(function() {
            // Show the place finder web view.
            placeFinderWebViewController.showWebView();
        });

        // Listen to the web view close button
        placeFinderWebViewController.onClose(function() {
            placeFinderWebViewController.removeWebView();
        });
    };
});
