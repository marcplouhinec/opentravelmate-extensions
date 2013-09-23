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

            webview.onExternalEvent(constants.PLACE_DATA_LOADED_EVENT, function(payload) {
                self._showPlaceDetails(payload.placeAddress);
            });
        },

        /**
         * Show loaded place details.
         *
         * @param {String} placeAddress
         */
        '_showPlaceDetails': function(placeAddress) {
            document.getElementById('address-label').textContent = placeAddress;
        }
    };

    return internalController;
});
