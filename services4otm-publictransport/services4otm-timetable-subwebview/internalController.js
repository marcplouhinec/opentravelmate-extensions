/**
 * Define the internal SubWebView controller.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'underscore',
    'googleFastButton',
    '../../core/widget/webview/webview',
    '../../core/utils/browserUtils',
    './constants'
], function(_, FastButton, webview, browserUtils, constants) {
    'use strict';

    var internalController = {
        /**
         * Initialize the SubWebView.
         */
        'initWebView': function() {
            // Parse the sub web view parameters
            var lineName = /** @type {String} */ webview.additionalParameters['linename'];
            var direction1StopName = /** @type {String} */ webview.additionalParameters['direction1stopname'];
            var direction2StopName = /** @type {String} */ webview.additionalParameters['direction2stopname'];
            var periods = /** @type {Array.<TimetablePeriod>} */ JSON.parse(webview.additionalParameters['periods']);
            var timetables = /** @type {Array.<Timetable>} */ JSON.parse(webview.additionalParameters['timetables']);
            var stopNameById = /** @type {Object.<String, String>} */ JSON.parse(webview.additionalParameters['stopnamebyid']);

            // Build the page
            document.getElementById('title-label').textContent = 'Line ' + lineName + ' - ' + direction1StopName + ' - ' + direction2StopName;
            periods = _.sortBy(periods, function(period) {
                return period.order;
            });
            var templateTimetable = _.template(document.getElementById('tpl-timetable').textContent);
            var content = '';
            _.each(periods, function(period) {
                var timetable = _.find(timetables, function(timetable) {
                    return timetable.timetablePeriodId === period.id;
                });
                content += templateTimetable({
                    period: period,
                    timetable: timetable,
                    stopNameById: stopNameById
                });
            });
            document.getElementById('content').innerHTML = content;

            // Limit the size of the stop names
            var windowDimension = browserUtils.getWindowDimension();
            var firstCell = /** @type {HTMLTableCellElement} */ document.getElementById('cell_0_0');
            var maxFirstColumnSize = Math.round(windowDimension.width * 0.75);
            if (firstCell.offsetWidth > maxFirstColumnSize) {
                //var firstColumnCells = document.querySelectorAll('.first-column');
                //for (var i = 0; i < firstColumnCells.length; i++) {
                //    var cell = firstColumnCells.item(i);
                //    cell.style.width = maxFirstColumnSize + 'px';
                //}
            }

            // Forward the close button click event
            new FastButton(document.getElementById('close-button'), function() {
                webview.fireExternalEvent(constants.CLOSE_EVENT);
            });
        }
    };

    return internalController;
});
