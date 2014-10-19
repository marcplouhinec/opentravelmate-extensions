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
        /** @type {number} */
        this.code = options.code;
        /** @type {string} */
        this.message = options.message;
    }

    /**
     * @type {number}
     * @constant
     */
    PositionError.PERMISSION_DENIED = 1;

    /**
     * @type {number}
     * @constant
     */
    PositionError.POSITION_UNAVAILABLE = 2;

    /**
     * @type {number}
     * @constant
     */
    PositionError.TIMEOUT = 3;

    return PositionError;
});
