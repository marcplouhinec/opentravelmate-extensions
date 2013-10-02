/**
 * Define a position error.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define(function() {
    'use strict';

    /**
     * Create new PositionError.
     *
     * @param {{
     *     code: Number,
     *     message: String
     * }} options
     * @constructor
     */
    function PositionError(options) {
        /**
         * @type {Number}
         * @constant
         */
        this.PERMISSION_DENIED = 1;

        /**
         * @type {Number}
         * @constant
         */
        this.POSITION_UNAVAILABLE = 2;

        /**
         * @type {Number}
         * @constant
         */
        this.TIMEOUT = 3;

        /** @type {Number} */
        this.code = options.code;
        /** @type {String} */
        this.message = options.message;
    }

    return PositionError;
});
