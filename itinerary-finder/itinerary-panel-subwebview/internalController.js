/**
 * Define the internal SubWebView controller.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'googleFastButton',
    '../../core/widget/webview/webview',
    './constants'
], function(FastButton, webview, constants) {
    'use strict';

    var internalController = {
        /**
         * Initialize the SubWebView.
         */
        'initWebView': function() {
            var itinerary = /** @type {Itinerary} */ JSON.parse(webview.additionalParameters['itinerary']);

            // Handle the close button
            new FastButton(document.getElementById('close-button'), function() {
                webview.fireExternalEvent(constants.CLOSE_EVENT);
            });

            // Handle the minimize-maximize button
            var minMaxImage = /** @type {HTMLImageElement} */ document.getElementById('minimize-maximize-button-image');
            new FastButton(document.getElementById('minimize-maximize-button'), function() {
                switch (minMaxImage.alt) {
                    case 'Minimize':
                        minMaxImage.alt = 'Maximize';
                        minMaxImage.src = 'image/ic_btn_maximize.png';
                        webview.fireExternalEvent(constants.MINIMIZE_EVENT);
                        break;
                    case 'Maximize':
                        minMaxImage.alt = 'Minimize';
                        minMaxImage.src = 'image/ic_btn_minimize.png';
                        webview.fireExternalEvent(constants.MAXIMIZE_EVENT);
                        break;
                }
            });
        }
    };

    return internalController;
});
