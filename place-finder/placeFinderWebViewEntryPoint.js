/**
 * Define the place finder web view entry point.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define(['./placeFinderWebViewController'], function(placeFinderWebViewController) {
    'use strict';

    /**
     * Place finder WebView entry point.
     */
    return function main() {
        placeFinderWebViewController.initWebView();
    };
});
