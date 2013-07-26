/**
 * Define the SubWebView widget.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'jquery',
    'underscore',
    'core/widget/Widget',
    'core/widget/LayoutParams',
    'nativeWebView'
], function($, _, Widget, LayoutParams, nativeWebView) {
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
    }

    SubWebView.prototype = new Widget();
    SubWebView.prototype.constructor = SubWebView;

    /**
     * Event listeners for the "create" and "destroy" events.
     * @private
     */
    SubWebView._eventListeners = {
        /**
         * "create" event listeners by SubWebView ID.
         *
         * @type {Object.<String, Array.<Function>>}
         */
        'create': {},

        /**
         * "destroy" event listeners by SubWebView ID.
         *
         * @type {Object.<String, Array.<Function>>}
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
     */
    SubWebView.onCreate = function(id, listener) {
        SubWebView._on('create', id, listener);
    };

    /**
     * Register a listener for the 'destroy' event of the SubWebView.
     *
     * @param {String} id
     *     SubWebView place holder ID.
     * @param {Function} listener
     *     Function called just after the SubWebView is destroyed.
     */
    SubWebView.onDestroy = function(id, listener) {
        SubWebView._on('destroy', id, listener);
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
     */
    SubWebView._on = function(eventName, id, listener) {
        var listeners = SubWebView._eventListeners[eventName][id];

        if (!listeners) {
            listeners = [];
            SubWebView._eventListeners[eventName][id] = listeners;
        }

        listeners.push(listener);
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
