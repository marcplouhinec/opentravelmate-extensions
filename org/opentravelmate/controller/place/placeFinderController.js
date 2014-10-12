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

    var PANEL_ID = 'place-finder-panel';
    var MENU_ITEM_TITLE = 'Find place';
    var MENU_ITEM_TOOLTIP = 'Find a place';
    var MENU_ITEM_ICONURL = 'extensions/org/opentravelmate/view/place/image/ic_btn_find_place.png';

    /**
     * Controller for the menu.
     */
    var placeFinderController = {

        /**
         * @type {mainController}
         * @private
         */
        '_mainController': null,

        /**
         * @type {string}
         * @private
         */
        '_currentQuery': null,

        /**
         * @type {Array.<Place>}
         * @private
         */
        '_suggestedPlaces': [],

        /**
         * Initialization.
         *
         * @param {mainController} mainController
         */
        'init': function (mainController) {
            var self = this;
            this._mainController = mainController;

            // Create a menu item
            menuController.addMenuItem(MENU_ITEM_TITLE, MENU_ITEM_TOOLTIP, webview.baseUrl + MENU_ITEM_ICONURL, function handleMenuItemSelection() {
                if (document.getElementById(PANEL_ID)) { return; }

                // Show a form for the user to find a place
                mainController.openSidePanel(MENU_ITEM_TOOLTIP);

                var iframe = /** @type {HTMLIFrameElement} */document.createElement('iframe');
                iframe.setAttribute('id', PANEL_ID);
                iframe.style.position = 'absolute';
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.border = 'none';
                iframe.src = webview.baseUrl + 'extensions/org/opentravelmate/view/place/place-finder.html';
                document.getElementById(mainController.SIDE_PANEL_CONTENT_ELEMENT_ID).appendChild(iframe);

                var iframeInitialized = false;
                $(iframe).load(function() {
                    if (iframeInitialized) { return; }
                    iframeInitialized = true;
                    var $iframeDoc = $(iframe.contentDocument);

                    // Show the place on the map if the user select it
                    $iframeDoc.find('#suggested-places').fastClick(function handlePlaceSelection(event) {
                        if (!event.target || !$(event.target).hasClass('suggested-place')) { return; }
                        var suggestedPlace = self._suggestedPlaces[Number($(event.target).attr('data-place-index'))];
                        // TODO
                        console.log(suggestedPlace.name);
                    });

                    // Erase the place query when the user clicks on the erase button
                    $iframeDoc.find('#erase-button').fastClick(function handleEraseQueryClick() {
                        $iframeDoc.find('#place-query').val('');
                    });

                    // Suggest some places when the user has written more than 3 characters
                    $iframeDoc.find('#place-query').keyup(function() {
                        var query = $(this).val();
                        if (query && query.length > 3) { self._suggestPlaces(query); }
                    });

                    // Show several places on a map if the user click on search or push ENTER
                    // TODO
                });
            })
        },

        /**
         * Query the place provider services to suggest places and update the suggestion list.
         *
         * @param {string} query
         * @private
         */
        '_suggestPlaces': function(query) {
            var self = this;
            this._currentQuery = query;
            this._suggestedPlaces = [];

            /**
             * @param {string} originalQuery
             * @param {Array.<Place>} places
             */
            function handleSuggestedPlacesFromServices(originalQuery, places) {
                if (self._currentQuery !== originalQuery) { return; }
                self._suggestedPlaces = self._suggestedPlaces.concat(places);
                self._updateSuggestedPlacesView();
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
         * @private
         */
        '_updateSuggestedPlacesView': function() {
            var suggestedPlacesHtml = '';
            for (var i = 0; i < this._suggestedPlaces.length; i++) {
                var suggestedPlace = this._suggestedPlaces[i];
                suggestedPlacesHtml += '<li data-place-index="' + i + '" class="suggested-place">';
                suggestedPlacesHtml += suggestedPlace.name + '</li>\n';
            }

            var $iframeDoc = $(document.getElementById(PANEL_ID).contentDocument);
            $iframeDoc.find('#suggested-places').html(suggestedPlacesHtml);
        }
    };

    return placeFinderController;
});