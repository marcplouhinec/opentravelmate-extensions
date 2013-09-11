/**
 * Dialog web view entry point.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define(['./internalController'], function(internalController) {
    'use strict';

    /**
     * Dialog web view entry point.
     */
    return function main() {
        internalController.initWebView();
    };
});