/**
 * Define the internal SubWebView controller.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'jquery',
    'underscore',
    '../../core/widget/webview/webview',
    './constants'
], function($, _, webview, constants) {
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

            console.log('lines: ' + JSON.stringify(lines) + '          directions: ' + JSON.stringify(directions));
        }
    };

    return internalController;
});
