/**
 * Define the Map widget.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'core/widget/Widget',
    'core/widget/LayoutParams',
    'nativeMap'
], function(Widget, LayoutParams, nativeMap) {
    'use strict';

    /**
     * Create a Map.
     *
     * @param {{id: String}} options
     * @constructor
     * @extends Widget
     */
    function Map(options) {
        Widget.call(this, options);
    }

    Map.prototype = new Widget();
    Map.prototype.constructor = Map;

    /**
     * Build the native view object for the current widget.
     * 
     * @param {LayoutParams} layoutParams
     */
    Map.prototype.buildView = function(layoutParams) {
        nativeMap.buildView(JSON.stringify(layoutParams));
    };

    /**
     * Remove the native view object for the current widget.
     */
    Map.prototype.removeView = function() {
        nativeMap.removeView(this.id);
    };

    return Map;
});
