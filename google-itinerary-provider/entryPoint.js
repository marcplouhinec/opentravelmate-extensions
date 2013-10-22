/**
 * Google Itinerary provider entry point.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    './GoogleItineraryProvider'
], function(GoogleItineraryProvider) {
    'use strict';

    /**
     * Extension entry point.
     */
    return function main() {
        new GoogleItineraryProvider();
    };
});
