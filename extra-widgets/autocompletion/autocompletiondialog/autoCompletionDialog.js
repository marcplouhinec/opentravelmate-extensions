/**
 * Define an auto-completion dialog box.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'core/commons/FunctionDam',
    'core/widget/Widget',
    'core/widget/webview/SubWebView',
    'core/widget/webview/webview',
    './subwebview/internalController'
], function(FunctionDam, Widget, SubWebView, webview, internalController) {
    'use strict';

    var subWebViewReadyDam = new FunctionDam();

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
         * Set layout information.
         *
         * @param {{x: number, y: number}} anchor
         * @param {number} width
         */
        'setLayoutParams': function(anchor, width) {
            this._anchor = anchor;
            this._width = width;
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
            if (document.getElementById(internalController.AUTOCOMPLETION_DIALOG_WEBVIEW_ID)) {
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

            // Update the web view
            if (!subWebViewReadyDam.isOpened()) {
                subWebViewReadyDam.executeWhenOpen(function() {
                    self.setItems(items);
                });
                return;
            }

            var renderedItems = _.map(items, this._renderItem);
            var subWebView = /** @type {SubWebView} */ Widget.findById(internalController.AUTOCOMPLETION_DIALOG_WEBVIEW_ID);
            subWebView.fireInternalEvent(internalController.AUTOCOMPLETION_DIALOG_SETITEMS_EVENT, {
                items: renderedItems
            })
        },

        /**
         * Register a listener when an item is selected.
         *
         * @param {function(place: Object)} listener
         */
        'onSelect': function(listener) {
            // TODO
        },

        /**
         * Show the SubWebView.
         * Note: do nothing if the place holder is already here.
         * @private
         */
        '_showSubWebView': function() {
            var self = this;

            // Do nothing if the web view is already displayed
            var subWebView = /** @type {SubWebView} */ Widget.findById(internalController.AUTOCOMPLETION_DIALOG_WEBVIEW_ID);
            if (subWebView) {
                return;
            }

            // Create the web view
            /** @type {HTMLElement} */
            var webViewPlaceHolder = document.createElement('div');
            webViewPlaceHolder.id = internalController.AUTOCOMPLETION_DIALOG_WEBVIEW_ID;
            webViewPlaceHolder.style.position = 'absolute';
            webViewPlaceHolder.style.left = this._anchor.x + 'px';
            webViewPlaceHolder.style.top = this._anchor.y + 'px';
            webViewPlaceHolder.style.width = this._width + 'px';
            webViewPlaceHolder.style.bottom = '10px';
            webViewPlaceHolder.setAttribute('data-otm-widget', 'SubWebView');
            webViewPlaceHolder.setAttribute('data-otm-url', 'extensions/extra-widgets/autocompletion/autocompletiondialog/subwebview/dialog.html');
            webViewPlaceHolder.setAttribute('data-otm-entrypoint', 'extra-widgets/autocompletion/autocompletiondialog/subwebview/entryPoint');
            document.body.appendChild(webViewPlaceHolder);

            // Activate behaviors when the web view is created
            SubWebView.onCreate(internalController.AUTOCOMPLETION_DIALOG_WEBVIEW_ID, function() {
                subWebViewReadyDam.setOpened(true);
            });

            // Create the web view
            webview.layout();
        },

        /**
         * Remove the subwebview web view.
         * @private
         */
        '_removeSubWebView': function() {
            $('#' + internalController.AUTOCOMPLETION_DIALOG_WEBVIEW_ID).remove();
            webview.layout();
        }
    };

    return autoCompletionDialog;
});
