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
    '../dialog/DialogOptions',
    '../dialog/notificationController',
    '../../entity/Place',
    '../../service/placeProviderDirectoryService',
    '../../entity/geolocation/PositionOptions',
    '../../entity/geolocation/PositionError',
    '../../service/geolocationService',
    '../../entity/itinerary/Itinerary',
    '../../service/itineraryProviderDirectoryService',
    './itineraryDetailsController',
    '../map/mapItineraryController',
    'jqueryGoogleFastButton'
], function($, _, moment, webview, menuController, DialogOptions, notificationController, Place, placeProviderDirectoryService,
            PositionOptions, PositionError, geolocationService, Itinerary, itineraryProviderDirectoryService,
            itineraryDetailsController, mapItineraryController) {
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

    var CURRENT_POSITION_MAX_WATCH_TIME = 20 * 1000;
    var CURRENT_POSITION_MAX_POSITION_AGE = 1000 * 60 * 2;
    var CURRENT_POSITION_ACCEPTABLE_ACCURACY = 200;

    /**
     * Controller for the menu.
     */
    var itineraryFinderController = {

        /**
         * @private
         * @type {mainController}
         */
        '_mainController': null,

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
         * @private
         * @type {Place}
         */
        '_originPlace': null,

        /**
         * @private
         * @type {Place}
         */
        '_destinationPlace': null,

        /**
         * @private
         * @type {Array.<Itinerary>}
         */
        '_foundItineraries': [],

        /**
         * @private
         * @type {Itinerary}
         */
        '_selectedItinerary': null,

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
                self.openItineraryFinder();
            });
        },

        /**
         * Open the itinerary finder with an optional origin place or an optional destination place.
         *
         * @param {Place=} originPlace
         * @param {Place=} destinationPlace
         */
        'openItineraryFinder': function(originPlace, destinationPlace) {
            var self = this;
            if (originPlace) { this._originPlace = originPlace; }
            if (destinationPlace) { this._destinationPlace = destinationPlace; }

            // Check if the panel is not already opened
            if (document.getElementById(PANEL_ID)) {
                var $iframeDocument = $(document.getElementById(PANEL_ID).contentDocument);

                // Show the origin or destination place if provided
                if (originPlace) { $iframeDocument.find('#origin-place').val(originPlace.name); }
                if (destinationPlace) { $iframeDocument.find('#destination-place').val(destinationPlace.name); }

                // Maximize the panel if necessary
                self._mainController.setSidePanelMaximized(true);

                // Do not re-initialize the panel
                return;
            }

            // Show a form for the user to find an itinerary
            this._mainController.openSidePanel(MENU_ITEM_TOOLTIP, function handleSidePanelClosedEvent() {
                self._clearItineraryDetails();
            });

            var iframe = /** @type {HTMLIFrameElement} */document.createElement('iframe');
            iframe.setAttribute('id', PANEL_ID);
            iframe.style.position = 'absolute';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.src = webview.baseUrl + 'extensions/org/opentravelmate/view/itinerary/itinerary-finder.html';
            document.getElementById(this._mainController.SIDE_PANEL_CONTENT_ELEMENT_ID).appendChild(iframe);

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
                $iframeDocument.find('#datetime-select').click(function handleDateTimeSelection(event) {
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

                // Handle the user click on the search button
                $iframeDocument.find('#find-button').fastClick(function handleFindItineraryClick() {
                    self._findItineraries();
                });

                // Handle user click on an itinerary
                var $foundItinerariesTableBody = $iframeDocument.find('#found-itineraries-table-body');
                $foundItinerariesTableBody.fastClick(function handleItineraryClick(event) {
                    // Find the clicked itinerary
                    var $itineraryElement = $(event.target);
                    while (!$itineraryElement.hasClass('itinerary-info')) {
                        $itineraryElement = $itineraryElement.parent();
                    }
                    var itineraryIndex = Number($itineraryElement.attr('data-itinerary-index'));
                    var itinerary = self._foundItineraries[itineraryIndex];
                    self._selectedItinerary = itinerary;

                    // Highlight the selected itinerary
                    $foundItinerariesTableBody.find('.highlighted-itinerary').removeClass('highlighted-itinerary');
                    $itineraryElement.addClass('highlighted-itinerary');

                    // Show the details
                    itineraryDetailsController.showItineraryDetails(itinerary);
                    mapItineraryController.showItinerary(itinerary);

                    // Minimize the panel on small screen
                    if (!self._mainController.isWideScreen()) {
                        self._mainController.setSidePanelMaximized(false);
                    }
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

            // If available, show the place name
            if (elementId === 'origin-place' && this._originPlace) {
                $placeInputElement.val(this._originPlace.name);
            } else if (elementId === 'destination-place' && this._destinationPlace) {
                $placeInputElement.val(this._destinationPlace.name);
            }

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
                if (query.length > 2) { self._suggestPlaces(elementId, query); }
            });

            // Handle suggestion click selection
            $suggestionsWrapperUlElement.fastClick(function handlePlaceSelection(event) {
                if (!event.target || !$(event.target).hasClass('suggested-place')) { return; }
                var suggestedPlace = self._suggestedPlacesByElementId[elementId][Number($(event.target).attr('data-place-index'))];
                if (!suggestedPlace.provider) { return; }

                $iframeDocument.find('#searching-panel-mask').show();
                $iframeDocument.find('#searching-panel').show();
                suggestedPlace.provider.getPlaceDetails(suggestedPlace, function handlePlaceWithDetails(placeWithDetails) {
                    $iframeDocument.find('#searching-panel-mask').hide();
                    $iframeDocument.find('#searching-panel').hide();
                    $placeInputElement.val(suggestedPlace.name);

                    if (elementId === 'origin-place') {
                        self._originPlace = placeWithDetails;
                    } else {
                        self._destinationPlace = placeWithDetails;
                    }
                });
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
        },

        /**
         * Method called when the user has clicked on the search button.
         */
        '_findItineraries': function() {
            var self = this;

            // Show an error if the destination place is empty
            if (!this._destinationPlace) {
                notificationController.showMessage('Please select a destination.', 2000, new DialogOptions({
                    height: 100
                }));
                return;
            }

            // If no origin is set, take the current position
            if (!this._originPlace) {
                this._findCurrentPlace(function handleFoundCurrentPlace(currentPlace) {
                    self._originPlace = currentPlace;
                    self._findItineraries();
                });
                return;
            }

            // Get the itinerary time
            var $iframeDocument = $(document.getElementById(PANEL_ID).contentDocument);
            var year = $iframeDocument.find('#itinerary-year').text();
            var month = $iframeDocument.find('#itinerary-month').text();
            var day = $iframeDocument.find('#itinerary-day').text();
            var time = $iframeDocument.find('#itinerary-time').text();
            var dateTime = moment(year + '-' + month + '-' + day + ' ' + time, 'YYYY-MM-DD HH:mm').format();

            // Show the itineraries
            $iframeDocument.find('#searching-panel-mask').show();
            $iframeDocument.find('#searching-panel').show();
            this._foundItineraries = [];
            var itineraryProviderServices = itineraryProviderDirectoryService.getAllItineraryProviderServices();
            var nbItineraryProviderServicesToWait = itineraryProviderServices.length;
            function handleFoundItineraries(itineraries) {
                nbItineraryProviderServicesToWait--;
                self._foundItineraries = self._foundItineraries.concat(itineraries);

                if (nbItineraryProviderServicesToWait === 0) {
                    $iframeDocument.find('#searching-panel-mask').hide();
                    $iframeDocument.find('#searching-panel').hide();
                    self._showFoundItineraries();
                }
            }
            for (var i = 0; i < itineraryProviderServices.length; i++) {
                var itineraryProviderService = itineraryProviderServices[i];
                itineraryProviderService.findItineraries(this._originPlace, this._destinationPlace, dateTime, true, handleFoundItineraries);
            }
        },

        /**
         * Find the current position and convert it into a Place.
         *
         * @param {function(place: Place)} callback
         */
        '_findCurrentPlace': function(callback) {
            var options = new PositionOptions({
                enableHighAccuracy: true,
                timeout: CURRENT_POSITION_MAX_WATCH_TIME,
                maximumAge: CURRENT_POSITION_MAX_POSITION_AGE,
                acceptableAccuracy: CURRENT_POSITION_ACCEPTABLE_ACCURACY,
                maxWatchTime: CURRENT_POSITION_MAX_WATCH_TIME
            });
            var $iframeDocument = $(document.getElementById(PANEL_ID).contentDocument);
            $iframeDocument.find('#searching-panel-mask').show();
            $iframeDocument.find('#searching-panel').show();
            geolocationService.watchPosition(function handlePosition(position, hasMore) {
                if (!hasMore) {
                    $iframeDocument.find('#searching-panel-mask').hide();
                    $iframeDocument.find('#searching-panel').hide();
                    callback(new Place({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        name: 'Current Position',
                        additionalParameters: {
                            altitude: position.coords.altitude,
                            accuracy: position.coords.accuracy,
                            altitudeAccuracy: position.coords.altitudeAccuracy,
                            heading: position.coords.heading,
                            speed: position.coords.speed,
                            timestamp: position.timestamp
                        }
                    }));
                }
            }, function handleError(positionError) {
                $iframeDocument.find('#searching-panel-mask').hide();
                $iframeDocument.find('#searching-panel').hide();
                var message = 'Error: unable to get your position.';
                switch (positionError.code) {
                    case PositionError.PERMISSION_DENIED:
                        message = 'Error: unable to get your position: PERMISSION_DENIED.';
                        break;
                    case PositionError.POSITION_UNAVAILABLE:
                        message = 'Error: unable to get your position: POSITION_UNAVAILABLE.';
                        break;
                    case PositionError.TIMEOUT:
                        message = 'Error: unable to get your position: TIMEOUT.';
                        break;
                }
                console.log(message + ' ' + positionError.message);
                notificationController.showMessage(message, 5000, new DialogOptions({}));
            }, options);
        },

        /**
         * Show the found itineraries.
         */
        '_showFoundItineraries': function() {
            var $iframeDocument = $(document.getElementById(PANEL_ID).contentDocument);
            var templateItineraryInfo = _.template($iframeDocument.find('#tpl-itinerary-info').text());
            var foundItinerariesHtml = '';

            for (var i = 0; i < this._foundItineraries.length; i++) {
                var foundItinerary = this._foundItineraries[i];
                foundItinerariesHtml += templateItineraryInfo({
                    itineraryIndex: i,
                    departureTime: moment(foundItinerary.startDateTime).format('HH:mm'),
                    arrivalTime: moment(foundItinerary.endDateTime).format('HH:mm'),
                    legs: _.map(foundItinerary.legs, function(leg) {
                        return { type: leg.routeType === 0 ? 'walk' : 'bus', title: leg.routeShortName };
                    }),
                    duration: moment.duration(foundItinerary.durationSecond, 'seconds').minutes() + 'min'
                });
            }

            $iframeDocument.find('#found-itineraries-panel').show();
            $iframeDocument.find('#found-itineraries-table-body').html(foundItinerariesHtml);
        },

        /**
         * Clear the details of the selected itinerary.
         */
        '_clearItineraryDetails': function() {
            if (!this._selectedItinerary) { return; }
            this._selectedItinerary = null;

            itineraryDetailsController.clearItineraryDetails();
            mapItineraryController.clearItinerary();
        }
    };

    return itineraryFinderController;
});