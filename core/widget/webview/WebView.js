/**
 * Define the WebView widget.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'jquery',
    'underscore',
    'core/widget/Widget',
    'core/widget/LayoutParams',
    'core/widget/map/Map',
    'core/widget/menu/Menu',
    'nativeWebView'
], function($, _, Widget, LayoutParams, Map, Menu, nativeWebView) {
    'use strict';

    /**
     * Create a WebView.
     *
     * @param {{id: String, url: String, entrypoint: String, baseUrl: String}} options
     * @constructor
     * @extends Widget
     */
    function WebView(options) {
        Widget.call(this, options);

        /** @type {String} */
        this.url = options.url;
        /** @type {String} */
        this.entrypoint = options.entrypoint;
        /** @type {String} */
        this.baseUrl = options.baseUrl;

        /**
         * Web view children widgets.
         *
         * @type {Array.<Widget>}
         * @private
         */
        this._childViews = [];

        /**
         * Registered event listeners.
         *
         * @type {Object.<String, Array.<function(payload: Object)>>}
         * @private
         */
        this._eventListeners = {};
    }

    WebView.prototype = new Widget();
    WebView.prototype.constructor = WebView;

    /**
     * 'create' event listeners.
     *
     * @type {Object.<String, Array.<Function>>}
     * @private
     */
    WebView._createListenersByWebViewId = {};

    /**
     * 'destroy' event listeners.
     *
     * @type {Object.<String, Array.<Function>>}
     * @private
     */
    WebView._destroyListenersByWebViewId = {};

    /**
     * @return {WebView} WebView where this code is running.
     */
    WebView.getCurrent = function() {
        return window.currentWebView;
    };

    /**
     * Set the current web view.
     *
     * @param {WebView} webView
     */
    WebView.setCurrent = function(webView) {
        window.currentWebView = webView;
    };

    /**
     * Register a listener for the 'create' event of the WebView.
     *
     * @param {String} id
     *     WebView place holder ID.
     * @param {Function} listener
     *     Function called just after the WebView is created.
     */
    WebView.onCreate = function(id, listener) {
        var listeners = WebView._createListenersByWebViewId[id];

        if (!listeners) {
            listeners = [];
            WebView._createListenersByWebViewId[id] = listeners;
        }

        listeners.push(listener);
    };

    /**
     * Register a listener for the 'destroy' event of the WebView.
     *
     * @param {String} id
     *     WebView place holder ID.
     * @param {Function} listener
     *     Function called just before the WebView is destroyed.
     */
    WebView.onDestroy = function(id, listener) {
        var listeners = WebView._destroyListenersByWebViewId[id];

        if (!listeners) {
            listeners = [];
            WebView._destroyListenersByWebViewId[id] = listeners;
        }

        listeners.push(listener);
    };

    /**
     * Fire the 'create' event for the given web view ID.
     * Note: this function should be called from the nativeWebView.
     *
     * @param id WebView ID
     */
    WebView.fireCreateEvent = function(id) {
        var listeners = WebView._createListenersByWebViewId[id];
        if (listeners) {
            _.each(listeners, function(listener) {
                listener();
            });
        }
    };

    /**
     * Fire the 'destroy' event for the given web view ID.
     *
     * @param id WebView ID
     * @private
     */
    WebView._fireDestroyEvent = function(id) {
        var listeners = WebView._destroyListenersByWebViewId[id];
        if (listeners) {
            _.each(listeners, function(listener) {
                listener();
            });
        }
    };

    /**
     * Fire an event to a listener that is outside of the WebView.
     *
     * @param {String} eventName
     * @param {Object=} payload
     */
    WebView.prototype.fireExternalEvent = function(eventName, payload) {
        payload = payload || {};
        nativeWebView.fireExternalEvent(this.id, eventName, JSON.stringify(payload));
    };

    /**
     * Fire an event inside the current WebView.
     * Note: this function should be called from the nativeWebView.
     *
     * @param {String} eventName
     * @param {Object=} payload
     */
    WebView.prototype.fireInternalEvent = function(eventName, payload) {
        /** @type {Array.<function(payload: Object)>} */
        var listeners = this._eventListeners[eventName];

        if (listeners) {
            _.each(listeners, function(listener) {
                listener(payload);
            });
        }
    };

    /**
     * Register a listener for an event that occurs inside the WebView.
     *
     * @param {String} eventName
     * @param {function(payload: Object)} listener
     */
    WebView.prototype.on = function(eventName, listener) {
        /** @type {Array.<function(payload: Object)>} */
        var listeners = this._eventListeners[eventName];

        if (!listeners) {
            listeners = [];
            this._eventListeners[eventName] = listeners;
        }

        listeners.push(listener);
    };

    /**
     * Set the widgets size and position based on the position of their
     * place-holders.
     */
    WebView.prototype.layout = function() {
        var self = this,
            $window = $(window),
            windowWidth = $window.width(),
            windowHeight = $window.height(),
            layoutParamsList = [];

        // Scan each place-holder
        /** @type {Array.<LayoutParams>} */
        $(document.body).find('*[data-otm-widget]').each(function() {
            var $placeholder = $(this);
            /** @type {{left: Number, top: Number}} */
            var offset = $placeholder.offset();
            /** @type {Object.<String, String>} */
            var additionalParameters = {
				'baseUrl': self.baseUrl
			};
            var attributes = $placeholder.get(0).attributes;
            for (var i = 0; i < attributes.length; i += 1) {
                var attr = attributes.item(i);
                if (attr.nodeName.indexOf('data-otm-') === 0) {
                    additionalParameters[attr.nodeName.substring('data-otm-'.length)] = attr.nodeValue;
                }
            }

            layoutParamsList.push(new LayoutParams({
                'id': $placeholder.attr('id'),
                'width': $placeholder.width(),
                'height': $placeholder.height(),
                'x': offset.left,
                'y': offset.top,
                'visible': $placeholder.is(':visible'),
                'additionalParameters': additionalParameters,
                'windowWidth': windowWidth,
                'windowHeight': windowHeight
            }));
        });

        // Update the widgets
        _.each(layoutParamsList, function(layoutParams) {
            // Get the widget if it already exists
            var widget = Widget.findById(layoutParams.id);

            if (!widget) {
                self._createChildWidget(layoutParams);
            } else {
                self._updateChildWidget(layoutParams, widget);
            }
        });

        // Remove widgets that don't have place-holder anymore
        /** @type {Object.<Number, Boolean>} */
        var setExistingPlaceHolderIds = _.reduce(
            layoutParamsList,
            function(setIds, layoutParams){
                setIds[layoutParams.id] = true;
                return setIds;
            },
            {});
        /** @type {Array.<Widget>} */
        var childViewsToDelete = _.filter(this._childViews, function(/** @type {Widget} */ childView) {
            return !setExistingPlaceHolderIds[childView.id] === true;
        });
        _.each(childViewsToDelete, function(childView) {
            self._deleteChildWidget(childView);
        });
    };

    /**
     * Create a widget.
     *
     * @param {LayoutParams} layoutParams
     * @private
     */
    WebView.prototype._createChildWidget = function(layoutParams) {
        switch (layoutParams.additionalParameters['widget']) {
            case 'WebView':
				// Create a WebView
				var childWebView = new WebView({
					id: layoutParams.id,
					url: layoutParams.additionalParameters['url'],
					entrypoint: layoutParams.additionalParameters['entrypoint'],
					baseUrl: this.baseUrl
				});
				childWebView.buildView(layoutParams);
                this._childViews.push(childWebView);
                break;
            case 'Map':
				var childMap = new Map({ id: layoutParams.id });
				childMap.buildView(layoutParams);
                this._childViews.push(childMap);
				break;
            case 'Menu':
                var childMenu =  new Menu({ id: layoutParams.id, baseUrl: this.baseUrl });
                childMenu.buildView(layoutParams);
                this._childViews.push(childMenu);
                break;
        }
    };

    /**
     * Update a widget.
     *
     * @param {LayoutParams} layoutParams
     * @param {Widget} widget
     * @private
     */
    WebView.prototype._updateChildWidget = function(layoutParams, widget) {
        // TODO
    };

    /**
     * Delete a widget.
     *
     * @param {Widget} widget
     * @private
     */
    WebView.prototype._deleteChildWidget = function(widget) {
        nativeWebView.removeView(widget.id);

        Widget.removeById(widget.id);
        this._childViews = _.without(this._childViews, widget);
        WebView._fireDestroyEvent(widget.id);
    };

	/**
     * Build the native view object for the current widget.
     * 
     * @param {LayoutParams} layoutParams
     */
    WebView.prototype.buildView = function(layoutParams) {
    	nativeWebView.buildView(JSON.stringify(layoutParams));
    };

    return WebView;
});
