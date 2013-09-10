/**
 * Define the webview object that allow JS code to interact with the WebView that contain them.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'jquery',
    'underscore',
    '../../widget/Widget',
    '../../widget/LayoutParams',
    '../../widget/webview/SubWebView',
    '../../widget/map/Map',
    '../../widget/menu/Menu',
    'nativeWebView'
], function($, _, Widget, LayoutParams, SubWebView, Map, Menu, nativeWebView) {
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
         * Web view children widgets.
         *
         * @type {Array.<Widget>}
         * @private
         */
        '_childViews': [],

        /**
         * Listeners to the external events.
         *
         * @type {Array.<function(payload: Object)>}
         * @private
         */
        '_externalEventListeners': [],

        /**
         * SubWebView placeholder "data-otm-*" attributes.
         *
         * @type {Object.<String, String>}
         */
        'additionalParameters': {},

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
                _.each(listeners, function(listener) {
                    listener(payload);
                });
            }
        },

        /**
         * Set the widgets size and position based on the position of their
         * place-holders.
         */
        'layout': function() {
             var self = this,
                $window = $(window),
                /** @type {Number} */ windowWidth = $window.width(),
                /** @type {Number} */ windowHeight = $window.height(),
                /** @type {Array.<LayoutParams>} */ layoutParamsList = [];

            // Scan each place-holder
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
        },

        /**
         * Create a widget.
         *
         * @param {LayoutParams} layoutParams
         * @private
         */
        '_createChildWidget': function(layoutParams) {
            var widgetType = /** @type {String} */layoutParams.additionalParameters['widget'];
            switch (widgetType) {
                case 'SubWebView':
                    // Create a WebView
                    var childWebView = new SubWebView({
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
                    var childMenu = new Menu({ id: layoutParams.id, baseUrl: this.baseUrl });
                    childMenu.buildView(layoutParams);
                    this._childViews.push(childMenu);
                    break;
                default:
                    console.log('Unknown widget type: ' + widgetType);
                    break;
            }
        },

        /**
         * Update a widget.
         *
         * @param {LayoutParams} layoutParams
         * @param {Widget} widget
         * @private
         */
        '_updateChildWidget': function(layoutParams, widget) {
            widget.updateView(layoutParams);
        },

        /**
         * Delete a widget.
         *
         * @param {Widget} widget
         * @private
         */
        '_deleteChildWidget': function(widget) {
            widget.removeView();
            Widget.removeById(widget.id);
            this._childViews = _.without(this._childViews, widget);
            SubWebView.fireDestroyEvent(widget.id);
        }
    };

    return webview;
});
