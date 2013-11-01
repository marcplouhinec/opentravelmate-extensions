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
        '_templateLineTableRow': null,

        /**
         * Initialize the SubWebView.
         */
        'initWebView': function() {
            var self = this;
            this._templateLineTableRow = _.template($('#tpl-line-table-row').text());

            // Listen to the PLACE DATA LOADED event
            webview.onExternalEvent(constants.PLACE_DATA_LOADED_EVENT, function(payload) {
                if (payload.error) {
                    // TODO show error
                } else {
                    self._showLines(payload.lines, payload.directions);
                    self._listenToTimetableButtons();
                }
            });
        },

        /**
         * Show lines on the panel.
         *
         * @private
         * @param {Array.<Line>} lines
         * @param {Array.Waypoint} directions
         */
        '_showLines': function(lines, directions) {
            var self = this;
            var $lineTable = $('#line-table');
            var directionById = _.indexBy(directions, 'id');

            _.each(lines, function(line) {
                $lineTable.append(self._templateLineTableRow({
                    line: line,
                    directionById: directionById
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
                        lineId: buttonElement.getAttribute('data-lineid'),
                        direction1Id: buttonElement.getAttribute('data-direction1id'),
                        direction2Id: buttonElement.getAttribute('data-direction2id')
                    };
                    webview.fireExternalEvent(constants.SHOW_TIMETABLE_EVENT, payload);
                });
            });
        }
    };

    return internalController;
});
