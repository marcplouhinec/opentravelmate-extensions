/**
 * Webview startup script.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

// Define AMD incompatible libraries
requirejs.config({
	baseUrl: window.org_opentravelmate_widget_webview_webviewBaseUrl,
    paths: {
        'jquery': 'extensions/core/lib/jquery.min',
        'underscore': 'extensions/core/lib/underscore.min',
        'async': 'extensions/core/lib/async',
        'googleFastButton': 'extensions/core/lib/google.fastbutton',
        'jqueryGoogleFastButton': 'extensions/core/lib/jquery.google.fastbutton',
        'nativeWebView': 'native/widget/webview/nativeWebView',
        'nativeMenu': 'native/widget/menu/nativeMenu',
        'nativeMap': 'native/widget/map/nativeMap'
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
    'extensions/core/widget/webview/webview',
    'extensions/core/widget/webview/SubWebView',
    window.org_opentravelmate_widget_webview_webviewEntrypoint],
function($, webview, SubWebView, entrypoint) {
    'use strict';

    $(document).ready(function() {
        // Create the current WebView
        webview.id = window.org_opentravelmate_widget_webview_webviewId;
        webview.baseUrl = window.org_opentravelmate_widget_webview_webviewBaseUrl;
        webview.additionalParameters = window.org_opentravelmate_widget_webview_additionalParameters;

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
