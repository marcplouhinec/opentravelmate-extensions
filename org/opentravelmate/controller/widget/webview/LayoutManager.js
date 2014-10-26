/**
 * Handle widget layout.
 *
 * @author Marc Plouhinec
 */

define([
    'jquery',
    'lodash',
    '../../widget/Widget',
    '../../widget/LayoutParams',
    '../../widget/webview/SubWebView',
    '../../widget/map/Map'
], function($, _, Widget, LayoutParams, SubWebView, Map) {
    'use strict';

    /**
     * Create a new LayoutManager.
     *
     * @param {String} baseUrl
     *   Base URL used to create absolute URLs.
     * @constructor
     */
    function LayoutManager(baseUrl) {
        /**
         * Web view children widgets.
         *
         * @type {Array.<Widget>}
         * @private
         */
        this._childViews = [];

        /**
         * Base URL used to create absolute URLs.
         *
         * @type {String}
         * @private
         */
        this._baseUrl = baseUrl;
    }

    /**
     * Set the widgets size and position based on the position of their
     * place-holders.
     */
    LayoutManager.prototype.layout = function() {
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
                'baseUrl': self._baseUrl
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
    LayoutManager.prototype._createChildWidget = function(layoutParams) {
        var widgetType = /** @type {String} */layoutParams.additionalParameters['widget'];
        switch (widgetType) {
            case 'SubWebView':
                // Create a WebView
                var childWebView = new SubWebView({
                    id: layoutParams.id,
                    url: layoutParams.additionalParameters['url'],
                    entrypoint: layoutParams.additionalParameters['entrypoint'],
                    baseUrl: this._baseUrl
                });
                childWebView.buildView(layoutParams);
                this._childViews.push(childWebView);
                break;
            case 'Map':
                var childMap = new Map({ id: layoutParams.id });
                childMap.buildView(layoutParams);
                this._childViews.push(childMap);
                break;
            default:
                console.log('Unknown widget type: ' + widgetType);
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
    LayoutManager.prototype._updateChildWidget = function(layoutParams, widget) {
        widget.updateView(layoutParams);
    };

    /**
     * Delete a widget.
     *
     * @param {Widget} widget
     * @private
     */
    LayoutManager.prototype._deleteChildWidget = function(widget) {
        widget.removeView();
        Widget.removeById(widget.id);
        this._childViews = _.without(this._childViews, widget);
        SubWebView.fireDestroyEvent(widget.id);
    };

    return LayoutManager;
});
