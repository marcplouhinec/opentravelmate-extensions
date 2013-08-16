/**
 * Define a TransportAuthority.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define(function() {
    'use strict';

    /**
     * Create a new TransportAuthority.
     *
     * @param options
     * @constructor
     */
    function TransportAuthority(options) {
        /**
         * Internal ID.
         *
         * @type {String}
         */
        this.id = options.id;

        /**
         * Area name (e.g. Luxembourg).
         *
         * @type {String}
         */
        this.areaName = options.areaName;

        /**
         * Authority name (e.g. VDL).
         *
         * @type {String}
         */
        this.authorityName = options.authorityName;

        /**
         * Zoom-level (0-19).
         *
         * @type {Number}
         */
        this.zoomLevel = options.zoomLevel;

        /**
         * Area center latitude.
         *
         * @type {Number}
         */
        this.latitude = options.latitude;

        /**
         * Area center longitude.
         *
         * @type {Number}
         */
        this.longitude = options.longitude;
    }

    return TransportAuthority;
});
