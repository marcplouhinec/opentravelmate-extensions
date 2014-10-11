/**
 * Notification dialog box web view entry point.
 *
 * @author Marc Plouhinec
 */

define(['../../widget/webview/webview'], function(webview) {
    'use strict';

    /**
     * Sub web view entry point.
     */
    return function main() {
        var message = /** @type {String} */ webview.additionalParameters['message'];
        document.getElementById('message').textContent = message;
    };
});