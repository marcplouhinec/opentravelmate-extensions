/**
 * Define the place finder menu panel external WebView controller.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'jquery',
    'core/utils/FunctionDam',
    'core/widget/Widget',
    'core/widget/webview/SubWebView',
    'core/widget/webview/webview',
    'extra-widgets/autocompletion/AutoCompleteTextInput',
    'extra-widgets/autocompletion/autocompletiondialog/autoCompletionDialog',
    './subwebview/constants'
], function($, FunctionDam, Widget, SubWebView, webview, AutoCompleteTextInput, autoCompletionDialog, subWebViewConstants) {
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
            var subWebView = Widget.findById(subWebViewConstants.PLACE_FINDER_MENUPANEL_WEBVIEW_ID);
            if (subWebView) {
                return;
            }

            // Create the web view
            /** @type {HTMLElement} */
            var webViewPlaceHolder = document.createElement('div');
            webViewPlaceHolder.id = subWebViewConstants.PLACE_FINDER_MENUPANEL_WEBVIEW_ID;
            webViewPlaceHolder.style.position = 'absolute';
            webViewPlaceHolder.style.left = 0;
            webViewPlaceHolder.style.right = 0;
            webViewPlaceHolder.style.top = $('#main-menu').height() + 'px';
            webViewPlaceHolder.style.height = '50px';
            webViewPlaceHolder.setAttribute('data-otm-widget', 'SubWebView');
            webViewPlaceHolder.setAttribute('data-otm-url', 'extensions/place-finder/menu-panel/subwebview/menu-panel.html');
            webViewPlaceHolder.setAttribute('data-otm-entrypoint', 'place-finder/menu-panel/subwebview/entryPoint');
            document.body.appendChild(webViewPlaceHolder);

            // Activate behaviors when the web view is created
            SubWebView.onCreate(subWebViewConstants.PLACE_FINDER_MENUPANEL_WEBVIEW_ID, function() {
                webViewReadyDam.setOpened(true);

                var subWebView = /** @type {SubWebView} */ Widget.findById(subWebViewConstants.PLACE_FINDER_MENUPANEL_WEBVIEW_ID);

                var autoCompleteTextInput = new AutoCompleteTextInput(
                    subWebView,
                    'place-query',
                    self._buildSuggestedPlacesProvider(),
                    self._buildSuggestedPlaceRenderer());
                autoCompleteTextInput.onSelect(function handleAutoCompleteTextInputSelection(item) {
                    // TODO
                });

                subWebView.onInternalEvent(subWebViewConstants.PLACE_FINDER_MENUPANEL_FINDPLACES_EVENT, function forwardSuggestPlacesEvent(payload) {
                    self._findPlaces(payload.query);
                });
            });

            // Create the web view
            webview.layout();
        },

        /**
         * Remove the place finder web view.
         */
        'removeWebView': function() {
            $('#' + subWebViewConstants.PLACE_FINDER_MENUPANEL_WEBVIEW_ID).remove();
            webview.layout();
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

            var subWebView = /** @type {SubWebView} */ Widget.findById(subWebViewConstants.PLACE_FINDER_MENUPANEL_WEBVIEW_ID);
            subWebView.onInternalEvent(subWebViewConstants.PLACE_FINDER_MENUPANEL_CLOSE_EVENT, listener);
        },

        /**
         * Find the places corresponding to the given query.
         *
         * @param {string} query
         * @private
         */
        '_findPlaces': function(query) {
            var self = this;

            // Close the auto-completion dialog if opened
            autoCompletionDialog.setVisible(false);

            _.each(this._placeProviders, function(placeProvider) {
                placeProvider.findPlaces(query, function handleFoundPlaces(places) {
                    self._showFoundPlaces(places);
                });
            });
        },

        /**
         * Create a function that suggest places for the given query.
         *
         * @return {function(value: String, callback: function(items: Array))} Function that provide places.
         * @private
         */
        '_buildSuggestedPlacesProvider': function() {
            var placeProviders = this._placeProviders;
            /** @type {Object.<PlaceProvider, Array.<Place>>} */
            var placesByProvider = {};

            return function provideSuggestedPlaces(/** @type {String} */ value, /** @type {function(items: Array)} */ callback) {
                _.each(placeProviders, function(placeProvider) {
                    placeProvider.suggestPlaces(value, function handleSuggestedPlaces(places) {
                        // Save the suggested places
                        placesByProvider[placeProvider] = places;

                        // Sort the suggested places by accuracy and place provider
                        /** @type {Array<Place>} */
                        var suggestedPlaces = _.chain(placesByProvider)
                            .values()
                            .flatten(true)
                            .sortBy(function(place) { return 1 - place.accuracy; })
                            .value();
                        callback(suggestedPlaces);
                    });
                });
            };
        },

        /**
         * Create a function that convert a place into a string.
         *
         * @return {function(item: Object): String} Function that convert a place into a string.
         * @private
         */
        '_buildSuggestedPlaceRenderer': function() {
            return function renderPlace(/** @type {Place} */ item) {
                return item.name;
            }
        },

        /**
         * Show found places on the map.
         *
         * @param {Array.<Place>} places
         * @private
         */
        '_showFoundPlaces': function(places) {
            // TODO
        }
    };

    return externalController;
});
