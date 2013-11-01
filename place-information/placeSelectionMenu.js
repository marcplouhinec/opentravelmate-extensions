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
    '../itinerary-finder/itineraryFinder',
    './placeDetails',
    './place-selection-menu-subwebview/constants'
], function(browserUtils, Widget, webview, SubWebView, Place, itineraryFinder, placeDetails, subWebViewConstants) {

    var placeSelectionMenu = {
        /**
         * @type {HTMLDivElement}
         * @private
         */
        '_subWebViewPlaceHolder': null,

        /**
         * @type {Place}
         * @private
         */
        '_place': null,

        /**
         * @type {Array.<function(place: Place)>}
         * @private
         */
        '_menuOpenedListeners': [],

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
            this._place = place;
            var windowDimension = browserUtils.getWindowDimension();
            var subWebViewDimension = {
                width: Math.round(windowDimension.width * 0.9),
                height: 215
            };
            if (subWebViewDimension.width > 350) {
                subWebViewDimension.width = 350;
            }

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
                subWebView.onInternalEvent(subWebViewConstants.GO_THERE_SELECTED_EVENT, function() {
                    self._handleItemSelectionEvent(subWebViewConstants.GO_THERE_SELECTED_EVENT);
                });
                subWebView.onInternalEvent(subWebViewConstants.FROM_THERE_SELECTED_EVENT, function() {
                    self._handleItemSelectionEvent(subWebViewConstants.FROM_THERE_SELECTED_EVENT);
                });
                subWebView.onInternalEvent(subWebViewConstants.MORE_INFORMATION, function() {
                    self._handleItemSelectionEvent(subWebViewConstants.MORE_INFORMATION);
                });
            });

            webview.layout();

            // Call the opened listeners
            for (var i = 0; i < this._menuOpenedListeners.length; i += 1) {
                this._menuOpenedListeners[i](place);
            }
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
         * Register a listener that will be called when the menu is opened.
         *
         * @param {function(place: Place)} listener
         */
        'onMenuOpened': function(listener) {
            this._menuOpenedListeners.push(listener);
        },

        /**
         * Handle the CLOSE event.
         *
         * @private
         */
        '_handleCloseEvent': function() {
            // Close the dialog box
            this.close();
        },

        /**
         * Handle the ITEM SELECTION event.
         *
         * @private
         */
        '_handleItemSelectionEvent': function(eventName) {
            switch (eventName) {
                case subWebViewConstants.GO_THERE_SELECTED_EVENT:
                    this.close();
                    itineraryFinder.setDestinationPlace(this._place);
                    break;
                case subWebViewConstants.FROM_THERE_SELECTED_EVENT:
                    this.close();
                    itineraryFinder.setStartingPlace(this._place);
                    break;
                case subWebViewConstants.MORE_INFORMATION:
                    this.close();
                    placeDetails.open(this._place);
                    break;
            }
        }
    };

    return placeSelectionMenu;
});