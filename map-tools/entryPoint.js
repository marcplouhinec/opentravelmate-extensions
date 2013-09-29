/**
 * Map tools entry point.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    '../core/widget/Widget',
    './satelliteButtonHandler'
], function(Widget, satelliteButtonHandler) {
    'use strict';

    /**
     * Extension entry point.
     */
    return function main() {
        Widget.findByIdAsync('map', 10000, function(map) {
            satelliteButtonHandler.createButton(map);
        });
    };
});
