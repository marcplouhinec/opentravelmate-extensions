/**
 * Itinerary finder entry point.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    '../core/widget/Widget',
    '../core/widget/menu/Menu',
    '../core/widget/menu/MenuItem',
    './itineraryFinder'
], function(Widget, Menu, MenuItem, itineraryFinder) {
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
        var menu = /** @type {Menu} */ Widget.findById('main-menu');
        menu.addMenuItem(menuItem);

        // Listen to the menu item click event
        menuItem.onClick(function() {
            // Show the itinerary finder web view.
            itineraryFinder.open();
        });
    };
});
