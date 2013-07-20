/**
 * Define the place finder WebView controller.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'jquery',
    'core/commons/FunctionDam',
    'core/widget/Widget',
    'core/widget/webview/WebView'
], function($, FunctionDam, Widget, WebView) {
    'use strict';

    /**
     * @const
     * @type {String}
     */
    var PLACE_FINDER_WEBVIEW_ID = 'place-finder-webview';
    /**
     * @const
     * @type {String}
     */
    var PLACE_FINDER_WEBVIEW_CLOSE_EVENT = 'place-finder-webview-close-event';

    var webViewReadyDam = new FunctionDam();

    var placeFinderWebViewController = {
        /**
         * Show the place finder web view.
         *
         * Note 1: do nothing if the place holder is already here.
         * Note 2: this function must be called from the main WebView.
         */
        'showWebView': function() {
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
            webViewPlaceHolder.setAttribute('data-otm-entrypoint', 'place-finder/placeFinderWebViewEntryPoint');
            document.body.appendChild(webViewPlaceHolder);

            // Tell when the web view is ready
            WebView.onCreate(PLACE_FINDER_WEBVIEW_ID, function() {
                webViewReadyDam.setOpened(true);
            });

            // Create the web view
            WebView.getCurrent().layout();
        },

        /**
         * Remove the place finder web view.
         */
        'removeWebView': function() {
            $('#' + PLACE_FINDER_WEBVIEW_ID).remove();
            WebView.getCurrent().layout();
        },

        /**
         * Register a listener for the close event.
         * Note: this function must be called from the main WebView.
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
            var webView = Widget.findById(PLACE_FINDER_WEBVIEW_ID);
            webView.on(PLACE_FINDER_WEBVIEW_CLOSE_EVENT, listener);
        },

        /**
         * Initialize the place finder WebView.
         */
        'initWebView': function() {
            // Suggest places to the user when he's typing a query
            // TODO

            // Handle the search button
            // TODO

            // Handle the close button
            $('#close-button').click(function() {
                /** @type {WebView} */
                var webView = Widget.findById(PLACE_FINDER_WEBVIEW_ID);
                webView.fireExternalEvent(PLACE_FINDER_WEBVIEW_CLOSE_EVENT);
            });
        }
    };

    return placeFinderWebViewController;
});
