/**
 * Define the internal SubWebView controller.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'googleFastButton',
    '../../../core/widget/webview/webview',
    './constants'
], function(FastButton, webview, constants) {
    'use strict';

    var internalController = {

        /**
         * Initialize the SubWebView.
         */
        'initWebView': function() {
            var title = /** @type {String} */ webview.additionalParameters['title'];
            var message = /** @type {String} */ webview.additionalParameters['message'];
            var buttons = /** @type {Array.<{id: String, name: String}>} */ JSON.parse(webview.additionalParameters['buttons']);

            var titleElement = /** @type {HTMLTableCellElement} */ document.getElementById('title');
            titleElement.textContent = title;
            titleElement.colSpan = buttons.length;

            var messageElement = /** @type {HTMLTableCellElement} */ document.getElementById('message');
            messageElement.textContent = message;
            messageElement.colSpan = buttons.length;

            for (var i = 0; i < buttons.length; i++) {
                this._displayButton(buttons[i], i, buttons.length);
            }
        },

        /**
         * Show the given button.
         *
         * @private
         * @param {{id: String, name: String}} button
         * @param {Number} index
         * @param {Number} nbButtons
         */
        '_displayButton': function(button, index, nbButtons) {
            var buttonElement = /** @type {HTMLTableCellElement} */ document.createElement('td');
            buttonElement.textContent = button.name;
            buttonElement.style.width = (100 / nbButtons) + '%';
            if (index > 0) {
                buttonElement.className = 'button-with-left-border';
            }
            var buttonsElement = /** @type {HTMLTableRowElement} */ document.getElementById('buttons-row');
            buttonsElement.appendChild(buttonElement);

            // Fire a click event when the user presses the current button
            new FastButton(buttonElement, function() {
                webview.fireExternalEvent(constants.CLICK_EVENT, { buttonId: button.id });
            });
        }
    };

    return internalController;
});
