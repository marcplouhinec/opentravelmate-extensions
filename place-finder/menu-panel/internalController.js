/**
 * Define the place finder menu panel internal WebView controller.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'jquery',
    'core/widget/Widget',
    'core/widget/webview/WebView'
], function($, Widget, WebView) {
    'use strict';

    /**
     * @const
     * @type {number}
     */
    var ENTER_KEYCODE = 13;

    /**
     * @const
     * @type {number}
     */
    var MIN_NB_OF_CHARACTERS_FOR_SUGGESTION = 3;

    var internalController = {

        /**
         * @const
         * @type {String}
         */
        "PLACE_FINDER_MENUPANEL_WEBVIEW_ID": 'place-finder-menupanel-webview',

        /**
         * @const
         * @type {String}
         */
        "PLACE_FINDER_MENUPANEL_CLOSE_EVENT": 'place-finder-menupanel-close-event',

        /**
         * @const
         * @type {String}
         */
        "PLACE_FINDER_MENUPANEL_SUGGESTPLACES_EVENT": 'place-finder-menupanel-suggest-places-event',

        /**
         * @const
         * @type {String}
         */
        "PLACE_FINDER_MENUPANEL_FINDPLACES_EVENT": 'place-finder-menupanel-find-places-event',

        /**
         * Initialize the place finder WebView.
         */
        'initWebView': function() {
            var self = this;

            // Suggest places to the user when he's typing a query
            $('#place-query').keyup(function handleKeyUp(event) {
                var query = $('#place-query').val();
                if (!query || query.length === 0) {
                    return;
                }

                if (event.keyCode === ENTER_KEYCODE) {
                    self._findPlaces(query);
                } else {
                    // Fire an even for asking suggestion
                    if (query.length >= MIN_NB_OF_CHARACTERS_FOR_SUGGESTION) {
                        self._suggestPlaces(query);
                    }
                }
            });

            // Handle the find button
            $('#find-button').bind('touchstart click', function handleFindButtonClick(event) {
                event.stopPropagation();
                event.preventDefault();

                var query = $('#place-query').val();
                if (!query || query.length === 0) {
                    return;
                }
                self._findPlaces(query);
            });

            // Handle the close button
            $('#close-button').bind('touchstart click', function handleCloseButtonClick(event) {
                event.stopPropagation();
                event.preventDefault();

                self._close();
            });

            // Focus on the place-query input
            $('#place-query').focus();
        },

        /**
         * Find the places corresponding to the given query.
         *
         * @param {string} query
         * @private
         */
        '_findPlaces': function(query) {
            /** @type {WebView} */
            var webView = Widget.findById(this.PLACE_FINDER_MENUPANEL_WEBVIEW_ID);
            webView.fireExternalEvent(this.PLACE_FINDER_MENUPANEL_FINDPLACES_EVENT, {query: query});
        },

        /**
         * Suggest places for the given query.
         *
         * @param {string} query
         * @private
         */
        '_suggestPlaces': function(query) {
            var $inputPlaceQuery = $('#place-query');
            var offset = $inputPlaceQuery.offset();
            var inputQueryLayoutparams = {
                'x': offset.left,
                'y': offset.top,
                'width': $inputPlaceQuery.width(),
                'height': $inputPlaceQuery.height()
            };

            /** @type {WebView} */
            var webView = Widget.findById(this.PLACE_FINDER_MENUPANEL_WEBVIEW_ID);
            webView.fireExternalEvent(this.PLACE_FINDER_MENUPANEL_SUGGESTPLACES_EVENT, {
                query: query,
                inputQueryLayoutparams: inputQueryLayoutparams
            });
        },

        /**
         * Close the menu panel.
         *
         * @private
         */
        '_close': function() {
            /** @type {WebView} */
            var webView = Widget.findById(this.PLACE_FINDER_MENUPANEL_WEBVIEW_ID);
            webView.fireExternalEvent(this.PLACE_FINDER_MENUPANEL_CLOSE_EVENT);
        }
    };

    return internalController;
});
