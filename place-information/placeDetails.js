/**
 * Show the details of a place.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    '../core/utils/browserUtils',
    '../core/widget/Widget',
    '../core/widget/webview/webview',
    '../core/widget/webview/SubWebView',
    '../place-commons/Place',
    './place-details-subwebview/constants'
], function(browserUtils, Widget, webview, SubWebView, Place, subWebViewConstants) {

    var placeDetails = {
        /**
         * @type {HTMLDivElement}
         * @private
         */
        '_subWebViewPlaceHolder': null,

        /**
         * @type {HTMLDivElement}
         * @private
         */
        '_placeProviderSubWebViewPlaceHolder': null,

        /**
         * Open the details panel for the given place.
         *
         * @param {Place} place
         */
        'open': function(place) {
            if (this._subWebViewPlaceHolder) {
                return;
            }

            var self = this;

            // Create the details SubWebView place holder
            this._subWebViewPlaceHolder = /** @type {HTMLDivElement} */document.createElement('div');
            this._subWebViewPlaceHolder.setAttribute('id', subWebViewConstants.SUBWEBVIEW_ID);
            this._subWebViewPlaceHolder.style.position = 'absolute';
            this._subWebViewPlaceHolder.style.left = '0px';
            this._subWebViewPlaceHolder.style.top = '0px';
            this._subWebViewPlaceHolder.style.width = '100%';
            this._subWebViewPlaceHolder.style.height = '100%';
            this._subWebViewPlaceHolder.setAttribute('data-otm-widget', 'SubWebView');
            this._subWebViewPlaceHolder.setAttribute('data-otm-url', 'extensions/place-information/place-details-subwebview/place-details.html');
            this._subWebViewPlaceHolder.setAttribute('data-otm-entrypoint', 'extensions/place-information/place-details-subwebview/entryPoint');
            this._subWebViewPlaceHolder.setAttribute('data-otm-place', JSON.stringify(place));
            document.body.appendChild(this._subWebViewPlaceHolder);

            // Create the place provider SubWebView
            this._placeProviderSubWebViewPlaceHolder = /** @type {HTMLDivElement} */document.createElement('div');
            this._placeProviderSubWebViewPlaceHolder.setAttribute('id', subWebViewConstants.PLACE_PROVIDER_SUBWEBVIEW_ID);
            this._placeProviderSubWebViewPlaceHolder.style.position = 'absolute';
            this._placeProviderSubWebViewPlaceHolder.style.left = '0px';
            this._placeProviderSubWebViewPlaceHolder.style.right = '0px';
            this._placeProviderSubWebViewPlaceHolder.style.top = '66px';
            this._placeProviderSubWebViewPlaceHolder.style.bottom = '0px';
            this._placeProviderSubWebViewPlaceHolder.setAttribute('data-otm-widget', 'SubWebView');
            place.placeProvider.showPlaceDetails(place, this._placeProviderSubWebViewPlaceHolder);
            document.body.appendChild(this._placeProviderSubWebViewPlaceHolder);

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
         * Close the details panel.
         */
        'close': function() {
            if (this._subWebViewPlaceHolder) {
                document.body.removeChild(this._placeProviderSubWebViewPlaceHolder);
                delete this._placeProviderSubWebViewPlaceHolder;
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

    return placeDetails;
});