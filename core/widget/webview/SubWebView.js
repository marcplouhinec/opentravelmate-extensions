/**
 * Define the SubWebView widget.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'underscore',
    '../../widget/Widget',
    '../../widget/LayoutParams',
    'nativeWebView'
], function(_, Widget, LayoutParams, nativeWebView) {
    'use strict';

    /**
     * Create a WebView.
     *
     * @param {{id: String, url: String, entrypoint: String, baseUrl: String}} options
     * @constructor
     * @extends Widget
     */
    function SubWebView(options) {
        Widget.call(this, options);

        /** @type {String} */
        this.url = options.url;
        /** @type {String} */
        this.entrypoint = options.entrypoint;
        /** @type {String} */
        this.baseUrl = options.baseUrl;

        /**
         * Listeners to the internal events.
         *
         * @type {Object.<String, Array.<function(payload: Object)>>}
         * @private
         */
        this._internalEventListeners = {};

        // Forward the create event
        this.onInternalEvent(SubWebView.CREATE_EVENT, function forwardCreateEvent(payload) {
            SubWebView.fireCreateEvent(payload.id);
        });
    }

    SubWebView.prototype = new Widget();
    SubWebView.prototype.constructor = SubWebView;

    /**
     * Constant used to send the "create" event to the external JS code.
     *
     * @type {String}
     * @const
     */
    SubWebView.CREATE_EVENT = 'core-widget-webview-create-event';

    /**
     * Event listeners for the "create" and "destroy" events.
     * @private
     */
    SubWebView._eventListeners = {
        /**
         * "create" event listeners by SubWebView ID.
         *
         * @type {Object.<String, Array.<{listener: Function, listenOnce: Boolean}>>}
         */
        'create': {},

        /**
         * "destroy" event listeners by SubWebView ID.
         *
         * @type {Object.<String, Array.<{listener: Function, listenOnce: Boolean}>>}
         */
        'destroy': {}
    };

    /**
     * Register a listener for the 'create' event of the SubWebView.
     *
     * @param {String} id
     *     SubWebView place holder ID.
     * @param {Function} listener
     *     Function called just after the SubWebView is created.
     * @param {Boolean} [listenOnce=true]
     *     If true, the listener is called one time only.
     */
    SubWebView.onCreate = function(id, listener, listenOnce) {
        SubWebView._on('create', id, listener, listenOnce);
    };

    /**
     * Register a listener for the 'destroy' event of the SubWebView.
     *
     * @param {String} id
     *     SubWebView place holder ID.
     * @param {Function} listener
     *     Function called just after the SubWebView is destroyed.
     * @param {Boolean} [listenOnce=true]
     *     If true, the listener is called one time only.
     */
    SubWebView.onDestroy = function(id, listener, listenOnce) {
        SubWebView._on('destroy', id, listener, listenOnce);
    };

    /**
     * Register a listener for the 'create' or 'destroy' event of the SubWebView.
     *
     * @private
     * @param {String} eventName
     *     'create' or 'destroy'.
     * @param {String} id
     *     SubWebView place holder ID.
     * @param {Function} listener
     *     Function called just after the SubWebView is created.
     * @param {Boolean} [listenOnce=true]
     *     If true, the listener is called one time only.
     */
    SubWebView._on = function(eventName, id, listener, listenOnce) {
        var listeners = SubWebView._eventListeners[eventName][id];

        if (!listeners) {
            listeners = [];
            SubWebView._eventListeners[eventName][id] = listeners;
        }

        listeners.push({
            listener: listener,
            listenOnce: _.isBoolean(listenOnce) ? listenOnce : true
        });
    };

    /**
     * Fire the "create" event for the given WebView ID.
     * Note: This function should only be called by the core WebView objects.
     *
     * @param {String} id
     */
    SubWebView.fireCreateEvent = function(id) {
        SubWebView._fireEvent('create', id);
    };

    /**
     * Fire the "destroy" event for the given WebView ID.
     * Note: This function should only be called by the core WebView objects.
     *
     * @param {String} id
     */
    SubWebView.fireDestroyEvent = function(id) {
        SubWebView._fireEvent('destroy', id);
    };

    /**
     * Fire the "create" or "destroy" event for the given WebView ID.
     *
     * @param {String} eventName
     *     'create' or 'destroy'.
     * @param {String} id
     * @private
     */
    SubWebView._fireEvent = function(eventName, id) {
        var listeners = SubWebView._eventListeners[eventName][id];
        if (listeners) {
            listeners = _.filter(listeners, function(/** @type {{listener: Function, listenOnce: Boolean}} */listenerInfo) {
                listenerInfo.listener();
                return !listenerInfo.listenOnce;
            });
            SubWebView._eventListeners[eventName][id] = listeners;
        }
    };

    /**
     * Fire an event to a listener that is inside the SubWebView.
     *
     * @param {String} eventName
     * @param {Object=} payload
     */
    SubWebView.prototype.fireInternalEvent = function(eventName, payload) {
        payload = payload || {};
        nativeWebView.fireInternalEvent(this.id, eventName, JSON.stringify(payload));
    };

    /**
     * Register a listener for an event that occurs inside of the SubWebView.
     *
     * @param {String} eventName
     * @param {function(payload: Object)} listener
     */
    SubWebView.prototype.onInternalEvent = function(eventName, listener) {
        /** @type {Array.<function(payload: Object)>} */
        var listeners = this._internalEventListeners[eventName];

        if (!listeners) {
            listeners = [];
            this._internalEventListeners[eventName] = listeners;
        }

        listeners.push(listener);
    };

    /**
     * Fire an event from inside of the SubWebView.
     * Note: This function should only be called by the core WebView objects.
     *
     * @param {String} eventName
     * @param {Object} payload
     */
    SubWebView.prototype.fireEventFromInternal = function(eventName, payload) {
        var listeners = this._internalEventListeners[eventName];
        if (listeners) {
            _.each(listeners, function(listener) {
                listener(payload);
            });
        }
    };

    /**
     * Build the native view object for the current widget.
     *
     * @param {LayoutParams} layoutParams
     */
    SubWebView.prototype.buildView = function(layoutParams) {
        nativeWebView.buildView(JSON.stringify(layoutParams));
    };

    /**
     * Update the native view object for the current widget.
     *
     * @param {LayoutParams} layoutParams
     */
    SubWebView.prototype.updateView = function(layoutParams) {
        nativeWebView.updateView(JSON.stringify(layoutParams));
    };

    /**
     * Remove the native view object for the current widget.
     */
    SubWebView.prototype.removeView = function() {
        nativeWebView.removeView(this.id);
    };

    return SubWebView;
});
