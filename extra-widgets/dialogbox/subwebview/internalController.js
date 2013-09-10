/**
 * Define the dialog internal WebView controller.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'jquery',
    '../../../core/widget/webview/webview',
    './constants'
], function($, webview, constants) {
    'use strict';

    var internalController = {
        /**
         * Initialize the SubWebView.
         */
        'initWebView': function() {
            var title = /** @type {String} */ webview.additionalParameters['dialogboxtitle'];
            var iconUrl = /** @type {String=} */ webview.additionalParameters['dialogboxiconurl'];
            var contentUrl = /** @type {String=} */ webview.additionalParameters['dialogboxcontenturl'];

            // Set the dialog box title
            var divTitleLabel = /** @type {HTMLDivElement} */ document.getElementById('title-label');

            // Set the dialog box icon
            $(divTitleLabel).text(title);
            if (iconUrl) {
                var divTitleIcon = /** @type {HTMLDivElement} */ document.getElementById('title-icon');
                divTitleIcon.style.display = 'block';
                var imageElement = /** @type {HTMLImageElement} */ document.createElement('img');
                imageElement.src = '../../../../' + iconUrl;
                imageElement.style.height = '100%';
                divTitleIcon.appendChild(imageElement);
                divTitleLabel.style.left = '50px';
            }

            // Set the dialog box content
            if (contentUrl) {
                $.get('../../../../' + contentUrl).done(function(contentData) {
                    $('#dialogbox-content').html(contentData);
                }).fail(function() {
                    $('#dialogbox-content').html('Error: unable to load ' + contentUrl + '.');
                });
            }

            // Fire an external event when the close button is pressed
            $('#close-button').bind('touchstart click', function(event) {
                event.stopPropagation();
                event.preventDefault();

                webview.fireExternalEvent(constants.DIALOGBOX_CLOSE_EVENT);
            });
        }
    };

    return internalController;
});
