/**
 * Define the place finder menu panel internal WebView controller.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'jquery',
    'core/widget/Widget',
    'core/widget/webview/WebView'
], function($, Widget, WebView) {
    'use strict';

    var internalController = {

        /**
         * @const
         * @type {String}
         */
        'PLACE_FINDER_WEBVIEW_ID': 'place-finder-webview',

        /**
         * @const
         * @type {String}
         */
        'PLACE_FINDER_WEBVIEW_CLOSE_EVENT': 'place-finder-webview-close-event',

        /**
         * Initialize the place finder WebView.
         */
        'initWebView': function() {
            var self = this;

            // Suggest places to the user when he's typing a query
            // TODO

            // Handle the search button
            // TODO

            // Handle the close button
            $('#close-button').bind('touchstart click', function(event) {
                event.stopPropagation();
                event.preventDefault();

                /** @type {WebView} */
                var webView = Widget.findById(self.PLACE_FINDER_WEBVIEW_ID);
                webView.fireExternalEvent(self.PLACE_FINDER_WEBVIEW_CLOSE_EVENT);
            });

            // Focus on the place-query input
            $('#place-query').focus();
        }
    };

    return internalController;
});
