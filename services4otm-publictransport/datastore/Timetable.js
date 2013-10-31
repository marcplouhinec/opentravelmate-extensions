/**
 * Define a timetable.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define(function() {
    'use strict';

    /**
     * Create a new Timetable.
     *
     * @param options
     * @constructor
     */
    function Timetable(options) {
        /**
         * Internal ID.
         *
         * @type {String}
         */
        this.id = options.id;

        /**
         * Period when this timetable is valid.
         *
         * @type {String}
         */
        this.timetablePeriodId = options.timetablePeriodId;

        /**
         * Line where this timetable applies.
         *
         * @type {String}
         */
        this.lineId = options.lineId;

        /**
         * Waypoint ID of the first line bound.
         *
         * @type {String}
         */
        this.direction1Id = options.direction1Id;

        /**
         * Waypoint ID of the second line bound.
         *
         * @type {String}
         */
        this.direction2Id = options.direction2Id;

        /**
         * Time table rows.
         *
         * @type {Array.<{waypointId: String, times: Array.<String>}>}
         */
        this.rows = options.rows;
    }

    return Timetable;
});
