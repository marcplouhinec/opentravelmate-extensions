/**
 * Google Place provider entry point.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'place-finder/placeFinder',
    './GooglePlaceProvider'
], function(placeFinder, GooglePlaceProvider) {
    'use strict';

    /**
     * Extension entry point.
     */
    return function main() {
        placeFinder.registerPlaceProvider(new GooglePlaceProvider());
    };
});
