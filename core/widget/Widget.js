/**
 * Define the Widget class.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'core/commons/I18nError',
    'core/commons/ErrorCode',
    'core/widget/LayoutParams'],
function(I18nError, ErrorCode, LayoutParams) {
    'use strict';

    /**
     * Create a widget.
     *
     * @param {{id: String}} options
     * @constructor
     */
    function Widget(options) {
        if (!options || !options.id) {
            return;
        }

        /** @type {String} */
        this.id = options.id;

        // Register this widget
        Widget._widgetById[this.id] = this;
    }

    /**
     * Contains all instances of widgets.
     *
     * @type {Object.<String, Widget>}
     * @private
     */
    Widget._widgetById = {};

    /**
     * Find a widget by its ID.
     *
     * @param {String} id
     * @return {Widget|undefined} Found widget.
     */
    Widget.findById = function(id) {
        return Widget._widgetById[id];
    };

    /**
     * Remove a widget by its ID.
     *
     * @param {String} id
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
     * Remove the native view object for the current widget.
     */
    Widget.prototype.removeView = function() {
        throw new I18nError({ code: ErrorCode.UNIMPLEMENTED_METHOD, i18nArgs: ['Widget.prototype.removeView'] });
    };

    return Widget;
});
