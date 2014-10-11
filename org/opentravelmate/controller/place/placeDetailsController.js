/**
 * Show the details of a place.
 *
 * @author Marc Plouhinec
 */

define(['jquery', '../../entity/Place', '../widget/webview/webview'], function($, Place, webview) {

    /**
     * Show the details of a place.
     */
    var placeDetailsController = {

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
            iframe.src = webview.baseUrl + 'extensions/org/opentravelmate/view/place/place-details.html';
            document.getElementById(mainController.SIDE_PANEL_CONTENT_ELEMENT_ID).appendChild(iframe);

            $(iframe).load(function() {
                iframe.contentDocument.getElementById('latitude').textContent = '' + place.latitude;
                iframe.contentDocument.getElementById('longitude').textContent = '' + place.longitude;
            });

        }

    };

    return placeDetailsController;
});