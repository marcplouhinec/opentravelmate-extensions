/**
 * Define the internal SubWebView controller.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define('modernizr', [], window.Modernizr);
define([
    'modernizr',
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
            if (!modernizr.inputtypes.date) {
                $('input[type=date]').datepicker({
                    dateFormat: 'yy-mm-dd'
                });
            }
            if (!modernizr.inputtypes.time) {
                $('input[type=time]').timepicker({
                    timeFormat: 'H:i',
                    step: 10
                });
            }


            // Fire an external event when the close button is pressed
            new FastButton(document.getElementById('close-button'), function() {
                webview.fireExternalEvent(constants.CLOSE_EVENT);
            });
        }
    };

    return internalController;
});
