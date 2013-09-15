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
            var place = /** @type {Place} */ JSON.parse(webview.additionalParameters['place']);

            // Set the title
            var divTitleLabel = /** @type {HTMLDivElement} */ document.getElementById('title-label');
            divTitleLabel.textContent = place.name;

            // Fire an external event when the close button is pressed
            new FastButton(document.getElementById('close-button'), function() {
                webview.fireExternalEvent(constants.CLOSE_EVENT);
            });
        }
    };

    return internalController;
});
