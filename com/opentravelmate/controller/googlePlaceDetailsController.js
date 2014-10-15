/**
 * Show the details of a place found by the Google services.
 *
 * @author Marc Plouhinec
 */

define([
    'jquery',
    '../../../org/opentravelmate/entity/Place',
    '../../../org/opentravelmate/controller/widget/webview/webview'
], function($, Place, webview) {

    /**
     * Show the details of a place found by the Google services.
     */
    var googlePlaceDetailsController = {

        /**
         * @type {GooglePlaceProviderService}
         * @private
         */
        '_googlePlaceProviderService': null,

        /**
         * Initialize the controller.
         *
         * @param {GooglePlaceProviderService} googlePlaceProviderService
         */
        'init': function(googlePlaceProviderService) {
            this._googlePlaceProviderService = googlePlaceProviderService;
        },

        /**
         * Show the menu for the given place.
         *
         * @param {Place} place
         */
        'showPlaceDetails': function(place) {
            var mainController = require('extensions/org/opentravelmate/controller/main/mainController');
            mainController.openSidePanel(place.name);

            // Display basic information about the place
            var iframe = /** @type {HTMLIFrameElement} */document.createElement('iframe');
            iframe.style.position = 'absolute';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.src = webview.baseUrl + 'extensions/com/opentravelmate/view/google-place-details.html';
            document.getElementById(mainController.SIDE_PANEL_CONTENT_ELEMENT_ID).appendChild(iframe);

            var address = /** @type {string} */ place.additionalParameters['formatted_address'];
            var iframeLoaded = false;
            $(iframe).load(function () {
                iframeLoaded = true;
                iframe.contentDocument.getElementById('latitude').textContent = '' + place.latitude;
                iframe.contentDocument.getElementById('longitude').textContent = '' + place.longitude;
                iframe.contentDocument.getElementById('address').textContent = address ? address : 'Loading...';
            });

            // Load more details of a place if necessary
            if (!address) {
                this._googlePlaceProviderService.getPlaceDetails(place, function(place) {
                    address = place.additionalParameters['formatted_address'];
                    if (iframeLoaded) {
                        iframe.contentDocument.getElementById('address').textContent = address;
                    }
                });
            }
        }

    };

    return googlePlaceDetailsController;
});