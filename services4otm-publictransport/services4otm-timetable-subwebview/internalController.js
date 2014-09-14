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
            var routeShortName = /** @type {String} */ webview.additionalParameters['route-shortname'];
            var routeLongName = /** @type {String} */ webview.additionalParameters['route-longname'];
            var timetables = /** @type {Array.<Timetable>} */ JSON.parse(webview.additionalParameters['timetables']);
            var stopIdToHighlight = /** @type {String} */ webview.additionalParameters['stopid-to-highlight'];

            // Build the page
            document.getElementById('title-label').textContent = 'Route ' + routeShortName + ' - ' + routeLongName;
            var templateTimetable = _.template(document.getElementById('tpl-timetable').textContent);
            var content = '';
            _.each(timetables, function (timetable) {
                content += templateTimetable({
                    timetable: timetable,
                    stopIdToHighlight: stopIdToHighlight
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
