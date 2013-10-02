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
     *     enableHighAccuracy: Boolean,
     *     timeout: Number,
     *     maximumAge: Number
     * }} options
     * @constructor
     */
    function PositionOptions(options) {
        /** @type {Boolean} */
        this.enableHighAccuracy = options.enableHighAccuracy;
        /** @type {Number} */
        this.timeout = options.timeout;
        /** @type {Number} */
        this.maximumAge = options.maximumAge;
    }

    return PositionOptions;
});
