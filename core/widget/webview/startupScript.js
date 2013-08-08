/**
 * Webview startup script.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

// Define AMD incompatible libraries
requirejs.config({
	baseUrl: window.org_opentravelmate_widget_webview_webviewBaseUrl + 'extensions/',
    paths: {
        'jquery': 'core/lib/jquery.min',
        'underscore': 'core/lib/underscore.min',
        'async': 'core/lib/async',
        'googleFastButton': 'core/lib/google.fastbutton',
        'jqueryGoogleFastButton': 'core/lib/jquery.google.fastbutton',
        'nativeWebView': window.org_opentravelmate_widget_webview_webviewBaseUrl + 'native/widget/webview/nativeWebView',
        'nativeMenu': window.org_opentravelmate_widget_webview_webviewBaseUrl + 'native/widget/menu/nativeMenu',
        'nativeMap': window.org_opentravelmate_widget_webview_webviewBaseUrl + 'native/widget/map/nativeMap'
    },
    shim: {
        'jquery': {
            exports: '$'
        },
        'googleFastButton': {
            exports: 'FastButton'
        },
        'jqueryGoogleFastButton': {
            deps: ['jquery', 'googleFastButton']
        },
        'underscore': {
            exports: '_'
        }
    }
});

require([
    'jquery',
    'core/widget/webview/webview',
    'core/widget/webview/SubWebView',
    window.org_opentravelmate_widget_webview_webviewEntrypoint],
function($, webview, SubWebView, entrypoint) {
    'use strict';

    $(document).ready(function() {
        // Create the current WebView
        webview.id = window.org_opentravelmate_widget_webview_webviewId;
        webview.baseUrl = org_opentravelmate_widget_webview_webviewBaseUrl;

        document.body.style.overflow = 'hidden';

        // Call the entry point
        entrypoint();

        // Fire the create event
        webview.fireExternalEvent(SubWebView.CREATE_EVENT, {
            id: webview.id
        });

        // Update the layout when the page is resized
        $(window).resize(function resizeWindow() {
            webview.layout();
        });
    });
});
