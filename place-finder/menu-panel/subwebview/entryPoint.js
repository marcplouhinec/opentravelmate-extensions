/**
 * Define the place finder web view entry point.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define(['./internalController'], function(internalController) {
    'use strict';

    /**
     * Place finder WebView entry point.
     */
    return function main() {
        internalController.initWebView();
    };
});
