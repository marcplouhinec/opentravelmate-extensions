/**
 * Define the internal SubWebView controller.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'underscore',
    'googleFastButton',
    '../../core/widget/webview/webview',
    './constants'
], function(_, FastButton, webview, constants) {
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
            var waypointIdToHighlight = /** @type {String} */ webview.additionalParameters['waypointid-to-highlight'];

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
                    stopNameById: stopNameById,
                    waypointIdToHighlight: waypointIdToHighlight
                });
            });
            content += '<div id="empty-element"></div>';
            document.getElementById('content').innerHTML = content;

            // Forward the close button click event
            new FastButton(document.getElementById('close-button'), function() {
                webview.fireExternalEvent(constants.CLOSE_EVENT);
            });

            // Move the stop names when the page is scrolled horizontally
            var lastPageX = 0;
            document.getElementById('content').onscroll = function() {
                var pageX = document.getElementById('empty-element').getBoundingClientRect().left;
                if (pageX !== lastPageX) {
                    lastPageX = pageX;

                    var stopNameElements = document.querySelectorAll('.stop-name');
                    for (var i = 0; i < stopNameElements.length; i++) {
                        stopNameElements.item(i).style.left = (2 - pageX) + 'px';
                    }
                }
            };
        }
    };

    return internalController;
});
