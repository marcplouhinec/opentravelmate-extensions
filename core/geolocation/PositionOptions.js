/**
 * Define position options.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define(function() {
    'use strict';

    /**
     * Create new PositionOptions.
     *
     * @param {{
     *     enableHighAccuracy: =Boolean,
     *     timeout: =Number,
     *     maximumAge: =Number
     * }} options
     * @constructor
     */
    function PositionOptions(options) {
        /** @type {Boolean} */
        this.enableHighAccuracy = options.enableHighAccuracy ? true : false;
        /** @type {Number} */
        this.timeout = options.timeout | 0;
        /** @type {Number} */
        this.maximumAge = options.maximumAge | 0;
    }

    return PositionOptions;
});
