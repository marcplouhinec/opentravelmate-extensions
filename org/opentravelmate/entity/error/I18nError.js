/**
 * Define an internationalization-friendly error.
 *
 * @author Marc Plouhinec
 */

define(['./ErrorCode'], function(ErrorCode) {
    'use strict';

    /**
     * Create an internationalization-friendly error.
     *
     * @param {{code: string, i18nArgs: Array.<string>}} options
     * @constructor
     */
    function I18nError(options) {
        /** @type {string} */
        this.code = options.code || ErrorCode.UNKNOWN_ERROR;
        /** @type {Array.<string>} */
        this.i18nArgs = options.i18nArgs || [];
    }

    I18nError.prototype = new Error();
    I18nError.prototype.constructor = I18nError;

    /**
     * @return {string} Error information.
     */
    I18nError.prototype.toString = function() {
        return this.code + '[' + this.i18nArgs.join(',') + ']';
    };

    return I18nError;
});
