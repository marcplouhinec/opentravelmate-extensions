/**
 * Show a place selection menu.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    '../core/utils/browserUtils',
    '../core/widget/Widget',
    '../core/widget/webview/webview',
    '../core/widget/webview/SubWebView',
    '../place-commons/Place',
    './place-selection-menu-subwebview/constants'
], function(browserUtils, Widget, webview, SubWebView, Place, subWebViewConstants) {

    var placeSelectionMenu = {
        /**
         * @type {HTMLDivElement}
         * @private
         */
        '_subWebViewPlaceHolder': null,

        /**
         * Open the menu popup for the given place.
         *
         * @param {Place} place
         */
        'open': function(place) {
            if (this._subWebViewPlaceHolder) {
                return;
            }

            var self = this;
            var windowDimension = browserUtils.getWindowDimension();
            var subWebViewDimension = {
                width: Math.round(windowDimension.width * 0.9),
                height: 215
            };

            this._subWebViewPlaceHolder = /** @type {HTMLDivElement} */document.createElement('div');
            this._subWebViewPlaceHolder.setAttribute('id', subWebViewConstants.SUBWEBVIEW_ID);
            this._subWebViewPlaceHolder.style.position = 'absolute';
            this._subWebViewPlaceHolder.style.left = ((windowDimension.width - subWebViewDimension.width) / 2) + 'px';
            this._subWebViewPlaceHolder.style.top = ((windowDimension.height - subWebViewDimension.height) / 2) + 'px';
            this._subWebViewPlaceHolder.style.width = subWebViewDimension.width + 'px';
            this._subWebViewPlaceHolder.style.height = subWebViewDimension.height + 'px';
            this._subWebViewPlaceHolder.setAttribute('data-otm-widget', 'SubWebView');
            this._subWebViewPlaceHolder.setAttribute('data-otm-url', 'extensions/place-information/place-selection-menu-subwebview/place-selection-menu.html');
            this._subWebViewPlaceHolder.setAttribute('data-otm-entrypoint', 'extensions/place-information/place-selection-menu-subwebview/entryPoint');
            this._subWebViewPlaceHolder.setAttribute('data-otm-place', JSON.stringify(place));
            document.body.appendChild(this._subWebViewPlaceHolder);

            // Register event handlers when the SubWebView is loaded
            SubWebView.onCreate(subWebViewConstants.SUBWEBVIEW_ID, function() {
                var subWebView = /** @type {SubWebView} */ Widget.findById(subWebViewConstants.SUBWEBVIEW_ID);
                subWebView.onInternalEvent(subWebViewConstants.CLOSE_EVENT, function() {
                    self._handleCloseEvent();
                });
            });

            webview.layout();
        },

        /**
         * Close the menu popup.
         */
        'close': function() {
            if (this._subWebViewPlaceHolder) {
                document.body.removeChild(this._subWebViewPlaceHolder);
                delete this._subWebViewPlaceHolder;
                webview.layout();
            }
        },

        /**
         * Handle the CLOSE event.
         *
         * @private
         */
        '_handleCloseEvent': function() {
            // Close the dialog box
            this.close();
        }
    };

    return placeSelectionMenu;
});