/**
 * Show a message in a dialog box for a short duration.
 *
 * @author Marc Plouhinec
 */

define([
    'jquery',
    '../widget/webview/webview',
    '../widget/webview/SubWebView',
    './DialogOptions'
], function($, webview, SubWebView, DialogOptions) {
    'use strict';

    /**
     * @type {number}
     */
    var nextSubWebViewPlaceHolderId = 0;

    /**
     * Show a message in a dialog box for a short duration.
     */
    var notificationController = {

        /**
         * Show a message in a dialog box for a short duration.
         *
         * @param {string} message
         * @param {number} duration In milliseconds
         * @param {DialogOptions} options
         */
        'showMessage': function (message, duration, options) {
            // Compute the window dimension
            var windowWidth = /** @type {number} */$(window).width();
            var windowHeight = /** @type {number} */$(window).height();
            var subWebViewDimension = {
                width: Math.round(windowWidth * 0.9),
                height: options.height
            };
            if (windowWidth > options.maxWidth) {
                subWebViewDimension.width = options.maxWidth;
            }

            // Create the SubWebView place holder
            var subWebViewPlaceHolderId = 'message-box-subwebview-' + nextSubWebViewPlaceHolderId++;
            var subWebViewPlaceHolder = /** @type {HTMLDivElement} */document.createElement('div');
            subWebViewPlaceHolder.setAttribute('id', subWebViewPlaceHolderId);
            subWebViewPlaceHolder.style.position = 'absolute';
            subWebViewPlaceHolder.style.left = ((windowWidth - subWebViewDimension.width) / 2) + 'px';
            subWebViewPlaceHolder.style.top = ((windowHeight - subWebViewDimension.height) / 2) + 'px';
            subWebViewPlaceHolder.style.width = subWebViewDimension.width + 'px';
            subWebViewPlaceHolder.style.height = subWebViewDimension.height + 'px';
            subWebViewPlaceHolder.setAttribute('data-otm-widget', 'SubWebView');
            subWebViewPlaceHolder.setAttribute('data-otm-url', 'extensions/org/opentravelmate/view/dialog/notification/notification.html');
            subWebViewPlaceHolder.setAttribute('data-otm-entrypoint', 'extensions/org/opentravelmate/controller/dialog/subwebview/notificationEntryPoint');
            subWebViewPlaceHolder.setAttribute('data-otm-message', message);
            document.body.appendChild(subWebViewPlaceHolder);

            // When the SubWebView is loaded, setup a timer to close it automatically
            SubWebView.onCreate(subWebViewPlaceHolderId, function handleNotificationDialogCreated() {
                setTimeout(function closeNotificationDialog() {
                    document.body.removeChild(subWebViewPlaceHolder);
                    webview.layout();
                }, duration);
            });

            webview.layout();
        }

    };

    return notificationController;
});
