/**
 * Show the details of an itinerary.
 *
 * @author Marc Plouhinec
 */

define([
    'jquery',
    'moment',
    '../../entity/itinerary/Itinerary',
    '../widget/webview/webview'
], function($, moment, Itinerary, webview) {

    /**
     * Show the details of an itinerary.
     */
    var itineraryDetailsController = {

        /**
         * Show the details of the given itinerary.
         *
         * @param {Itinerary} itinerary
         */
        'showItineraryDetails': function(itinerary) {
            var mainController = require('extensions/org/opentravelmate/controller/main/mainController');
            mainController.openFooterPanel('Itinerary');

            // Display information about the itinerary
            var iframe = /** @type {HTMLIFrameElement} */document.createElement('iframe');
            iframe.style.position = 'absolute';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.src = webview.baseUrl + 'extensions/org/opentravelmate/view/itinerary/itinerary-details.html';
            $('#' + mainController.FOOTER_PANEL_CONTENT_ELEMENT_ID).html(iframe);

            $(iframe).load(function () {
                var $iframeDocument = $(iframe.contentDocument);

                // Format the start and end time and save them in the legs
                for (var i = 0; i < itinerary.legs.length; i++) {
                    var leg = itinerary.legs[i];
                    leg.formattedStartTime = moment(leg.startDateTime).format('HH:mm');
                    leg.formattedEndTime = moment(leg.endDateTime).format('HH:mm');
                }


                var itineraryStepsTemplate = _.template($iframeDocument.find('#tpl-itinerary-steps').text());
                var renderedItineraryDetails = /** @type {string} */ itineraryStepsTemplate({ itinerary: itinerary });
                var $itineraryDetails = $iframeDocument.find('#itinerary-details');
                $itineraryDetails.html(renderedItineraryDetails);

                // Compute the table natural size
                $itineraryDetails.css('width', '10000px');
                var $itineraryStepsTable = $iframeDocument.find('#itinerary-steps');
                var naturalTableWidth = $itineraryStepsTable.width() + 20;
                $itineraryStepsTable.css('width', naturalTableWidth + 'px');
                $itineraryDetails.css('width', 'auto');
            });
        },

        /**
         * Clear the details of the shown itinerary.
         */
        'clearItineraryDetails': function() {
            var mainController = require('extensions/org/opentravelmate/controller/main/mainController');
            mainController.closeFooterPanel();
        }

    };

    return itineraryDetailsController;
});