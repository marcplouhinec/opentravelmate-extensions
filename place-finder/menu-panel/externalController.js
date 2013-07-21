/**
 * Define the place finder menu panel external WebView controller.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'jquery',
    'core/commons/FunctionDam',
    'core/widget/Widget',
    'core/widget/webview/WebView',
    'core/widget/autocompletiondialog/autoCompletionDialog',
    './internalController'
], function($, FunctionDam, Widget, WebView, autoCompletionDialog, internalController) {
    'use strict';

    var webViewReadyDam = new FunctionDam();

    var externalController = {
        /**
         * Registered place providers.
         *
         * @type {Array.<PlaceProvider>}
         * @private
         */
        '_placeProviders': [],

        /**
         * Register a PlaceProvider.
         *
         * @param {PlaceProvider} placeProvider
         */
        'registerPlaceProvider': function(placeProvider) {
            this._placeProviders.push(placeProvider);
        },

        /**
         * Show the place finder web view.
         * Note: do nothing if the place holder is already here.
         */
        'showWebView': function() {
            var self = this;

            // Do nothing if the web view is already displayed
            var webView = Widget.findById(internalController.PLACE_FINDER_MENUPANEL_WEBVIEW_ID);
            if (webView) {
                return;
            }

            // Create the web view
            /** @type {HTMLElement} */
            var webViewPlaceHolder = document.createElement('div');
            webViewPlaceHolder.id = internalController.PLACE_FINDER_MENUPANEL_WEBVIEW_ID;
            webViewPlaceHolder.style.position = 'absolute';
            webViewPlaceHolder.style.left = 0;
            webViewPlaceHolder.style.right = 0;
            webViewPlaceHolder.style.top = $('#main-menu').height() + 'px';
            webViewPlaceHolder.style.height = '50px';
            webViewPlaceHolder.setAttribute('data-otm-widget', 'WebView');
            webViewPlaceHolder.setAttribute('data-otm-url', 'extensions/place-finder/menu-panel/menu-panel.html');
            webViewPlaceHolder.setAttribute('data-otm-entrypoint', 'place-finder/menu-panel/entryPoint');
            document.body.appendChild(webViewPlaceHolder);

            // Activate behaviors when the web view is created
            WebView.onCreate(internalController.PLACE_FINDER_MENUPANEL_WEBVIEW_ID, function() {
                webViewReadyDam.setOpened(true);

                /** @type {WebView} */
                var webView = Widget.findById(internalController.PLACE_FINDER_MENUPANEL_WEBVIEW_ID);

                webView.on(internalController.PLACE_FINDER_MENUPANEL_SUGGESTPLACES_EVENT, function forwardSuggestPlacesEvent(payload) {
                    self._suggestPlaces(payload.query, payload.inputQueryLayoutparams);
                });

                webView.on(internalController.PLACE_FINDER_MENUPANEL_FINDPLACES_EVENT, function forwardSuggestPlacesEvent(payload) {
                    self._findPlaces(payload.query);
                });
            });

            // Disable some behavior when the web view is closed
            WebView.onDestroy(internalController.PLACE_FINDER_MENUPANEL_WEBVIEW_ID, function() {
                // Close the auto-completion dialog if any
                autoCompletionDialog.setVisible(false);
            });

            // Create the web view
            WebView.getCurrent().layout();
        },

        /**
         * Remove the place finder web view.
         */
        'removeWebView': function() {
            $('#' + internalController.PLACE_FINDER_MENUPANEL_WEBVIEW_ID).remove();
            WebView.getCurrent().layout();
        },

        /**
         * Register a listener for the close event.
         *
         * @param {Function} listener
         */
        'onClose': function(listener) {
            var self = this;

            if (!webViewReadyDam.isOpened()) {
                webViewReadyDam.executeWhenOpen(function() {
                    self.onClose(listener);
                });
                return;
            }

            /** @type {WebView} */
            var webView = Widget.findById(internalController.PLACE_FINDER_MENUPANEL_WEBVIEW_ID);
            webView.on(internalController.PLACE_FINDER_MENUPANEL_CLOSE_EVENT, listener);
        },

        /**
         * Find the places corresponding to the given query.
         *
         * @param {string} query
         * @private
         */
        '_findPlaces': function(query) {
            var self = this;

            // Close the auto-completion dialog if any
            autoCompletionDialog.setVisible(false);

            _.each(this._placeProviders, function(placeProvider) {
                placeProvider.findPlaces(query, function handleFoundPlaces(places) {
                    self._showFoundPlaces(places);
                });
            });
        },

        /**
         * Suggest places for the given query.
         *
         * @param {string} query
         * @param {{x: Number, y: Number, width: Number, height: Number}} inputQueryLayoutparams
         * @private
         */
        '_suggestPlaces': function(query, inputQueryLayoutparams) {
            var self = this;

            _.each(this._placeProviders, function(placeProvider) {
                placeProvider.suggestPlaces(query, function handleSuggestedPlaces(places) {
                    self._showSuggestedPlaces(places, inputQueryLayoutparams);
                });
            });
        },

        /**
         * Show found places on the map.
         *
         * @param {Array.<Place>} places
         * @private
         */
        '_showFoundPlaces': function(places) {
            // TODO
        },

        /**
         * Show suggested places on the auto completion dialog..
         *
         * @param {Array.<Place>} places
         * @param {{x: Number, y: Number, width: Number, height: Number}} inputQueryLayoutparams
         * @private
         */
        '_showSuggestedPlaces': function(places, inputQueryLayoutparams) {
            // Initialize the auto-completion dialog if necessary
            if (!autoCompletionDialog.isVisible()) {
                var $webViewPlaceHolder = $('#' + internalController.PLACE_FINDER_MENUPANEL_WEBVIEW_ID);
                var offset = $webViewPlaceHolder.offset();

                autoCompletionDialog.setLayoutParams(
                    {
                        x: inputQueryLayoutparams.x,
                        y: offset.top + inputQueryLayoutparams.y + inputQueryLayoutparams.height + 10
                    },
                    inputQueryLayoutparams.width + 10);
                autoCompletionDialog.setItemRenderer(function renderPlace(place) {
                    return place.name;
                });
                autoCompletionDialog.setVisible(true);
            }

            autoCompletionDialog.setItems(places);
        }
    };

    return externalController;
});
