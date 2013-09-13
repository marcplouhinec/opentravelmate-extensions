/**
 * Define the dialog internal WebView controller.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'googleFastButton',
    '../../../core/utils/browserUtils',
    '../../../core/widget/webview/webview',
    './constants'
], function(FastButton, browserUtils, webview, constants) {
    'use strict';

    var internalController = {
        /**
         * Initialize the SubWebView.
         */
        'initWebView': function() {
            var title = /** @type {String} */ webview.additionalParameters['dialogboxtitle'];
            var iconUrl = /** @type {String=} */ webview.additionalParameters['dialogboxiconurl'];
            var contentUrl = /** @type {String=} */ webview.additionalParameters['dialogboxcontenturl'];
            var stylesheetUrls = /** @type {Array.<String>} */ JSON.parse(webview.additionalParameters['dialogboxstylesheeturls']);

            // Set the dialog box title
            var divTitleLabel = /** @type {HTMLDivElement} */ document.getElementById('title-label');

            // Set the dialog box icon
            divTitleLabel.textContent = title;
            if (iconUrl) {
                var divTitleIcon = /** @type {HTMLDivElement} */ document.getElementById('title-icon');
                divTitleIcon.style.display = 'block';
                var imageElement = /** @type {HTMLImageElement} */ document.createElement('img');
                imageElement.src = '../../../../' + iconUrl;
                imageElement.style.height = '100%';
                divTitleIcon.appendChild(imageElement);
                divTitleLabel.style.left = '60px';
            }

            // Set the dialog box stylesheets
            for (var i = 0; i < stylesheetUrls.length; i += 1) {
                var stylesheetUrl = stylesheetUrls[i];
                var linkElement = /** @type {HTMLLinkElement} */ document.createElement('link');
                linkElement.href = '../../../../' + stylesheetUrl;
                linkElement.rel = 'stylesheet';
                linkElement.type = 'text/css';
                linkElement.media = 'screen';
                document.getElementsByTagName('head')[0].appendChild(linkElement);
            }

            // Set the dialog box content
            if (contentUrl) {
                browserUtils.getText('../../../../' + contentUrl, function(responseText) {
                    var divDialogContent = /** @type {HTMLDivElement} */ document.getElementById('dialogbox-content');
                    divDialogContent.innerHTML = responseText;
                });
            }

            // Fire an external event when the close button is pressed
            new FastButton(document.getElementById('close-button'), function() {
                webview.fireExternalEvent(constants.DIALOGBOX_CLOSE_EVENT);
            });
        }
    };

    return internalController;
});
