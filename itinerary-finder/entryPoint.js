/**
 * Itinerary finder entry point.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    '../core/widget/Widget',
    '../core/widget/menu/Menu',
    '../core/widget/menu/MenuItem'
], function(Widget, Menu, MenuItem) {
    'use strict';

    /**
     * Extension entry point.
     */
    return function main() {
        // Add a menu item
        var menuItem = new MenuItem({
            title: 'Find itineraries',
            tooltip: 'Find itineraries',
            iconUrl: 'extensions/itinerary-finder/image/itinerary.png'
        });
        Widget.findByIdAsync('main-menu', 10000, function (/** @type {Menu} */menu) {
            menu.addMenuItem(menuItem);
        });

    };
});
