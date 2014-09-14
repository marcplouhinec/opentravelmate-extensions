/**
 * Define the internal SubWebView controller.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'jquery',
    'underscore',
    'googleFastButton',
    '../../core/widget/webview/webview',
    './constants'
], function($, _, FastButton, webview, constants) {
    'use strict';

    var internalController = {

        /**
         * @type {Function}
         * @private
         */
        '_templateRouteTableRow': null,

        /**
         * Initialize the SubWebView.
         */
        'initWebView': function() {
            var self = this;
            this._templateRouteTableRow = _.template($('#tpl-route-table-row').text());

            // Listen to the PLACE DATA LOADED event
            webview.onExternalEvent(constants.PLACE_DATA_LOADED_EVENT, function(payload) {
                if (payload.error) {
                    // TODO show error
                } else {
                    self._showRoutes(payload.routes);
                    self._listenToTimetableButtons();
                }
            });
        },

        /**
         * Show lines on the panel.
         *
         * @private
         * @param {Array.<Route>} routes
         */
        '_showRoutes': function(routes) {
            var self = this;
            var $routeTable = $('#route-table');

            // Sort the lines by their short names
            var routeWithLongestShortNameLength = _.max(routes, function(route) { return route.shortName ? route.shortName.length : 0; });
            var maxRouteShortNameLength = routeWithLongestShortNameLength ? routeWithLongestShortNameLength.shortName.length : 0;

            var sortedRoutes = _.sortBy(routes, function(route) {
                var paddingLength = maxRouteShortNameLength - route.shortName.length;
                var padding = paddingLength == 0 ? '' : new Array(paddingLength + 1).join(' ');
                return padding + route.shortName;
            });
            _.each(sortedRoutes, function(route) {
                $routeTable.append(self._templateRouteTableRow({
                    route: route
                }));
            });
        },

        /**
         * Listen to the timetable buttons and send the event externally.
         */
        '_listenToTimetableButtons': function() {
            $('.timetable-btn').each(function() {
                var buttonElement = $(this).get(0);
                new FastButton(buttonElement, function() {
                    var payload = {
                        routeId: buttonElement.getAttribute('data-routeid')
                    };
                    webview.fireExternalEvent(constants.SHOW_TIMETABLE_EVENT, payload);
                });
            });
        }
    };

    return internalController;
});
