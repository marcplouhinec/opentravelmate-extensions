/**
 * Define a timetable row.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define(function() {
    'use strict';

    /**
     * Create a new TimetableRow.
     *
     * @param options
     * @constructor
     */
    function TimetableRow(options) {
        /**
         * Stop ID.
         *
         * @type {String}
         */
        this.stopId = options.stopId;

        /**
         * Stop name.
         *
         * @type {String}
         */
        this.stopName = options.stopName;

        /**
         * Row times (if no time is present, the cell contains an empty string).
         *
         * @type {Array.<String>}
         */
        this.times = options.times;
    }

    return TimetableRow;
});
