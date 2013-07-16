/**
 * Define the main view entry point.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'core/widget/webview/WebView',
    'core/extension/extensionManager'
], function(WebView, extensionManager) {
    'use strict';

    /**
     * Extension entry point.
     */
    return function main() {
        // Layout the widgets
        WebView.getCurrent().layout();

        // Start the extensions
        extensionManager.startExtensions();
    };
});
