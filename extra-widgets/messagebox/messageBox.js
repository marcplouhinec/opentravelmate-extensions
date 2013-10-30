/**
 * Handle the map overlay.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    '../../core/utils/browserUtils',
    '../../core/widget/Widget',
    '../../core/widget/webview/webview',
    '../../core/widget/webview/SubWebView',
    './messagebox-subwebview/constants'
], function(browserUtils, Widget, webview, SubWebView, subWebViewConstants) {
    'use strict';

    var messageBox = {
        /**
         * @type {HTMLDivElement}
         * @private
         */
        '_subWebViewPlaceHolder': null,

        /**
         * Open a message box with the following information:
         *
         * @param {String} title
         * @param {String} message
         * @param {Array.<{id: String, name: String}>} buttons
         * @param {function(clickedButtonId: String)} callback
         */
        'open': function(title, message, buttons, callback) {
            // Check if the panel doesn't already exist
            if (this._subWebViewPlaceHolder) {
                return;
            }

            // Compute the window dimension
            var windowDimension = browserUtils.getWindowDimension();
            var subWebViewDimension = {
                width: Math.round(windowDimension.width * 0.9),
                height: 180
            };
            if (subWebViewDimension.width > 350) {
                subWebViewDimension.width = 350;
            }

            // Create the SubWebView place holder
            this._subWebViewPlaceHolder = /** @type {HTMLDivElement} */document.createElement('div');
            this._subWebViewPlaceHolder.setAttribute('id', subWebViewConstants.SUBWEBVIEW_ID);
            this._subWebViewPlaceHolder.style.position = 'absolute';
            this._subWebViewPlaceHolder.style.left = ((windowDimension.width - subWebViewDimension.width) / 2) + 'px';
            this._subWebViewPlaceHolder.style.top = ((windowDimension.height - subWebViewDimension.height) / 2) + 'px';
            this._subWebViewPlaceHolder.style.width = subWebViewDimension.width + 'px';
            this._subWebViewPlaceHolder.style.height = subWebViewDimension.height + 'px';
            this._subWebViewPlaceHolder.setAttribute('data-otm-widget', 'SubWebView');
            this._subWebViewPlaceHolder.setAttribute('data-otm-url', 'extensions/extra-widgets/messagebox/messagebox-subwebview/messagebox.html');
            this._subWebViewPlaceHolder.setAttribute('data-otm-entrypoint', 'extensions/extra-widgets/messagebox/messagebox-subwebview/entryPoint');
            this._subWebViewPlaceHolder.setAttribute('data-otm-title', title);
            this._subWebViewPlaceHolder.setAttribute('data-otm-message', message);
            this._subWebViewPlaceHolder.setAttribute('data-otm-buttons', JSON.stringify(buttons));
            document.body.appendChild(this._subWebViewPlaceHolder);

            // Register event handlers when the SubWebView is loaded
            SubWebView.onCreate(subWebViewConstants.SUBWEBVIEW_ID, function() {
                var subWebView = /** @type {SubWebView} */ Widget.findById(subWebViewConstants.SUBWEBVIEW_ID);
                subWebView.onInternalEvent(subWebViewConstants.CLICK_EVENT, function(payload) {
                    callback(payload.buttonId);
                });
            });

            webview.layout();
        },

        /**
         * Close the itinerary panel.
         */
        'close': function() {
            if (this._subWebViewPlaceHolder) {
                document.body.removeChild(this._subWebViewPlaceHolder);
                delete this._subWebViewPlaceHolder;
                webview.layout();
            }
        }
    };

    return messageBox;
});
