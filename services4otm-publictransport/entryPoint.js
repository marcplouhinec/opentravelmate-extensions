/**
 * Services For Open Travel Mate - Public transport information provider - entry point.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    './mapOverlayController'
], function(mapOverlayController) {
    'use strict';

    /**
     * Extension entry point.
     */
    return function main() {
        mapOverlayController.init();
    };
});
