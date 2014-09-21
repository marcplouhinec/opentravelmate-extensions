/**
 * Define shared constants.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define(function() {
    'use strict';

    var constants = {
        /**
         * SubWebView ID.
         *
         * @const
         * @type {String}
         */
        'SUBWEBVIEW_ID': 'itinerary-finder-subwebview',

        /**
         * "Close" event.
         *
         * @const
         * @type {String}
         */
        'CLOSE_EVENT': 'itinerary-finder-close-event',

        /**
         * Event thrown when the user is typing the name of a place and we need to propose him some suggestions.
         *
         * @const
         * @type {String}
         */
        'AUTO_COMPLETE_PLACE_EVENT': 'itinerary-finder-auto-complete-place-event',

        /**
         * Event thrown when some place have been found.
         *
         * @const
         * @type {String}
         */
        'AUTO_COMPLETE_PLACE_RESPONSE_EVENT': 'itinerary-finder-auto-complete-place-response-event'
    };

    return constants;
});
