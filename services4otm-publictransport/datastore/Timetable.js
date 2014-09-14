/**
 * Define a timetable.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define(['./Calendar', './TimetableRow'], function(Calendar, TimetableRow) {
    'use strict';

    /**
     * Create a new Timetable.
     *
     * @param options
     * @constructor
     */
    function Timetable(options) {
        /**
         * Text displayed on the vehicle.
         *
         * @type {String}
         */
        this.headSign = options.headSign;

        /**
         * Calendar when this timetable is valid.
         *
         * @type {Calendar}
         */
        this.calendar = new Calendar(options.calendar);

        /**
         * Rows of the timetable.
         *
         * @type {Array.<TimetableRow>}
         */
        this.rows = [];
        for (var i = 0; i < options.rows.length; i++) {
            this.rows.push(new TimetableRow(options.rows[i]));
        }
    }

    return Timetable;
});
