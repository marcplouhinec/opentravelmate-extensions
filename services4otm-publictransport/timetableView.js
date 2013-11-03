/**
 * Show the timetable of a line.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    '../core/widget/Widget',
    '../core/widget/webview/webview',
    '../core/widget/webview/SubWebView',
    './services4otm-timetable-subwebview/constants'
], function(Widget, webview, SubWebView, subWebViewConstants) {

    var timetableView = {

        /**
         * @type {HTMLDivElement}
         * @private
         */
        '_subWebViewPlaceHolder': null,

        /**
         * Open the web view.
         *
         * @param {String} lineName
         * @param {String} direction1StopName
         * @param {String} direction2StopName
         * @param {Array.<TimetablePeriod>} periods
         * @param {Array.<Timetable>} timetables
         * @param {Object.<String, String>} stopNameById
         * @param {String} waypointIdToHighlight
         */
        'open': function(lineName, direction1StopName, direction2StopName, periods, timetables, stopNameById, waypointIdToHighlight) {
            // Check if the panel doesn't already exist
            if (this._subWebViewPlaceHolder) {
                return;
            }

            var self = this;

            // Create the SubWebView place holder
            this._subWebViewPlaceHolder = /** @type {HTMLDivElement} */document.createElement('div');
            this._subWebViewPlaceHolder.setAttribute('id', subWebViewConstants.SUBWEBVIEW_ID);
            this._subWebViewPlaceHolder.style.position = 'absolute';
            this._subWebViewPlaceHolder.style.left = '0px';
            this._subWebViewPlaceHolder.style.right = '0px';
            this._subWebViewPlaceHolder.style.top = '0px';
            this._subWebViewPlaceHolder.style.bottom = '0px';
            this._subWebViewPlaceHolder.setAttribute('data-otm-widget', 'SubWebView');
            this._subWebViewPlaceHolder.setAttribute('data-otm-url', 'extensions/services4otm-publictransport/services4otm-timetable-subwebview/timetable-view.html');
            this._subWebViewPlaceHolder.setAttribute('data-otm-entrypoint', 'extensions/services4otm-publictransport/services4otm-timetable-subwebview/entryPoint');
            this._subWebViewPlaceHolder.setAttribute('data-otm-linename', lineName);
            this._subWebViewPlaceHolder.setAttribute('data-otm-direction1stopname', direction1StopName);
            this._subWebViewPlaceHolder.setAttribute('data-otm-direction2stopname', direction2StopName);
            this._subWebViewPlaceHolder.setAttribute('data-otm-periods', JSON.stringify(periods));
            this._subWebViewPlaceHolder.setAttribute('data-otm-timetables', JSON.stringify(timetables));
            this._subWebViewPlaceHolder.setAttribute('data-otm-stopnamebyid', JSON.stringify(stopNameById));
            this._subWebViewPlaceHolder.setAttribute('data-otm-waypointid-to-highlight', waypointIdToHighlight);
            document.body.appendChild(this._subWebViewPlaceHolder);

            // Register event handlers when the SubWebView is loaded
            SubWebView.onCreate(subWebViewConstants.SUBWEBVIEW_ID, function() {
                var subWebView = /** @type {SubWebView} */ Widget.findById(subWebViewConstants.SUBWEBVIEW_ID);
                subWebView.onInternalEvent(subWebViewConstants.CLOSE_EVENT, function() {
                    self._handleCloseEvent();
                });
            });

            webview.layout();
        },

        /**
         * Close the details panel.
         */
        'close': function() {
            if (this._subWebViewPlaceHolder) {
                document.body.removeChild(this._subWebViewPlaceHolder);
                delete this._subWebViewPlaceHolder;
                webview.layout();
            }
        },

        /**
         * Handle the CLOSE event.
         *
         * @private
         */
        '_handleCloseEvent': function() {
            // Close the dialog box
            this.close();
        }
    };

    return timetableView;
});