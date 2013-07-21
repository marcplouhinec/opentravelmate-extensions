/**
 * Define the place finder menu panel external WebView controller.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'jquery',
    'core/commons/FunctionDam',
    'core/widget/Widget',
    'core/widget/webview/WebView',
    './internalController'
], function($, FunctionDam, Widget, WebView, internalController) {
    'use strict';

    var webViewReadyDam = new FunctionDam();

    var externalController = {
        /**
         * Show the place finder web view.
         * Note: do nothing if the place holder is already here.
         */
        'showWebView': function() {
            // Do nothing if the web view is already displayed
            var webView = Widget.findById(internalController.PLACE_FINDER_WEBVIEW_ID);
            if (webView) {
                return;
            }

            // Create the web view
            /** @type {HTMLElement} */
            var webViewPlaceHolder = document.createElement('div');
            webViewPlaceHolder.id = internalController.PLACE_FINDER_WEBVIEW_ID;
            webViewPlaceHolder.style.position = 'absolute';
            webViewPlaceHolder.style.left = 0;
            webViewPlaceHolder.style.right = 0;
            webViewPlaceHolder.style.top = $('#main-menu').height() + 'px';
            webViewPlaceHolder.style.height = '50px';
            webViewPlaceHolder.setAttribute('data-otm-widget', 'WebView');
            webViewPlaceHolder.setAttribute('data-otm-url', 'extensions/place-finder/menu-panel/menu-panel.html');
            webViewPlaceHolder.setAttribute('data-otm-entrypoint', 'place-finder/menu-panel/entryPoint');
            document.body.appendChild(webViewPlaceHolder);

            // Tell when the web view is ready
            WebView.onCreate(internalController.PLACE_FINDER_WEBVIEW_ID, function() {
                webViewReadyDam.setOpened(true);
            });

            // Create the web view
            WebView.getCurrent().layout();
        },

        /**
         * Remove the place finder web view.
         */
        'removeWebView': function() {
            $('#' + internalController.PLACE_FINDER_WEBVIEW_ID).remove();
            WebView.getCurrent().layout();
        },

        /**
         * Register a listener for the close event.
         *
         * @param {Function} listener
         */
        'onClose': function(listener) {
            var self = this;

            if (!webViewReadyDam.isOpened()) {
                webViewReadyDam.executeWhenOpen(function() {
                    self.onClose(listener);
                });
                return;
            }

            /** @type {WebView} */
            var webView = Widget.findById(internalController.PLACE_FINDER_WEBVIEW_ID);
            webView.on(internalController.PLACE_FINDER_WEBVIEW_CLOSE_EVENT, listener);
        }
    };

    return externalController;
});
