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
                self._showPlace(payload.place);
            });
        },

        /**
         * Show the given place.
         *
         * @param {Place} place
         */
        '_showPlace': function(place) {
            document.getElementById('latitude').textContent = String(place.latitude);
            document.getElementById('longitude').textContent = String(place.longitude);
            document.getElementById('altitude').textContent = String(place.additionalParameters.altitude) + 'm';
            document.getElementById('accuracy').textContent = String(place.additionalParameters.accuracy) + 'm';
            document.getElementById('altitudeAccuracy').textContent = String(place.additionalParameters.altitudeAccuracy) + 'm';
            document.getElementById('heading').textContent = place.additionalParameters.heading ? String(place.additionalParameters.heading) + '°' : '?';
            document.getElementById('speed').textContent = place.additionalParameters.speed ? String(place.additionalParameters.speed) + 'm/s' : '?';
            document.getElementById('timestamp').textContent = String(new Date(place.additionalParameters.timestamp));
        }
    };

    return internalController;
});
