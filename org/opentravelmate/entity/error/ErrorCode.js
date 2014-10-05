/**
 * Define common error codes.
 *
 * @author Marc Plouhinec
 */

define(function() {
    'use strict';

    /**
     * @enum {String}
     */
    var ErrorCode = {
        UNKNOWN_ERROR: 1,
        INVALID_PARAMETER: 2,
        UNIMPLEMENTED_METHOD: 3
    };

    return ErrorCode;
});
