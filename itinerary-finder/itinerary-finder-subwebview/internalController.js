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

            // Activate the auto-completion on the place fields
            var currentAutoCompleteCallback = /** @type {function(Array.<{label: String, value: Object}>)} */null;
            var suggestPlaceToString = function () { return this.name; };
            webview.onExternalEvent(constants.AUTO_COMPLETE_PLACE_RESPONSE_EVENT, function (/** @type {function(suggestedPlaces: Array.<Place>)} */payload) {
                if (currentAutoCompleteCallback !== null) {
                    var suggestedPlaces = payload.suggestedPlaces;
                    var autoCompleteValues = [];
                    for (var i = 0; i < suggestedPlaces.length; i++) {
                        var suggestedPlace = suggestedPlaces[i];
                        suggestedPlace.toString = suggestPlaceToString;
                        autoCompleteValues.push({
                            label: suggestedPlace.toString(),
                            value: suggestedPlace
                        });
                    }
                    currentAutoCompleteCallback(autoCompleteValues);
                }
            });
            $('#itineraryDestination').autocomplete({
                minLength: 3,
                source: function (/** @type {{term: String}} */ request, /** @type {function(Array.<{label: String, value: Object}>)} */ response) {
                    webview.fireExternalEvent(constants.AUTO_COMPLETE_PLACE_EVENT, {query: request.term});
                    currentAutoCompleteCallback = response;
                }
            });


            // Fire an external event when the close button is pressed
            new FastButton(document.getElementById('close-button'), function() {
                webview.fireExternalEvent(constants.CLOSE_EVENT);
            });
        }
    };

    return internalController;
});
