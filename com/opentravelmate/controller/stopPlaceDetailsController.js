/**
 * Show the details of a stop.
 *
 * @author Marc Plouhinec
 */

define([
    'jquery',
    'lodash',
    '../../../org/opentravelmate/entity/Place',
    '../../../org/opentravelmate/controller/widget/webview/webview',
    '../../../org/opentravelmate/controller/dialog/DialogOptions',
    '../../../org/opentravelmate/controller/dialog/notificationController',
    '../service/stopService',
    '../service/routeService',
    'jqueryGoogleFastButton'
], function($, _, Place, webview, DialogOptions, notificationController, stopService, routeService) {

    /**
     * Show the details of a stop.
     */
    var stopPlaceDetailsController = {

        /**
         * Show the menu for the given place.
         *
         * @param {Place} place
         */
        'showPlaceDetails': function(place) {
            var self = this;
            var stopId = /** @type {string} */place.additionalParameters['stopId'];
            var mainController = require('extensions/org/opentravelmate/controller/main/mainController');
            mainController.openSidePanel(place.name);

            // Display basic information about the place
            var iframe = /** @type {HTMLIFrameElement} */document.createElement('iframe');
            iframe.style.position = 'absolute';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.src = webview.baseUrl + 'extensions/com/opentravelmate/view/stop-place-details.html';
            document.getElementById(mainController.SIDE_PANEL_CONTENT_ELEMENT_ID).appendChild(iframe);

            var stopRoutes = [];
            var iframeLoaded = false;
            $(iframe).load(function () {
                var $iframeDocument = $(iframe.contentDocument);
                self._setLoadingPanelVisible(true, $iframeDocument);
                if (stopRoutes.length) {
                    self._showRoutes(stopRoutes, $iframeDocument);
                    self._setLoadingPanelVisible(false, $iframeDocument);
                }
                iframeLoaded = true;
                var $scrollMarkerElement = $iframeDocument.find('#scroll-marker');
                var scrollMarkerElementXPosition = 0;

                // Show the timetable of a route if the user clicks on it
                $iframeDocument.find('ul#routes').fastClick(function handleRouteClick(event) {
                    if (!event.target || !$(event.target).hasClass('route')) { return; }
                    var routeId = $(event.target).attr('data-routeid');
                    self._showTimetable(routeId, stopId, $iframeDocument);

                    scrollMarkerElementXPosition = 0;
                });

                // Hide the timetable panel if the user clicks on the close button
                $iframeDocument.find('#close-timetable-panel-btn').fastClick(function handleCloseTimetablePanelClick(event) {
                    self._closeTimetablePanel($iframeDocument);
                });

                // Move the stop names when the page is scrolled horizontally
                $iframeDocument.find('#timetable-panel-body').scroll(function() {
                    var pageX = $scrollMarkerElement.offset().left;
                    if (pageX !== scrollMarkerElementXPosition) {
                        scrollMarkerElementXPosition = pageX;

                        $iframeDocument.find('.stop-name').each(function() {
                            $(this).css('left', (2 - pageX) + 'px');
                        });
                    }
                });
            });

            // Load the routes that goes through this stop
            stopService.findRoutesByStopId(stopId, function(error, routes) {
                if (error) {
                    notificationController.showMessage('Error: unable to find information about this stop', 5000, new DialogOptions({}));
                } else {
                    stopRoutes = routes;
                    if (iframeLoaded) {
                        var $iframeDocument = $(iframe.contentDocument);
                        self._showRoutes(stopRoutes, $iframeDocument);
                        self._setLoadingPanelVisible(false, $iframeDocument);
                    }
                }
            });
        },

        /**
         * Show the routes in the document.
         *
         * @param {Array.<Route>} routes
         * @param $iframeDocument
         */
        '_showRoutes': function(routes, $iframeDocument) {
            var templateRouteTableRow = _.template($iframeDocument.find('#tpl-route-table-row').text());
            var $routeList = $iframeDocument.find('#routes');

            // Sort the lines by their short names
            var routeWithLongestShortNameLength = _.max(routes, function(route) { return route.shortName ? route.shortName.length : 0; });
            var maxRouteShortNameLength = routeWithLongestShortNameLength['shortName'] ? routeWithLongestShortNameLength.shortName.length : 0;

            var sortedRoutes = _.sortBy(routes, function(route) {
                var paddingLength = maxRouteShortNameLength - route.shortName.length;
                var padding = paddingLength == 0 ? '' : new Array(paddingLength + 1).join(' ');
                return padding + route.shortName;
            });
            var routesHtml = '';
            _.each(sortedRoutes, function(route) {
                routesHtml += templateRouteTableRow({ route: route });
            });
            $routeList.html(routesHtml);
        },

        /**
         * Show the timetable for the given route ID.
         *
         * @param {string} routeId
         * @param {string} stopId
         * @param $iframeDocument
         */
        '_showTimetable': function(routeId, stopId, $iframeDocument) {
            var self = this;
            
            // Hide all routes but the selected one
            var $routeLiElement = null;
            $iframeDocument.find('li.route').each(function() {
                var currentRouteId = $(this).attr('data-routeid');
                if (currentRouteId !== routeId) {
                    $(this).hide();
                } else {
                    $routeLiElement = $(this);
                }
            });

            // Show the timetable panel
            var $timetablePanelElement = $iframeDocument.find('#timetable-panel');
            var $timetablePanelBodyContentElement = $iframeDocument.find('#timetable-panel-body-content');
            $timetablePanelElement.css('top', $iframeDocument.find('ul#routes').height() + 'px');
            $timetablePanelBodyContentElement.html('');
            $timetablePanelElement.show();

            // Load the timetables
            this._setLoadingPanelVisible(true, $iframeDocument);
            routeService.findTimetablesByRouteId(routeId, function(error, timetables) {
                self._setLoadingPanelVisible(false, $iframeDocument);
                if (error) {
                    notificationController.showMessage('Error: unable to find information about this stop', 5000, new DialogOptions({}));
                    return;
                }

                var templateTimetable = _.template($iframeDocument.find('#tpl-timetable').text());
                var timetablePanelBodyContent = '';
                _.each(timetables, function (timetable) {
                    timetablePanelBodyContent += templateTimetable({
                        timetable: timetable,
                        stopIdToHighlight: stopId
                    });
                });
                $timetablePanelBodyContentElement.html(timetablePanelBodyContent);
            });
        },

        /**
         * Close the timetable panel.
         *
         * @param $iframeDocument
         */
        '_closeTimetablePanel': function($iframeDocument) {
            // Just before hiding it, reset the scroll position of the timetable panel body
            var $timetablePanelBodyElement = $iframeDocument.find('#timetable-panel-body');
            $timetablePanelBodyElement.scrollLeft(0);
            $timetablePanelBodyElement.scrollTop(0);

            // Hide the timetable panel
            $iframeDocument.find('#timetable-panel').hide();

            // Show all routes
            $iframeDocument.find('li.route').each(function() {
                $(this).show();
            });
        },

        /**
         * Show or hide the loading panel.
         *
         * @param {boolean} visible
         * @param $iframeDocument
         */
        '_setLoadingPanelVisible': function(visible, $iframeDocument) {
            if (visible) {
                $iframeDocument.find('#loading-panel-mask').show();
                $iframeDocument.find('#loading-panel').show();
            } else {
                $iframeDocument.find('#loading-panel-mask').hide();
                $iframeDocument.find('#loading-panel').hide();
            }
        }

    };

    return stopPlaceDetailsController;
});