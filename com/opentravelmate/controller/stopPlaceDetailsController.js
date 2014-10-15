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
    '../service/stopService'
], function($, _, Place, webview, DialogOptions, notificationController, stopService) {

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
                if (stopRoutes.length) {
                    self._showRoutes(stopRoutes, $(iframe.contentDocument));
                }
                iframeLoaded = true;
            });

            // Load the routes that goes through this stop
            var stopId = /** @type {string} */place.additionalParameters['stopId'];
            stopService.findRoutesByStopId(stopId, function(error, routes) {
                if (error) {
                    notificationController.showMessage('Error: unable to find information about this stop', 5000, new DialogOptions({}))
                } else {
                    stopRoutes = routes;
                    if (iframeLoaded) {
                        self._showRoutes(stopRoutes, $(iframe.contentDocument));
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
            var $routeTable = $iframeDocument.find('#route-table');

            // Sort the lines by their short names
            var routeWithLongestShortNameLength = _.max(routes, function(route) { return route.shortName ? route.shortName.length : 0; });
            var maxRouteShortNameLength = routeWithLongestShortNameLength['shortName'] ? routeWithLongestShortNameLength.shortName.length : 0;

            var sortedRoutes = _.sortBy(routes, function(route) {
                var paddingLength = maxRouteShortNameLength - route.shortName.length;
                var padding = paddingLength == 0 ? '' : new Array(paddingLength + 1).join(' ');
                return padding + route.shortName;
            });
            _.each(sortedRoutes, function(route) {
                $routeTable.append(templateRouteTableRow({
                    route: route
                }));
            });
        }

    };

    return stopPlaceDetailsController;
});