/**
 * Define the class that adds auto-completion to an input text element.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'jquery',
    'core/widget/webview/SubWebView',
    'core/widget/webview/webview',
    './autocompletiondialog/autoCompletionDialog'
], function($, SubWebView, webview, autoCompletionDialog) {
    'use strict';

    /**
     * @const
     * @type {number}
     */
    var ENTER_KEYCODE = 13;

    /**
     * Add auto-completion to the given input text element.
     * Note: This constructor must be called in the main web view.
     *
     * @constructor
     * @param {SubWebView} subWebView
     *     SubWebView that contains the input text element.
     * @param {String} htmlInputElementId
     *     ID of the input text element to enhance.
     * @param {function(value: String, callback: function(items: Array))} provideItems
     *     Provide suggestion items for the given value.
     * @param {function(item: Object): String} renderItem
     *     Render the given suggestion item into a string.
     */
    function AutoCompleteTextInput(subWebView, htmlInputElementId, provideItems, renderItem) {
        var self = this;

        /**
         * Registered selection listeners.
         *
         * @type {Array.<function(item: Object)>}
         * @private
         */
        this._selectionListeners = [];

        // Show/update the auto completion subwebview when the user has typed enough letters
        subWebView.onInternalEvent(AutoCompleteTextInput._SHOW_SUGGESTIONS_EVENT, function handleShowSuggestionEvent(payload) {
            if (payload.htmlInputElementId === htmlInputElementId) {
                var value = payload.htmlInputElementValue;

                if (!autoCompletionDialog.isVisible()) {
                    self._initializeDialog(subWebView, payload.htmlInputElementRect, renderItem);
                } else {
                    self._setDialogLayoutParams(subWebView, payload.htmlInputElementRect);
                }

                provideItems(payload.htmlInputElementValue, function (/** @type {Array} */ items) {
                    autoCompletionDialog.setItems(items);
                });
            }
        });

        // When the user has selected a suggestion, set this value into the input text element and call the listeners
        autoCompletionDialog.onSelect(function handleSelectedItem(item) {
            // Set the selected item value into the input text element
            subWebView.fireInternalEvent(AutoCompleteTextInput._SELECTED_ITEM_EVENT, {
                htmlInputElementId: htmlInputElementId,
                htmlInputElementValue: renderItem(item)
            });


            // Call the listeners
            _.each(self._selectionListeners, function(listener) {
                listener(item);
            });
        });

        // Close the auto-completion dialog if the SubWebView is destroyed
        SubWebView.onDestroy(subWebView.id, function handleInputElementDestroy() {
            autoCompletionDialog.setVisible(false);
        });
    }

    /**
     * Mark the given input text element as auto-completable.
     * Note: This function must be called inside a sub web view.
     *
     * @param {HTMLInputElement} htmlInputElement
     * @param {Number} threshold
     *     Number of letters the user must write in order to query suggestion items.
     */
    AutoCompleteTextInput.markAsAutoCompletable = function(htmlInputElement, threshold) {
        var $htmlInputElement = $(htmlInputElement);

        /**
         * Fire the SHOW_SUGGESTIONS_EVENT if possible.
         */
        function fireShowSuggestionEvent() {
            var value = $htmlInputElement.val();

            // Check the value is long enough
            if (!value || value.length < threshold) {
                return;
            }

            // Fire the event
            var offset = $htmlInputElement.offset();
            webview.fireExternalEvent(AutoCompleteTextInput._SHOW_SUGGESTIONS_EVENT, {
                htmlInputElementId: htmlInputElement.id,
                htmlInputElementValue: value,
                htmlInputElementRect: {
                    x: offset.left,
                    y: offset.top,
                    width: $htmlInputElement.width(),
                    height: $htmlInputElement.height()
                }
            });
        }

        // When the input text has been updated, fire an event to update the suggestions
        $htmlInputElement.keyup(function handleKeyUp(event) {
            // Check the pressed key is not "ENTER"
            if (event.keyCode === ENTER_KEYCODE) {
                return;
            }

            fireShowSuggestionEvent();
        });

        // When the window is re-sized, update the auto-complete dialog size
        $(window).resize(fireShowSuggestionEvent);

        // When the user has selected a suggestion, set this value into the input text
        webview.onExternalEvent(AutoCompleteTextInput._SELECTED_ITEM_EVENT, function handleSelectedItemEvent(payload) {
            if (payload.htmlInputElementId === htmlInputElement.id) {
                $htmlInputElement.val(payload.htmlInputElementValue + ' '); // Workaround for the strange Android text selection cursor
                $htmlInputElement.val(payload.htmlInputElementValue);
            }
        });
    };

    /**
     * Register a listener when an item is selected.
     * Note: This function must be called in the main web view.
     *
     * @param {function(item: Object)} listener
     */
    AutoCompleteTextInput.prototype.onSelect = function(listener) {
        this._selectionListeners.push(listener);
    };

    /**
     * Event thrown by the SubWebView when the input element has been updated.
     *
     * @const
     * @type {string}
     * @private
     */
    AutoCompleteTextInput._SHOW_SUGGESTIONS_EVENT = 'extra-widgets-autocompletion-autocompletetextinput-show-suggestions-event';

    /**
     * Event thrown by the main WebView when the user has selected a suggestion.
     *
     * @const
     * @type {string}
     * @private
     */
    AutoCompleteTextInput._SELECTED_ITEM_EVENT = 'extra-widgets-autocompletion-autocompletetextinput-selected-item-event';

    /**
     * Initialize the auto-complete subwebview.
     *
     * @param {SubWebView} subWebView
     *     SubWebView that contains the input text element.
     * @param {{x: Number, y: Number, width: Number, height: Number}} htmlInputElementRect
     * @param {function(item: Object): String} renderItem
     * @private
     */
    AutoCompleteTextInput.prototype._initializeDialog = function(subWebView, htmlInputElementRect, renderItem) {
        this._setDialogLayoutParams(subWebView, htmlInputElementRect);
        autoCompletionDialog.setRenderItemFunction(renderItem);
        autoCompletionDialog.setVisible(true);
    };

    /**
     * Set the auto-complete dialog layout params.
     *
     * @param {SubWebView} subWebView
     *     SubWebView that contains the input text element.
     * @param {{x: Number, y: Number, width: Number, height: Number}} htmlInputElementRect
     * @private
     */
    AutoCompleteTextInput.prototype._setDialogLayoutParams = function(subWebView, htmlInputElementRect) {
        var $subWebViewElement = $('#' + subWebView.id);
        var offset = $subWebViewElement.offset();
        autoCompletionDialog.setLayoutParams(
            {
                x: htmlInputElementRect.x,
                y: offset.top + htmlInputElementRect.y + htmlInputElementRect.height + 10
            },
            htmlInputElementRect.width + 10);
    };

    return AutoCompleteTextInput;
});
