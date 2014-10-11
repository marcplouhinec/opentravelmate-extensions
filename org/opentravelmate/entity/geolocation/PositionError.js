/**
 * Define a position error.
 *
 * @author Marc Plouhinec
 */

define(function() {
    'use strict';

    /**
     * Create new PositionError.
     *
     * @param {{
     *     code: number,
     *     message: string
     * }} options
     * @constructor
     */
    function PositionError(options) {
        /**
         * @type {number}
         * @constant
         */
        this.PERMISSION_DENIED = 1;

        /**
         * @type {number}
         * @constant
         */
        this.POSITION_UNAVAILABLE = 2;

        /**
         * @type {number}
         * @constant
         */
        this.TIMEOUT = 3;

        /** @type {number} */
        this.code = options.code;
        /** @type {string} */
        this.message = options.message;
    }

    return PositionError;
});
