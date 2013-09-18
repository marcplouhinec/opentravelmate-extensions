/**
 * Define the internal SubWebView controller.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    '../../core/widget/webview/webview',
    './constants'
], function(webview, constants) {
    'use strict';

    var internalController = {
        /**
         * Initialize the SubWebView.
         */
        'initWebView': function() {
            var self = this;

            // Listen to the PLACE DATA LOADED event
            webview.onExternalEvent(constants.PLACE_DATA_LOADED_EVENT, function(payload) {
                if (payload.error) {
                    // TODO show error
                } else {
                    self._showLines(payload.lines, payload.directions);
                }
            });
        },

        /**
         * Show lines on the panel.
         *
         * @private
         * @param lines
         * @param directions
         */
        '_showLines': function(lines, directions) {
            // TODO
            document.getElementById('message').textContent = 'lines: ' + JSON.stringify(lines) + '          directions: ' + JSON.stringify(directions);
        }
    };

    return internalController;
});
