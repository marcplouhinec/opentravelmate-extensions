/**
 * Show an itinerary.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    '../core/utils/browserUtils',
    '../core/widget/Widget',
    '../core/widget/webview/webview',
    '../core/widget/webview/SubWebView',
    '../extra-widgets/messagebox/messageBox',
    './itinerary-panel-subwebview/constants'
], function(browserUtils, Widget, webview, SubWebView, messageBox, subWebViewConstants) {

    /**
     * @constant
     * @type {string}
     */
    var MAXIMIZED_HEIGHT = '160px';

    /**
     * @constant
     * @type {string}
     */
    var MINIMIZED_HEIGHT = '50px';

    var itineraryPanel = {
        /**
         * @type {HTMLDivElement}
         * @private
         */
        '_subWebViewPlaceHolder': null,

        /**
         * @type {Itinerary}
         * @private
         */
        '_itinerary': null,

        /**
         * @type {function(itinerary: Itinerary)} closeListener
         * @private
         */
        '_closeListener': null,

        /**
         * Open the itinerary panel for the given place.
         *
         * @param {Itinerary} itinerary
         * @param {function(itinerary: Itinerary)} closeListener
         */
        'open': function(itinerary, closeListener) {
            this._itinerary = itinerary;
            this._closeListener = closeListener;

            // Check if the panel doesn't already exist
            if (this._subWebViewPlaceHolder) {
                // Send the itinerary to show via an event
                var subWebView = /** @type {SubWebView} */ Widget.findById(subWebViewConstants.SUBWEBVIEW_ID);
                if (subWebView) {
                    subWebView.fireInternalEvent(subWebViewConstants.SHOW_ITINERARY_EVENT, {
                        itinerary: itinerary
                    });
                }
                return;
            }

            var self = this;

            // Create the SubWebView place holder
            this._subWebViewPlaceHolder = /** @type {HTMLDivElement} */document.createElement('div');
            this._subWebViewPlaceHolder.setAttribute('id', subWebViewConstants.SUBWEBVIEW_ID);
            this._subWebViewPlaceHolder.style.position = 'absolute';
            this._subWebViewPlaceHolder.style.left = '0px';
            this._subWebViewPlaceHolder.style.right = '0px';
            this._subWebViewPlaceHolder.style.bottom = '0px';
            this._subWebViewPlaceHolder.style.height = MAXIMIZED_HEIGHT;
            this._subWebViewPlaceHolder.setAttribute('data-otm-widget', 'SubWebView');
            this._subWebViewPlaceHolder.setAttribute('data-otm-url', 'extensions/itinerary-finder/itinerary-panel-subwebview/itinerary-panel.html');
            this._subWebViewPlaceHolder.setAttribute('data-otm-entrypoint', 'extensions/itinerary-finder/itinerary-panel-subwebview/entryPoint');
            this._subWebViewPlaceHolder.setAttribute('data-otm-itinerary', JSON.stringify(itinerary));
            document.body.appendChild(this._subWebViewPlaceHolder);

            // Register event handlers when the SubWebView is loaded
            SubWebView.onCreate(subWebViewConstants.SUBWEBVIEW_ID, function() {
                var subWebView = /** @type {SubWebView} */ Widget.findById(subWebViewConstants.SUBWEBVIEW_ID);
                subWebView.onInternalEvent(subWebViewConstants.CLOSE_EVENT, function() {
                    self._handleCloseEvent();
                });
                subWebView.onInternalEvent(subWebViewConstants.MINIMIZE_EVENT, function() {
                    self._handleMinimizeMaximizeEvent(true);
                });
                subWebView.onInternalEvent(subWebViewConstants.MAXIMIZE_EVENT, function() {
                    self._handleMinimizeMaximizeEvent(false);
                });
            });

            webview.layout();
        },

        /**
         * Close the itinerary panel.
         */
        'close': function() {
            if (!this._subWebViewPlaceHolder) {
                return;
            }
            var self = this;
            this._showCancelItineraryConfirmDialog(function() {
                document.body.removeChild(self._subWebViewPlaceHolder);
                delete self._subWebViewPlaceHolder;
                webview.layout();

                self._closeListener(self._itinerary);
            });
        },

        /**
         * Show a message box asking the user to confirm he really want to cancel the itinerary.
         *
         * @private
         * @param {Function} callback Function called if the user really want to cancel the itinerary.
         */
        '_showCancelItineraryConfirmDialog': function(callback) {
            messageBox.open(
                'Cancelling itinerary',
                'Are you sure to cancel this itinerary?',
                [
                    {
                        id: 'NO',
                        name: 'No'
                    }, {
                    id: 'YES',
                    name: 'Yes'
                }
                ],
                function(clickedButtonId) {
                    if (clickedButtonId === 'YES') {
                        callback();
                    }
                    messageBox.close();
                }
            );
        },

        /**
         * Handle the CLOSE event.
         *
         * @private
         */
        '_handleCloseEvent': function() {
            // Close the dialog box
            this.close();
        },

        /**
         * Handle the MINIMIZE and MAXIMIZE event.
         *
         * @param {Boolean} minimize true if the panel must be minimized, false if maximized.
         * @private
         */
        '_handleMinimizeMaximizeEvent': function(minimize) {
            if (!this._subWebViewPlaceHolder) {
                return;
            }

            this._subWebViewPlaceHolder.style.height = minimize ? MINIMIZED_HEIGHT : MAXIMIZED_HEIGHT;
            webview.layout();
        }
    };

    return itineraryPanel;
});