/**
 * Define the webview object that allow JS code to interact with the WebView that contain them.
 *
 * @author Marc Plouhinec
 */

define(['nativeWebView'], function(nativeWebView) {
    'use strict';

    var webview = {

        /**
         * Current WebView ID.
         *
         * @type {String|null}
         */
        'id': null,

        /**
         * Base URL used to create absolute URLs.
         *
         * @type {String|null}
         */
        'baseUrl': null,

        /**
         * SubWebView placeholder "data-otm-*" attributes.
         *
         * @type {Object.<String, String>}
         */
        'additionalParameters': {},

        /**
         * Listeners to the external events.
         *
         * @type {Array.<function(payload: Object)>}
         * @private
         */
        '_externalEventListeners': [],

        /**
         * @type {LayoutManager}
         * @private
         */
        '_layoutManager': null,

        /**
         * Fire an event to a listener that is outside of the WebView.
         *
         * @param {String} eventName
         * @param {Object=} payload
         */
        'fireExternalEvent': function(eventName, payload) {
            payload = payload || {};
            nativeWebView.fireExternalEvent(this.id, eventName, JSON.stringify(payload));
        },

        /**
         * Register a listener for an event that comes from outside.
         *
         * @param {String} eventName
         * @param {function(payload: Object)} listener
         */
        'onExternalEvent': function(eventName, listener) {
            /** @type {Array.<function(payload: Object)>} */
            var listeners = this._externalEventListeners[eventName];

            if (!listeners) {
                listeners = [];
                this._externalEventListeners[eventName] = listeners;
            }

            listeners.push(listener);
        },

        /**
         * Fire an event from outside of the WebView.
         * Note: This function should only be called by the core WebView objects.
         *
         * @param {String} eventName
         * @param {Object} payload
         */
        'fireEventFromExternal': function(eventName, payload) {
            var listeners = this._externalEventListeners[eventName];
            if (listeners) {
                for (var i = 0; i < listeners.length; i += 1) {
                    listeners[i](payload);
                }
            }
        },

        /**
         * Set the widgets size and position based on the position of their
         * place-holders.
         */
        'layout': function() {
            var self = this;

            // Load the LayoutManager lazily
            if (this._layoutManager) {
                this._layoutManager.layout();
            } else {
                require(['extensions/org/opentravelmate/controller/widget/webview/LayoutManager'], function(LayoutManager) {
                    self._layoutManager = new LayoutManager(self.baseUrl);
                    self._layoutManager.layout();
                });
            }
        }
    };

    return webview;
});
