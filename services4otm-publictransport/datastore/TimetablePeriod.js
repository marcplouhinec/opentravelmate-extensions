/**
 * Define a timetable period.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define(function() {
    'use strict';

    /**
     * Create a new TimetablePeriod.
     *
     * @param options
     * @constructor
     */
    function TimetablePeriod(options) {
        /**
         * Internal ID.
         *
         * @type {String}
         */
        this.id = options.id;

        /**
         * Period name (e.g. 'Monday to Friday').
         *
         * @type {String}
         */
        this.name = options.name;

        /**
         * ID of the Transport authority that contains this timetable period.
         *
         * @type {String}
         */
        this.transportAuthorityId = options.transportAuthorityId;
    }

    return TimetablePeriod;
});
