/**
 * Define a calendar.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define(function() {
    'use strict';

    /**
     * Create a new Calendar.
     *
     * @param options
     * @constructor
     */
    function Calendar(options) {
        /**
         * Internal ID.
         *
         * @type {String}
         */
        this.id = options.id;

        /**
         * Is it applicable monday?
         *
         * @type {boolean}
         */
        this.monday = options.monday;

        /**
         * Is it applicable tuesday?
         *
         * @type {boolean}
         */
        this.tuesday = options.tuesday;

        /**
         * Is it applicable wednesday?
         *
         * @type {boolean}
         */
        this.wednesday = options.wednesday;

        /**
         * Is it applicable thursday?
         *
         * @type {boolean}
         */
        this.thursday = options.thursday;

        /**
         * Is it applicable friday?
         *
         * @type {boolean}
         */
        this.friday = options.friday;

        /**
         * Is it applicable saturday?
         *
         * @type {boolean}
         */
        this.saturday = options.saturday;

        /**
         * Is it applicable sunday?
         *
         * @type {boolean}
         */
        this.sunday = options.sunday;

        /**
         * Date when this calendar starts to apply.
         *
         * @type {String}
         */
        this.startDate = options.startDate;

        /**
         * Date when this calendar ends to apply.
         *
         * @type {String}
         */
        this.endDate = options.endDate;

        var days = [];
        if (this.monday) { days.push('Monday'); }
        if (this.tuesday) { days.push('Tuesday'); }
        if (this.wednesday) { days.push('Wednesday'); }
        if (this.thursday) { days.push('Thursday'); }
        if (this.friday) { days.push('Friday'); }
        if (this.saturday) { days.push('Saturday'); }
        if (this.sunday) { days.push('Sunday'); }
        if (this.id.indexOf('public_holiday') !== -1) { days.push('Public holidays'); }

        /**
         * Calendar name.
         *
         * @type {String}
         */
        this.name = days.join(', ');
    }

    return Calendar;
});
