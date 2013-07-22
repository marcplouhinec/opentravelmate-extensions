/**
 * Define the auto-completion dialog external WebView controller.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'jquery',
    'underscore',
    'core/commons/FunctionDam',
    'core/widget/Widget',
    'core/widget/webview/WebView',
    './internalController'
], function($, _, FunctionDam, Widget, WebView, internalController) {
    'use strict';

    var webViewReadyDam = new FunctionDam();

    var externalController = {

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
        '_itemRenderer': function(object) { return '' + object; },

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
         * Show the dialog web view.
         * Note: do nothing if the place holder is already here.
         */
        'showWebView': function() {
            var self = this;

            // Do nothing if the web view is already displayed
            var webView = Widget.findById(internalController.AUTOCOMPLETION_DIALOG_WEBVIEW_ID);
            if (webView) {
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
            webViewPlaceHolder.setAttribute('data-otm-widget', 'WebView');
            webViewPlaceHolder.setAttribute('data-otm-url', 'extensions/core/widget/autocompletiondialog/dialog/dialog.html');
            webViewPlaceHolder.setAttribute('data-otm-entrypoint', 'core/widget/autocompletiondialog/dialog/entryPoint');
            document.body.appendChild(webViewPlaceHolder);

            // Activate behaviors when the web view is created
            WebView.onCreate(internalController.AUTOCOMPLETION_DIALOG_WEBVIEW_ID, function() {
                webViewReadyDam.setOpened(true);
            });

            // Create the web view
            WebView.getCurrent().layout();
        },

        /**
         * Remove the dialog web view.
         */
        'removeWebView': function() {
            $('#' + internalController.AUTOCOMPLETION_DIALOG_WEBVIEW_ID).remove();
            WebView.getCurrent().layout();
        },

        /**
         * @return {boolean} true if the dialog is visible, false if not.
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
        'setItemRenderer': function(itemRenderer) {
            this._itemRenderer = itemRenderer;
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
            if (!webViewReadyDam.isOpened()) {
                webViewReadyDam.executeWhenOpen(function() {
                    self.setItems(items);
                });
                return;
            }

            var renderedItems = _.map(items, this._itemRenderer);
            var webView = Widget.findById(internalController.AUTOCOMPLETION_DIALOG_WEBVIEW_ID);
            webView.fireInternalEvent(internalController.AUTOCOMPLETION_DIALOG_SETITEMS_EVENT, {
                items: renderedItems
            })
        }
    };

    return externalController;
});
