/**
 * WebService Error.
 *
 * @author Marc Plouhinec
 */

define(function() {
    'use strict';

    /**
     * Build a Web Service error.
     *
     * @param {String} errorCode
     * @param {String} errorMessage
     * @constructor
     */
    function WSError(errorCode, errorMessage) {
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
    }

    WSError.prototype = new Error();
    WSError.prototype.constructor = WSError;

    return WSError;
});
