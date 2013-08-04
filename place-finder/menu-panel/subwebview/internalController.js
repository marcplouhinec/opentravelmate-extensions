/**
 * Define the place finder menu panel internal WebView controller.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'jquery',
    'core/widget/Widget',
    'core/widget/webview/SubWebView',
    'core/widget/webview/webview',
    'extra-widgets/autocompletion/AutoCompleteTextInput'
], function($, Widget, SubWebView, webview, AutoCompleteTextInput) {
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
        "PLACE_FINDER_MENUPANEL_FINDPLACES_EVENT": 'place-finder-menupanel-find-places-event',

        /**
         * Initialize the place finder WebView.
         */
        'initWebView': function() {
            var self = this;

            // Mark the "place-query" input element as auto-completable
            AutoCompleteTextInput.markAsAutoCompletable(
                /** @type {HTMLInputElement} */ document.getElementById('place-query'),
                MIN_NB_OF_CHARACTERS_FOR_SUGGESTION);

            // Find places when the user presses ENTER
            $('#place-query').keyup(function handleKeyUp(event) {
                if (event.keyCode === ENTER_KEYCODE) {
                    self._findPlaces();
                }
            });

            // Handle the find button
            $('#find-button').bind('touchstart click', function handleFindButtonClick(event) {
                event.stopPropagation();
                event.preventDefault();

                self._findPlaces();
            });

            // Handle the close button
            $('#close-button').bind('touchstart click', function handleCloseButtonClick(event) {
                event.stopPropagation();
                event.preventDefault();

                self._close();
            });
        },

        /**
         * Find the places corresponding to the query.
         *
         * @private
         */
        '_findPlaces': function() {
            var query = $('#place-query').val();
            if (!query || query.length === 0) {
                return;
            }

            webview.fireExternalEvent(this.PLACE_FINDER_MENUPANEL_FINDPLACES_EVENT, {query: query});
        },

        /**
         * Close the menu panel.
         *
         * @private
         */
        '_close': function() {
            webview.fireExternalEvent(this.PLACE_FINDER_MENUPANEL_CLOSE_EVENT);
        }
    };

    return internalController;
});
