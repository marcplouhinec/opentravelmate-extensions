/**
 * Define an auto-completion dialog box.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'jquery',
    'core/utils/FunctionDam',
    'core/widget/Widget',
    'core/widget/webview/SubWebView',
    'core/widget/webview/webview',
    './subwebview/constants'
], function($, FunctionDam, Widget, SubWebView, webview, subWebViewConstants) {
    'use strict';

    var subWebViewReadyDam = new FunctionDam();

    /**
     * Height of a displayed item.
     *
     * @const
     * @type {Number}
     */
    var ITEM_HEIGHT = 45;

    /**
     * Margin bottom of the Auto-complete dialog.
     *
     * @const
     * @type {number}
     */
    var DIALOG_MARGIN_BOTTOM = 10;

    var autoCompletionDialog = {
        /**
         * Dialog box anchor.
         *
         * @type {{x: number, y: number}}
         * @private
         */
        '_anchor': {x: 0, y: 0},

        /**
         * Dialog box width.
         *
         * @type {number}
         * @private
         */
        '_width': 50,

        /**
         * Item renderer.
         *
         * @type {function(item: Object): String}
         * @private
         */
        '_renderItem': JSON.stringify,

        /**
         * @type {Array.<Object>}
         * @private
         */
        '_items': [],

        /**
         * @type {Array.<function(item: Object)>}
         * @private
         */
        '_selectionListeners': [],

        /**
         * Set layout information.
         *
         * @param {{x: number, y: number}} anchor
         * @param {number} width
         */
        'setLayoutParams': function(anchor, width) {
            this._anchor = anchor;
            this._width = width;

            // Update the SubWebView if necessary
            if (this.isVisible()) {
                var webViewPlaceHolder = document.getElementById(subWebViewConstants.AUTOCOMPLETION_DIALOG_WEBVIEW_ID);
                webViewPlaceHolder.style.left = this._anchor.x + 'px';
                webViewPlaceHolder.style.top = this._anchor.y + 'px';
                webViewPlaceHolder.style.width = this._width + 'px';
                webViewPlaceHolder.style.height = ITEM_HEIGHT + 'px';
                webview.layout();
            }
        },

        /**
         * Show or hide the auto completion subwebview.
         *
         * @param {boolean} visible
         */
        'setVisible': function(visible) {
            if (visible) {
                this._showSubWebView();
            } else {
                this._removeSubWebView();
            }
        },

        /**
         * @return {boolean} true if the subwebview is visible, false if not.
         */
        'isVisible': function() {
            if (document.getElementById(subWebViewConstants.AUTOCOMPLETION_DIALOG_WEBVIEW_ID)) {
                return true;
            } else {
                return false;
            }
        },

        /**
         * Set the item renderer.
         *
         * @param {function(item: Object): String} itemRenderer
         */
        'setRenderItemFunction': function(renderItem) {
            this._renderItem = renderItem;
        },

        /**
         * Set the items to show.
         *
         * @param {Array.<Object>} items
         */
        'setItems': function(items) {
            var self = this;
            this._items = items;

            // Wait for the SubWebView to be ready
            if (!subWebViewReadyDam.isOpened()) {
                subWebViewReadyDam.executeWhenOpen(function() {
                    self.setItems(items);
                });
                return;
            }

            // Set the dialog height
            var webViewPlaceHolder = document.getElementById(subWebViewConstants.AUTOCOMPLETION_DIALOG_WEBVIEW_ID);
            var dialogHeight = ITEM_HEIGHT * items.length + 1;
            var dialogY = $(webViewPlaceHolder).offset().top;
            var windowHeight = $(window).height();
            if (dialogY + dialogHeight + DIALOG_MARGIN_BOTTOM > windowHeight) {
                dialogHeight = windowHeight - dialogY - DIALOG_MARGIN_BOTTOM;
            }
            webViewPlaceHolder.style.height = dialogHeight + 'px';
            webview.layout();

            // Show the items
            var renderedItems = _.map(items, this._renderItem);
            var subWebView = /** @type {SubWebView} */ Widget.findById(subWebViewConstants.AUTOCOMPLETION_DIALOG_WEBVIEW_ID);
            subWebView.fireInternalEvent(subWebViewConstants.AUTOCOMPLETION_DIALOG_SETITEMS_EVENT, {
                items: renderedItems
            })
        },

        /**
         * Register a listener when an item is selected.
         *
         * @param {function(item: Object)} listener
         */
        'onSelect': function(listener) {
            this._selectionListeners.push(listener);
        },

        /**
         * Show the SubWebView.
         * Note: do nothing if the place holder is already here.
         * @private
         */
        '_showSubWebView': function() {
            var self = this;

            // Do nothing if the web view is already displayed
            var subWebView = /** @type {SubWebView} */ Widget.findById(subWebViewConstants.AUTOCOMPLETION_DIALOG_WEBVIEW_ID);
            if (subWebView) {
                return;
            }

            // Create the web view
            /** @type {HTMLElement} */
            var webViewPlaceHolder = document.createElement('div');
            webViewPlaceHolder.id = subWebViewConstants.AUTOCOMPLETION_DIALOG_WEBVIEW_ID;
            webViewPlaceHolder.style.position = 'absolute';
            webViewPlaceHolder.style.left = this._anchor.x + 'px';
            webViewPlaceHolder.style.top = this._anchor.y + 'px';
            webViewPlaceHolder.style.width = this._width + 'px';
            webViewPlaceHolder.style.height = ITEM_HEIGHT + 'px';
            webViewPlaceHolder.setAttribute('data-otm-widget', 'SubWebView');
            webViewPlaceHolder.setAttribute('data-otm-url', 'extensions/extra-widgets/autocompletion/autocompletiondialog/subwebview/dialog.html');
            webViewPlaceHolder.setAttribute('data-otm-entrypoint', 'extra-widgets/autocompletion/autocompletiondialog/subwebview/entryPoint');
            document.body.appendChild(webViewPlaceHolder);

            // Activate behaviors when the web view is created
            SubWebView.onCreate(subWebViewConstants.AUTOCOMPLETION_DIALOG_WEBVIEW_ID, function() {
                subWebViewReadyDam.setOpened(true);

                // Handle item selection
                var subWebView = /** @type {SubWebView} */ Widget.findById(subWebViewConstants.AUTOCOMPLETION_DIALOG_WEBVIEW_ID);
                subWebView.onInternalEvent(subWebViewConstants.AUTOCOMPLETION_DIALOG_SELECTITEM_EVENT, function handleSelectItemEvent(payload) {
                    var selectedItem = self._items[payload.itemIndex];

                    // Close the dialog
                    self.setVisible(false);

                    // Fire the selection event to the registered listeners
                    _.each(self._selectionListeners, function(listener) {
                        listener(selectedItem);
                    });
                });
            });

            // Create the web view
            webview.layout();
        },

        /**
         * Remove the subwebview web view.
         * @private
         */
        '_removeSubWebView': function() {
        	subWebViewReadyDam.setOpened(false);
            $('#' + subWebViewConstants.AUTOCOMPLETION_DIALOG_WEBVIEW_ID).remove();
            webview.layout();
        }
    };

    return autoCompletionDialog;
});
