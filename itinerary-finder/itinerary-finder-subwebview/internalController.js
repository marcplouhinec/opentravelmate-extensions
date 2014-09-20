/**
 * Define the internal SubWebView controller.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'googleFastButton',
    '../../core/widget/webview/webview',
    './constants'
], function(modernizr, FastButton, webview, constants) {
    'use strict';

    var internalController = {
        /**
         * Initialize the SubWebView.
         */
        'initWebView': function() {
            // Initialize the date and time fields
            $('#itineraryDate').val(moment().format('YYYY-MM-DD'));
            $('#itineraryTime').val(moment().format('HH:mm'));

            // Activate the date picker
            $('#itineraryDate').datepicker({
                dateFormat: 'yy-mm-dd'
            });
            $('#itineraryTime').timepicker({
                timeFormat: 'H:i',
                step: 10
            });


            // Fire an external event when the close button is pressed
            new FastButton(document.getElementById('close-button'), function() {
                webview.fireExternalEvent(constants.CLOSE_EVENT);
            });
        }
    };

    return internalController;
});
