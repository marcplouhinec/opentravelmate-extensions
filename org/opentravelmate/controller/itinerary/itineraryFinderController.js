/**
 * Controller for the place finder.
 *
 * @author Marc Plouhinec
 */

define([
    'jquery',
    '../widget/webview/webview',
    '../main/menuController',
    '../../entity/Place',
    '../../service/placeProviderDirectoryService',
    'jqueryGoogleFastButton'
], function($, webview, menuController, Place, placeProviderDirectoryService) {
    'use strict';

    var PANEL_ID = 'itinerary-finder-panel';
    var MENU_ITEM_TITLE = 'Find itinerary';
    var MENU_ITEM_TOOLTIP = 'Find an itinerary';
    var MENU_ITEM_ICONURL = 'extensions/org/opentravelmate/view/itinerary/image/itinerary.png';

    /**
     * Controller for the menu.
     */
    var itineraryFinderController = {

        /**
         * @private
         * @type {Object.<string, string>}
         */
        '_currentQueryByElementId': {},

        /**
         * @private
         * @type {Object.<string, Array.<Place>>}
         */
        '_suggestedPlacesByElementId': {},

        /**
         * Initialization.
         *
         * @param {mainController} mainController
         */
        'init': function (mainController) {
            var self = this;

            // Create a menu item
            menuController.addMenuItem(MENU_ITEM_TITLE, MENU_ITEM_TOOLTIP, webview.baseUrl + MENU_ITEM_ICONURL, function handleMenuItemSelection() {
                if (document.getElementById(PANEL_ID)) { return; }

                // Show a form for the user to find an itinerary
                mainController.openSidePanel(MENU_ITEM_TOOLTIP);

                var iframe = /** @type {HTMLIFrameElement} */document.createElement('iframe');
                iframe.setAttribute('id', PANEL_ID);
                iframe.style.position = 'absolute';
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.border = 'none';
                iframe.src = webview.baseUrl + 'extensions/org/opentravelmate/view/itinerary/itinerary-finder.html';
                document.getElementById(mainController.SIDE_PANEL_CONTENT_ELEMENT_ID).appendChild(iframe);

                $(iframe).load(function() {
                    var $iframeDocument = $(iframe.contentDocument);

                    self._initializePlaceCriteria('origin-place', $iframeDocument);
                    self._initializePlaceCriteria('destination-place', $iframeDocument);
                });
            });
        },

        /**
         * Initialize the origin or destination place criteria.
         *
         * @param {string} elementId
         * @param $iframeDocument
         */
        '_initializePlaceCriteria': function(elementId, $iframeDocument) {
            var self = this;
            var $placeInputElement = $iframeDocument.find('#' + elementId);
            var $suggestionsWrapperElement = $iframeDocument.find('#' + elementId + '-suggestions-wrapper');
            var $suggestionsWrapperUlElement = $iframeDocument.find('#' + elementId + '-suggestions-wrapper > ul');
            var $eraseButton = $iframeDocument.find('#' + elementId + '-erase-button');

            // Erase the content if the 'Erase' button is clicked
            $eraseButton.fastClick(function handleEraseButtonClick() {
                $placeInputElement.val('');
            });

            // Show the suggestions when the input field is focused on
            $placeInputElement.focusin(function handlePlaceInputFocusIn() {
                $suggestionsWrapperElement.show();
            });
            $placeInputElement.focusout(function handlePlaceInputFocusOut() {
                setTimeout(function() {
                    $suggestionsWrapperElement.hide();
                    $suggestionsWrapperUlElement.hide();
                }, 300);
            });

            // Show the suggestions when there are more than 3 characters
            $placeInputElement.keyup(function handlePlaceInputKeyUpEvent() {
                var query = $(this).val();
                if (!query || !query.length) { return; }
                if (query.length > 3) { self._suggestPlaces(elementId, query); }
            });

            // Handle suggestion click selection
            $suggestionsWrapperUlElement.fastClick(function handlePlaceSelection(event) {
                if (!event.target || !$(event.target).hasClass('suggested-place')) { return; }
                var suggestedPlace = self._suggestedPlacesByElementId[elementId][Number($(event.target).attr('data-place-index'))];
                if (!suggestedPlace.provider) { return; }
                $placeInputElement.val(suggestedPlace.name);
                /*suggestedPlace.provider.getPlaceDetails(suggestedPlace, function handlePlaceWithDetails(placeWithDetails) {
                    self._showFoundPlaces([placeWithDetails]);
                });*/
            });
        },

        /**
         * Query the place provider services to suggest places and update the suggestion list.
         *
         * @param {string} elementId
         * @param {string} query
         * @private
         */
        '_suggestPlaces': function(elementId, query) {
            var self = this;
            this._currentQueryByElementId[elementId] = query;
            this._suggestedPlacesByElementId[elementId] = [];

            /**
             * @param {string} originalQuery
             * @param {Array.<Place>} places
             */
            function handleSuggestedPlacesFromServices(originalQuery, places) {
                if (self._currentQueryByElementId[elementId] !== originalQuery) { return; }
                self._suggestedPlacesByElementId[elementId] = self._suggestedPlacesByElementId[elementId].concat(places);
                self._updateSuggestedPlacesView(elementId);
            }

            var placeProviderServices = placeProviderDirectoryService.getAllPlaceProviderServices();
            for (var i = 0; i < placeProviderServices.length; i++) {
                var placeProviderService = placeProviderServices[i];
                placeProviderService.suggestPlaces(query, handleSuggestedPlacesFromServices);
            }
        },

        /**
         * Update the HTMl document with the received places.
         *
         * @param {string} elementId
         * @private
         */
        '_updateSuggestedPlacesView': function(elementId) {
            var suggestedPlacesHtml = '';
            for (var i = 0; i < this._suggestedPlacesByElementId[elementId].length; i++) {
                var suggestedPlace = this._suggestedPlacesByElementId[elementId][i];
                suggestedPlacesHtml += '<li data-place-index="' + i + '" class="suggested-place">';
                suggestedPlacesHtml += suggestedPlace.name + '</li>\n';
            }

            var $iframeDocument = $(document.getElementById(PANEL_ID).contentDocument);
            $iframeDocument.find('#' + elementId + '-suggestions-wrapper > ul').show();
            $iframeDocument.find('#' + elementId + '-suggestions').html(suggestedPlacesHtml);
        }
    };

    return itineraryFinderController;
});