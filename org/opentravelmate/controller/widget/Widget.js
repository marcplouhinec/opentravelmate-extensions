/**
 * Define the Widget class.
 *
 * @author Marc Plouhinec
 */

define([
    '../../entity/error/I18nError',
    '../../entity/error/ErrorCode'
], function(I18nError, ErrorCode) {
    'use strict';

    /**
     * Create a widget.
     *
     * @param {{id: string}} options
     * @constructor
     */
    function Widget(options) {
        if (!options || !options.id) {
            return;
        }

        /** @type {string} */
        this.id = options.id;

        // Register this widget
        Widget._widgetById[this.id] = this;
    }

    /**
     * Contains all instances of widgets.
     *
     * @type {Object.<string, Widget>}
     * @private
     */
    Widget._widgetById = {};

    /**
     * Find a widget by its ID.
     *
     * @param {string} id
     * @return {Widget|undefined} Found widget.
     */
    Widget.findById = function(id) {
        return Widget._widgetById[id];
    };

    /**
     * Find a widget by its ID.
     *
     * @param {string} id
     * @param {Number} timeout in milliseconds
     * @param {function(widget: Widget)} callback
     */
    Widget.findByIdAsync = function(id, timeout, callback) {
        var callTime = +new Date();
        function tryFindWidget() {
            var widget = Widget.findById(id);
            if (widget) {
                callback(widget);
            } else {
                var now = +new Date();
                if (callTime + timeout >= now) {
                    setTimeout(tryFindWidget, 100);
                }
            }
        }
        setTimeout(tryFindWidget, 100);
    };

    /**
     * Remove a widget by its ID.
     *
     * @param {string} id
     */
    Widget.removeById = function(id) {
        delete Widget._widgetById[id];
    };

    /**
     * Build the native view object for the current widget.
     * 
     * @param {LayoutParams} layoutParams
     */
    Widget.prototype.buildView = function(layoutParams) {
		throw new I18nError({ code: ErrorCode.UNIMPLEMENTED_METHOD, i18nArgs: ['Widget.prototype.buildView'] });
	};

    /**
     * Update the native view object for the current widget.
     *
     * @param {LayoutParams} layoutParams
     */
    Widget.prototype.updateView = function(layoutParams) {
        throw new I18nError({ code: ErrorCode.UNIMPLEMENTED_METHOD, i18nArgs: ['Widget.prototype.updateView'] });
    };

    /**
     * Remove the native view object for the current widget.
     */
    Widget.prototype.removeView = function() {
        throw new I18nError({ code: ErrorCode.UNIMPLEMENTED_METHOD, i18nArgs: ['Widget.prototype.removeView'] });
    };

    return Widget;
});
