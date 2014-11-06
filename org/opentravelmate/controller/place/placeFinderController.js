/**
 * Controller for the place finder.
 *
 * @author Marc Plouhinec
 */

define([
    'jquery',
    '../widget/Widget',
    '../widget/webview/webview',
    '../widget/map/LatLng',
    '../widget/map/Marker',
    '../widget/map/Map',
    '../main/menuController',
    '../../entity/Place',
    '../../service/placeProviderDirectoryService',
    './placeSelectionMenuController',
    'jqueryGoogleFastButton'
], function($, Widget, webview, LatLng, Marker, Map, menuController, Place, placeProviderDirectoryService, placeSelectionMenuController) {
    'use strict';

    var PANEL_ID = 'place-finder-panel';
    var MENU_ITEM_TITLE = 'Find place';
    var MENU_ITEM_TOOLTIP = 'Find a place';
    var MENU_ITEM_ICONURL = 'extensions/org/opentravelmate/view/common/image/ic_btn_find.png';
    var ENTER_KEYCODE = 13;
    var MAX_INFOWINDOW_TITLE_LENGTH = 20;

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
         * @type {Array.<Place>}
         * @private
         */
        '_foundPlaces': [],

        /**
         * @type {Array.<Marker>}
         * @private
         */
        '_placeMarkers': [],

        /**
         * @type {Object.<string, Place>}
         * @private
         */
        '_placeByMarkerId': {},

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
                mainController.openSidePanel(MENU_ITEM_TOOLTIP, function handleSidePanelClosedEvent() {
                    self._clearFoundPlaces();
                });

                var iframe = /** @type {HTMLIFrameElement} */document.createElement('iframe');
                iframe.setAttribute('id', PANEL_ID);
                iframe.style.position = 'absolute';
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.border = 'none';
                iframe.src = webview.baseUrl + 'extensions/org/opentravelmate/view/place/place-finder.html';
                document.getElementById(mainController.SIDE_PANEL_CONTENT_ELEMENT_ID).appendChild(iframe);

                $(iframe).load(function() {
                    var $iframeDoc = $(iframe.contentDocument);

                    // Show the place on the map if the user select it
                    $iframeDoc.find('#suggested-places').fastClick(function handlePlaceSelection(event) {
                        if (!event.target || !$(event.target).hasClass('suggested-place')) { return; }
                        var suggestedPlace = self._suggestedPlaces[Number($(event.target).attr('data-place-index'))];
                        if (!suggestedPlace.provider) { return; }
                        suggestedPlace.provider.getPlaceDetails(suggestedPlace, function handlePlaceWithDetails(placeWithDetails) {
                            self._showFoundPlaces([placeWithDetails]);
                        });
                    });

                    // Erase the place query when the user clicks on the erase button
                    $iframeDoc.find('#erase-button').fastClick(function handleEraseQueryClick() {
                        $iframeDoc.find('#place-query').val('');
                    });

                    // Suggest some places when the user has written more than 3 characters
                    $iframeDoc.find('#place-query').keyup(function handlePlaceQueryKeyUpEvent(event) {
                        var query = $(this).val();
                        if (!query || !query.length) { return; }
                        if (event.keyCode === ENTER_KEYCODE) { self._findPlaces(query); }
                        else if (query.length > 2) { self._suggestPlaces(query); }
                    });

                    // Show several places on a map if the user click on search or push ENTER
                    $iframeDoc.find('#find-button').fastClick(function() {
                        var query = $iframeDoc.find('#place-query').val();
                        if (query && query.length > 0) { self._findPlaces(query); }
                    });
                });
            });

            Widget.findByIdAsync('map', 10000, function(/** @type {Map} */map) {

                // Show an info window when the user clicks on a marker
                map.onMarkerClick(function handlePlaceMarkerClick(marker) {
                    var place = self._placeByMarkerId[marker.id];
                    if (!place) { return; }

                    var placeName = place.name;
                    if (placeName.length > MAX_INFOWINDOW_TITLE_LENGTH) {
                        placeName = placeName.substring(0, MAX_INFOWINDOW_TITLE_LENGTH) + '...';
                    }
                    map.showInfoWindow(marker, placeName);
                });

                // Open the place selection menu when the user click on the info window
                map.onInfoWindowClick(function handlePlaceInfoWindowClick(marker) {
                    var place = self._placeByMarkerId[marker.id];
                    if (!place) { return; }

                    placeSelectionMenuController.showMenu(place);
                    map.closeInfoWindow();
                });
            });
        },

        /**
         * Find the places corresponding to the given query.
         *
         * @param {string} query
         * @private
         */
        '_findPlaces': function(query) {
            var self = this;
            this._currentQuery = query;
            this._foundPlaces = [];
            var $iframeDoc = $(document.getElementById(PANEL_ID).contentDocument);

            /**
             * @param {string} originalQuery
             * @param {Array.<Place>} places
             */
            function handleFoundPlacesFromServices(originalQuery, places) {
                if (self._currentQuery !== originalQuery) { return; }
                self._foundPlaces = self._foundPlaces.concat(places);
                self._showFoundPlaces(self._foundPlaces);

                $iframeDoc.find('#searching-panel-mask').css('display', 'none');
                $iframeDoc.find('#searching-panel').css('display', 'none');
            }

            $iframeDoc.find('#searching-panel-mask').css('display', 'block');
            $iframeDoc.find('#searching-panel').css('display', 'block');
            var placeProviderServices = placeProviderDirectoryService.getAllPlaceProviderServices();
            for (var i = 0; i < placeProviderServices.length; i++) {
                var placeProviderService = placeProviderServices[i];
                placeProviderService.findPlaces(query, handleFoundPlacesFromServices);
            }
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
        },

        /**
         * Show found places on the map.
         *
         * @param {Array.<Place>} places
         * @private
         */
        '_showFoundPlaces': function(places) {
            if (!places || !places.length) { return; }

            // Clear the previous search
            this._clearFoundPlaces();

            // Create a marker per place
            var map  = /** @Type {Map} */ Widget.findById('map');
            this._placeMarkers = /** @Type {Array.<Marker>} */ [];
            for (var i = 0; i < places.length; i++) {
                var place = places[i];
                var marker = new Marker({
                    position: new LatLng(place.latitude, place.longitude),
                    title: place.name
                });
                this._placeMarkers.push(marker);
                this._placeByMarkerId[marker.id] = place;
            }
            map.addMarkers(this._placeMarkers);

            // Move the map to the first place
            map.panTo(new LatLng(places[0].latitude, places[0].longitude));

            // Minimize the panel on small screen
            if (!this._mainController.isWideScreen()) {
                this._mainController.setSidePanelMaximized(false);
            }
        },

        /**
         * Remove the marker and places from the previous place search.
         *
         * @private
         */
        '_clearFoundPlaces': function() {
            var map  = /** @Type {Map} */ Widget.findById('map');
            map.removeMarkers(this._placeMarkers);
            this._placeMarkers = [];
            this._placeByMarkerId = {};
            this._foundPlaces = [];
        }
    };

    return placeFinderController;
});