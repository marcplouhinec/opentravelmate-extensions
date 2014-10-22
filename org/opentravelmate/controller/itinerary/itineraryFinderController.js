/**
 * Controller for the place finder.
 *
 * @author Marc Plouhinec
 */

define([
    'jquery',
    'lodash',
    'moment',
    '../widget/webview/webview',
    '../main/menuController',
    '../../entity/Place',
    '../../service/placeProviderDirectoryService',
    'jqueryGoogleFastButton'
], function($, _, moment, webview, menuController, Place, placeProviderDirectoryService) {
    'use strict';

    var PANEL_ID = 'itinerary-finder-panel';
    var MENU_ITEM_TITLE = 'Find itinerary';
    var MENU_ITEM_TOOLTIP = 'Find an itinerary';
    var MENU_ITEM_ICONURL = 'extensions/org/opentravelmate/view/itinerary/image/itinerary.png';

    var YEAR_SUGGESTIONS = /** @type {Array.<string>} */[];
    var MONTH_SUGGESTIONS = /** @type {Array.<string>} */[];
    var DAY_SUGGESTIONS = /** @type {Array.<string>} */[];
    var TIME_SUGGESTIONS = /** @type {Array.<string>} */[];
    (function() {
        var currentYear = moment().year();
        for (var y = currentYear - 5; y < currentYear + 6; y++) {
            YEAR_SUGGESTIONS.push(String(y));
        }
        for (var mo = 1; mo < 13; mo++) {
            MONTH_SUGGESTIONS.push(mo < 10 ? '0' + mo : String(mo));
        }
        for (var d = 1; d < 32; d++) {
            DAY_SUGGESTIONS.push(d < 10 ? '0' + d : String(d));
        }
        for (var h = 0; h < 24; h++) {
            for (var m = 0; m < 60; m += 10) {
                var hour = h < 10 ? '0' + h : String(h);
                var minute = m < 10 ? '0' + m : String(m);
                TIME_SUGGESTIONS.push(hour + ':' + minute);
            }
        }
    })();

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

                    // Initialize the place criterion
                    self._initializePlaceCriteria('origin-place', $iframeDocument);
                    self._initializePlaceCriteria('destination-place', $iframeDocument);

                    //
                    // Initialize the date and time criterion
                    //
                    var $datetimeSelectWrapper = $iframeDocument.find('#datetime-select-wrapper');
                    var $dateTimeButtons = $iframeDocument.find('#itinerary-datetime-wrapper > button');
                    var $itineraryYear = $iframeDocument.find('#itinerary-year');
                    var $itineraryMonth = $iframeDocument.find('#itinerary-month');
                    var $itineraryDay = $iframeDocument.find('#itinerary-day');
                    var $itineraryTime = $iframeDocument.find('#itinerary-time');

                    // Set the current date and time
                    $itineraryYear.text(moment().format('YYYY'));
                    $itineraryMonth.text(moment().format('MM'));
                    $itineraryDay.text(moment().format('DD'));
                    $itineraryTime.text(moment().format('HH:mm'));

                    // Handle date time change
                    $dateTimeButtons.fastClick(function handleDateTimeClick() {
                        var $dateTimeElement = $(this);
                        var year = $itineraryYear.text();
                        var month = $itineraryMonth.text();
                        var day = $itineraryDay.text();
                        var time = $itineraryTime.text();

                        // Highlight the selected element
                        $dateTimeButtons.removeClass('active');
                        $(this).addClass('active');

                        // Show the date time selection panel when the user click on a date time button
                        var dateTimeElementId = $dateTimeElement.attr('id');
                        switch (dateTimeElementId) {
                            case 'itinerary-year':
                                self._openDateTimeSelect(YEAR_SUGGESTIONS, year);
                                break;
                            case 'itinerary-month':
                                self._openDateTimeSelect(MONTH_SUGGESTIONS, month);
                                break;
                            case 'itinerary-day':
                                self._openDateTimeSelect(DAY_SUGGESTIONS, day);
                                break;
                            case 'itinerary-time':
                                var dateTime = moment(time, 'HH:mm');
                                var hours = dateTime.hours();
                                var minutes = dateTime.minutes();
                                var roundedDateTime = (hours < 10 ? '0' + hours : hours) + ':' + (minutes === 0 ? '00' : Math.floor(minutes / 10) * 10);
                                self._openDateTimeSelect(TIME_SUGGESTIONS, roundedDateTime);
                                break;
                        }
                    });

                    // Handle the user click on the date time selection panel
                    $iframeDocument.find('#datetime-select').fastClick(function handleDateTimeSelection(event) {
                        // Find the date time element type and the value
                        var $activeButton = $iframeDocument.find('#itinerary-datetime-wrapper > button.active');
                        var dateTimeElementId = $activeButton.attr('id');
                        var dateTimeElementValue = $(event.target).text();

                        // Update the button value
                        if (dateTimeElementId === 'itinerary-time') {
                            $itineraryTime.text(dateTimeElementValue);
                        } else {
                            var year = dateTimeElementId === 'itinerary-year' ? dateTimeElementValue : $itineraryYear.text();
                            var month = dateTimeElementId === 'itinerary-month' ? dateTimeElementValue : $itineraryMonth.text();
                            var day = dateTimeElementId === 'itinerary-day' ? dateTimeElementValue : $itineraryDay.text();
                            var dateTime = moment(year + '-' + month + '-' + day, 'YYYY-MM-DD');
                            var monthAsNumber = dateTime.month() + 1;
                            var dayAsNumber = dateTime.date();
                            $itineraryYear.text(dateTime.year());
                            $itineraryMonth.text(monthAsNumber < 10 ? '0' + monthAsNumber : monthAsNumber);
                            $itineraryDay.text(dayAsNumber < 10 ? '0' + dayAsNumber : dayAsNumber);
                        }

                        // Hide the selection panel and un-highlight the selected button
                        $datetimeSelectWrapper.hide();
                        $dateTimeButtons.removeClass('active');
                    });
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
        },

        /**
         * Open the date time selection.
         *
         * @param {Array.<string>} values
         * @param {string} currentValue
         */
        '_openDateTimeSelect': function(values, currentValue) {
            var selectContentHtml = '';
            var indexCurrentValue = 0;
            for (var i = 0; i < values.length; i++) {
                var value = values[i];
                if (value === currentValue) {
                    indexCurrentValue = i;
                }
                selectContentHtml += '<li' + (value === currentValue ? ' class="active">' : '>') + value + '</li>';
            }
            var $iframeDocument = $(document.getElementById(PANEL_ID).contentDocument);
            var $datetimeSelect = $iframeDocument.find('#datetime-select');
            var $datetimeSelectWrapper = $iframeDocument.find('#datetime-select-wrapper');
            $datetimeSelect.html(selectContentHtml);
            $datetimeSelectWrapper.show();
            $datetimeSelectWrapper.animate({ scrollTop: 45 * (indexCurrentValue - 1) }, 150);
        }
    };

    return itineraryFinderController;
});