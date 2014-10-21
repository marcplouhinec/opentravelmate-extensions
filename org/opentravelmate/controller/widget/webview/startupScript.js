/**
 * Webview startup script.
 *
 * @author Marc Plouhinec
 */

// Define AMD incompatible libraries
requirejs.config({
	baseUrl: window.org_opentravelmate_widget_webview_webviewBaseUrl,
    paths: {
        'jquery': 'extensions/vendors/jquery-1.11.1.min',
        'lodash': 'extensions/vendors/lodash.compat.min',
        'moment': 'extensions/vendors/moment',
        'async': 'extensions/vendors/async',
        'googleFastButton': 'extensions/vendors/google.fastbutton',
        'jqueryGoogleFastButton': 'extensions/vendors/jquery.google.fastbutton',
        'nativeWebView': 'native/widget/webview/nativeWebView',
        'nativeMenu': 'native/widget/menu/nativeMenu',
        'nativeMap': 'native/widget/map/nativeMap',
        'nativeGeolocation': 'native/geolocation/nativeGeolocation'
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
        'lodash': {
            exports: '_'
        },
        'moment': {
            exports: 'moment'
        }
    },
    waitSeconds: 0
});

require([
        'jquery',
        'extensions/org/opentravelmate/controller/widget/webview/webview',
        'extensions/org/opentravelmate/controller/widget/webview/SubWebView',
        window.org_opentravelmate_widget_webview_webviewEntrypoint],
function($, webview, SubWebView, entrypoint) {
    'use strict';

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
