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
        'SUBWEBVIEW_ID': 'place-selection-menu-subwebview',

        /**
         * "Close" event.
         *
         * @const
         * @type {String}
         */
        'CLOSE_EVENT': 'place-selection-menu-close-event',

        /**
         * "Go there selection" event.
         *
         * @const
         * @type {String}
         */
        'GO_THERE_SELECTED_EVENT': 'place-selection-menu-go-there-event',

        /**
         * "From there selection" event.
         *
         * @const
         * @type {String}
         */
        'FROM_THERE_SELECTED_EVENT': 'place-selection-menu-from-there-event',

        /**
         * "more information selection" event.
         *
         * @const
         * @type {String}
         */
        'MORE_INFORMATION': 'place-selection-menu-more-info-event'
    };

    return constants;
});
