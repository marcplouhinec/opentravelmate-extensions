/**
 * Define a dialog box that will appear as a modal popup with a close button.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'jquery',
    '../../core/widget/Widget',
    '../../core/widget/webview/webview',
    '../../core/widget/webview/SubWebView',
    './subwebview/constants'
], function($, Widget, webview, SubWebView, subWebViewConstants) {
    'use strict';

    /**
     * @constant
     * @type {String}
     */
    var DIALOG_WEBVIEW_ID_PREFIX = 'dialog-subwebview-';

    /**
     * @type {Number}
     */
    var nextDialogBoxIdSuffix = 1;

    /**
     * Create a dialog box.
     *
     * @param {{
     *     title: String=,
     *     iconUrl:String=,
     *     contentUrl:String=,
     *     width:Number=,
     *     height:Number=
     * }} options
     * @constructor
     */
    function DialogBox(options) {
        /**
         * @type {String}
         */
        this.subWebViewId = DIALOG_WEBVIEW_ID_PREFIX + nextDialogBoxIdSuffix;
        nextDialogBoxIdSuffix += 1;

        /**
         * @type {String}
         */
        this.title = options.title || '';

        /**
         * @type {String}
         */
        this.iconUrl = options.iconUrl || null;

        /**
         * @type {String}
         */
        this.contentUrl = options.contentUrl || null;

        /**
         * @type {Number}
         */
        this.width = options.width || Math.round($(window).width() * 0.9);

        /**
         * @type {Number}
         */
        this.height = options.height || 100;

        /**
         * @type {HTMLDivElement=}
         * @private
         */
        this._subWebViewPlaceHolder = undefined;
    }

    /**
     * Open the dialog box (create a sub web view).
     */
    DialogBox.prototype.open = function() {
        if (this._subWebViewPlaceHolder) {
            return;
        }
        var self = this;
        var $window = $(window);

        this._subWebViewPlaceHolder = document.createElement('div');
        this._subWebViewPlaceHolder.setAttribute('id', this.subWebViewId);
        this._subWebViewPlaceHolder.style.position = 'absolute';
        this._subWebViewPlaceHolder.style.left = (($window.width() - this.width) / 2) + 'px';
        this._subWebViewPlaceHolder.style.top = (($window.height() - this.height) / 2) + 'px';
        this._subWebViewPlaceHolder.style.width = this.width + 'px';
        this._subWebViewPlaceHolder.style.height = this.height + 'px';
        this._subWebViewPlaceHolder.setAttribute('data-otm-widget', 'SubWebView');
        this._subWebViewPlaceHolder.setAttribute('data-otm-url', 'extensions/extra-widgets/dialogbox/subwebview/dialog.html');
        this._subWebViewPlaceHolder.setAttribute('data-otm-entrypoint', 'extensions/extra-widgets/dialogbox/subwebview/entryPoint');
        this._subWebViewPlaceHolder.setAttribute('data-otm-dialogboxtitle', this.title);
        this._subWebViewPlaceHolder.setAttribute('data-otm-dialogboxiconurl', this.iconUrl);
        this._subWebViewPlaceHolder.setAttribute('data-otm-dialogboxcontenturl', this.contentUrl);
        document.body.appendChild(this._subWebViewPlaceHolder);

        // Register event handlers when the SubWebView is loaded
        SubWebView.onCreate(this.subWebViewId, function() {
            var subWebView = self.getSubWebView();
            subWebView.onInternalEvent(subWebViewConstants.DIALOGBOX_CLOSE_EVENT, function() {
                self._handleCloseEvent();
            });
        });

        webview.layout();
    };

    /**
     * Close the dialog box (remove the sub web view).
     */
    DialogBox.prototype.close = function() {
        if (this._subWebViewPlaceHolder) {
            document.body.removeChild(this._subWebViewPlaceHolder);
            delete this._subWebViewPlaceHolder;
            webview.layout();
        }
    };

    /**
     * Register a CLOSE event listener.
     *
     * @param {Function} listener
     */
    DialogBox.prototype.onClose = function(listener) {
        // TODO
    };

    /**
     * Get the dialog box sub web view.
     *
     * @return {SubWebView}
     */
    DialogBox.prototype.getSubWebView = function() {
        return /** @type {SubWebView} */ Widget.findById(this.subWebViewId);
    }

    /**
     * Handle the CLOSE event.
     *
     * @private
     */
    DialogBox.prototype._handleCloseEvent = function() {
        // Call the CLOSE listeners
        // TODO

        // Close the dialog box
        this.close();
    }

    return DialogBox;
});
